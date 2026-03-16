export function generateCanvasHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:100%; height:100%; overflow:hidden; background:#111; touch-action:none; }
#container { width:100%; height:100%; position:relative; overflow:hidden; }
#canvas { position:absolute; top:0; left:0; width:100%; height:100%; }
</style>
</head>
<body>
<div id="container">
  <canvas id="canvas"></canvas>
</div>
<script>
(function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d', { willReadFrequently: true });

  var bgCanvas = document.createElement('canvas');
  var bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true });
  var colorCanvas = document.createElement('canvas');
  var colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true });
  var linesCanvas = document.createElement('canvas');
  var linesCtx = linesCanvas.getContext('2d');

  // Clip mask canvas — holds the region mask for current stroke
  var clipCanvas = document.createElement('canvas');
  var clipCtx = clipCanvas.getContext('2d', { willReadFrequently: true });

  var W = 0, H = 0;
  var cssW = 0, cssH = 0;
  var fitW = 0, fitH = 0, fitOffX = 0, fitOffY = 0;
  var imageLoaded = false;

  // Boundary data: stores which pixels are "walls" (black lines)
  var wallPixels = null; // Uint8Array, 1 = wall, 0 = open

  var currentTool = 'fill';
  var currentColor = '#FF0000';
  var brushSize = 14;
  var brushOpacity = 1.0;

  var historyStack = [];
  var historyIndex = -1;
  var MAX_HISTORY = 20;

  var scale = 1;
  var panX = 0, panY = 0;

  var drawing = false;
  var lastX = 0, lastY = 0;
  var points = [];
  var hasClipMask = false;

  var pointers = {};
  var pinching = false;
  var pinchStartDist = 0;
  var pinchStartScale = 1;
  var pinchMidX = 0, pinchMidY = 0;
  var pinchStartPanX = 0, pinchStartPanY = 0;

  function send(msg) {
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(msg));
  }

  function sendHistory() {
    send({ type: 'historyChanged', canUndo: historyIndex > 0, canRedo: historyIndex < historyStack.length - 1 });
  }

  function pushHistory() {
    historyStack = historyStack.slice(0, historyIndex + 1);
    var data = colorCtx.getImageData(0, 0, W, H);
    historyStack.push(data);
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    historyIndex = historyStack.length - 1;
    sendHistory();
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    colorCtx.putImageData(historyStack[historyIndex], 0, 0);
    composite();
    sendHistory();
  }

  function redo() {
    if (historyIndex >= historyStack.length - 1) return;
    historyIndex++;
    colorCtx.putImageData(historyStack[historyIndex], 0, 0);
    composite();
    sendHistory();
  }

  function computeFit() {
    var scaleX = cssW / W, scaleY = cssH / H;
    var s = Math.min(scaleX, scaleY);
    fitW = W * s; fitH = H * s;
    fitOffX = (cssW - fitW) / 2;
    fitOffY = (cssH - fitH) / 2;
  }

  function composite() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.fillStyle = '#fff';
    ctx.fillRect(fitOffX, fitOffY, fitW, fitH);
    ctx.drawImage(colorCanvas, 0, 0, W, H, fitOffX, fitOffY, fitW, fitH);
    ctx.drawImage(linesCanvas, 0, 0, W, H, fitOffX, fitOffY, fitW, fitH);
    ctx.restore();
  }

  function extractLines() {
    linesCtx.drawImage(bgCanvas, 0, 0);
    var imgData = linesCtx.getImageData(0, 0, W, H);
    var d = imgData.data;
    wallPixels = new Uint8Array(W * H);
    for (var i = 0; i < d.length; i += 4) {
      var lum = d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114;
      if (lum > 200) {
        d[i+3] = 0;
      } else {
        d[i] = 0; d[i+1] = 0; d[i+2] = 0;
        d[i+3] = Math.min(255, Math.round((255 - lum) * 1.5));
        wallPixels[i / 4] = 1;
      }
    }
    linesCtx.putImageData(imgData, 0, 0);
  }

  function cssToImageCoords(cssPosX, cssPosY) {
    var baseCssX = (cssPosX - panX) / scale;
    var baseCssY = (cssPosY - panY) / scale;
    var ix = ((baseCssX - fitOffX) / fitW) * W;
    var iy = ((baseCssY - fitOffY) / fitH) * H;
    return {
      x: Math.max(0, Math.min(W - 1, ix)),
      y: Math.max(0, Math.min(H - 1, iy))
    };
  }

  function scaledBrushSize() {
    return brushSize * (W / fitW);
  }

  // =================== REGION MASK ===================
  // Build a clip mask by flood-filling from the touch point,
  // stopping at black line boundaries. The mask defines which
  // pixels the drawing tools are allowed to paint on.
  function buildClipMask(startX, startY) {
    var sx = Math.round(startX);
    var sy = Math.round(startY);
    if (sx < 0 || sx >= W || sy < 0 || sy >= H) { hasClipMask = false; return; }

    // If starting on a wall pixel, no clipping
    if (wallPixels[sy * W + sx]) { hasClipMask = false; return; }

    clipCanvas.width = W;
    clipCanvas.height = H;
    clipCtx.clearRect(0, 0, W, H);

    var maskData = clipCtx.createImageData(W, H);
    var md = maskData.data;
    var visited = new Uint8Array(W * H);
    var stack = [sx, sy];

    while (stack.length > 0) {
      var y = stack.pop();
      var x = stack.pop();
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      var pi = y * W + x;
      if (visited[pi]) continue;
      if (wallPixels[pi]) continue;

      // Scanline
      var lx = x;
      while (lx > 0 && !wallPixels[y * W + (lx - 1)] && !visited[y * W + (lx - 1)]) lx--;
      var rx = x;
      while (rx < W - 1 && !wallPixels[y * W + (rx + 1)] && !visited[y * W + (rx + 1)]) rx++;

      for (var fx = lx; fx <= rx; fx++) {
        var fpi = y * W + fx;
        visited[fpi] = 1;
        var fi = fpi * 4;
        md[fi] = 255; md[fi+1] = 255; md[fi+2] = 255; md[fi+3] = 255;

        if (y > 0 && !visited[(y-1) * W + fx]) stack.push(fx, y - 1);
        if (y < H - 1 && !visited[(y+1) * W + fx]) stack.push(fx, y + 1);
      }
    }

    clipCtx.putImageData(maskData, 0, 0);
    hasClipMask = true;
  }

  // Apply clip mask to colorCanvas: only keep pixels where mask is white
  function applyClipMask(beforeData) {
    if (!hasClipMask) return;
    var currentData = colorCtx.getImageData(0, 0, W, H);
    var cd = currentData.data;
    var bd = beforeData.data;
    var maskData = clipCtx.getImageData(0, 0, W, H);
    var md = maskData.data;

    for (var i = 0; i < cd.length; i += 4) {
      // If mask pixel is transparent (not in region), revert to before-stroke data
      if (md[i + 3] === 0) {
        cd[i] = bd[i];
        cd[i+1] = bd[i+1];
        cd[i+2] = bd[i+2];
        cd[i+3] = bd[i+3];
      }
    }
    colorCtx.putImageData(currentData, 0, 0);
  }

  // =================== FLOOD FILL ===================
  function floodFill(startX, startY, fillColor) {
    var sx = Math.round(startX);
    var sy = Math.round(startY);
    if (sx < 0 || sx >= W || sy < 0 || sy >= H) return;

    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = W; tempCanvas.height = H;
    var tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#fff';
    tempCtx.fillRect(0, 0, W, H);
    tempCtx.drawImage(colorCanvas, 0, 0);
    tempCtx.drawImage(bgCanvas, 0, 0);

    var sourceData = tempCtx.getImageData(0, 0, W, H);
    var sd = sourceData.data;
    var idx = (sy * W + sx) * 4;
    var tr = sd[idx], tg = sd[idx+1], tb = sd[idx+2], ta = sd[idx+3];

    var fc = parseColor(fillColor);
    if (Math.abs(tr - fc.r) < 5 && Math.abs(tg - fc.g) < 5 && Math.abs(tb - fc.b) < 5) return;

    var colorData = colorCtx.getImageData(0, 0, W, H);
    var cd = colorData.data;
    var tolerance = 32;
    var visited = new Uint8Array(W * H);
    var stack = [sx, sy];

    function matches(i) {
      return Math.abs(sd[i] - tr) <= tolerance &&
             Math.abs(sd[i+1] - tg) <= tolerance &&
             Math.abs(sd[i+2] - tb) <= tolerance &&
             Math.abs(sd[i+3] - ta) <= tolerance;
    }

    while (stack.length > 0) {
      var y = stack.pop();
      var x = stack.pop();
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      var pi = y * W + x;
      if (visited[pi]) continue;
      var si = pi * 4;
      if (!matches(si)) continue;

      var lx = x;
      while (lx > 0 && matches(((y * W) + (lx - 1)) * 4) && !visited[y * W + (lx - 1)]) lx--;
      var rx = x;
      while (rx < W - 1 && matches(((y * W) + (rx + 1)) * 4) && !visited[y * W + (rx + 1)]) rx++;

      for (var fx = lx; fx <= rx; fx++) {
        var fpi = y * W + fx;
        visited[fpi] = 1;
        var fi = fpi * 4;
        cd[fi] = fc.r; cd[fi+1] = fc.g; cd[fi+2] = fc.b; cd[fi+3] = 255;
        sd[fi] = fc.r; sd[fi+1] = fc.g; sd[fi+2] = fc.b; sd[fi+3] = 255;
        if (y > 0 && !visited[(y-1) * W + fx]) stack.push(fx, y - 1);
        if (y < H - 1 && !visited[(y+1) * W + fx]) stack.push(fx, y + 1);
      }
    }

    colorCtx.putImageData(colorData, 0, 0);
    composite();
    pushHistory();
  }

  function parseColor(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  }

  // =================== EYEDROPPER ===================
  function eyedrop(imgX, imgY) {
    var px = Math.round(imgX), py = Math.round(imgY);
    if (px < 0 || px >= W || py < 0 || py >= H) return;
    var tempC = document.createElement('canvas');
    tempC.width = W; tempC.height = H;
    var tCtx = tempC.getContext('2d');
    tCtx.fillStyle = '#fff';
    tCtx.fillRect(0, 0, W, H);
    tCtx.drawImage(colorCanvas, 0, 0);
    var d = tCtx.getImageData(px, py, 1, 1).data;
    var hex = '#' + ((1 << 24) + (d[0] << 16) + (d[1] << 8) + d[2]).toString(16).slice(1).toUpperCase();
    send({ type: 'eyedropperColor', color: hex });
  }

  // =================== DRAWING TOOLS ===================
  var TOOL_CONFIG = {
    brush:        { opacity: 0.8, lineCap: 'round', lineJoin: 'round' },
    eraser:       { opacity: 1.0, lineCap: 'round', lineJoin: 'round', compositeOp: 'destination-out' },
    crayon:       { opacity: 1.0, lineCap: 'round', lineJoin: 'round', dash: [4,2,1,2] },
    thick_pencil: { opacity: 1.0, lineCap: 'round', lineJoin: 'round' },
    fine_tip:     { opacity: 1.0, lineCap: 'round', lineJoin: 'round' },
    marker:       { opacity: 1.0, lineCap: 'square', lineJoin: 'round' },
    flat_brush:   { opacity: 0.85, lineCap: 'butt', lineJoin: 'miter' },
    laser:        { opacity: 1.0, lineCap: 'round', lineJoin: 'round', glow: true, glowWidth: 12, glowOpacity: 0.3 },
    neon:         { opacity: 1.0, lineCap: 'round', lineJoin: 'round', glow: true, glowWidth: 20, glowOpacity: 0.25 },
    watercolor:   { opacity: 0.15, lineCap: 'round', lineJoin: 'round', passes: 3, passWidthInc: 3 },
    fuzzy:        { opacity: 0.6, lineCap: 'round', lineJoin: 'round', strandCount: 6 },
    spray:        { opacity: 0.6, scatter: 'uniform' },
    glitter:      { opacity: 0.8, scatter: 'uniform' },
    airbrush:     { opacity: 0.4, scatter: 'gaussian' }
  };

  var beforeStrokeData = null; // ImageData snapshot before current stroke

  function beginStroke(imgX, imgY) {
    drawing = true;
    points = [{ x: imgX, y: imgY }];
    lastX = imgX; lastY = imgY;
    send({ type: 'drawStart' });

    // Build clip mask from touch point
    buildClipMask(imgX, imgY);

    // Snapshot before stroke for clipping
    beforeStrokeData = colorCtx.getImageData(0, 0, W, H);

    var cfg = TOOL_CONFIG[currentTool];
    if (cfg && cfg.scatter) {
      drawScatterAt(imgX, imgY);
      if (hasClipMask) applyClipMask(beforeStrokeData);
      composite();
    }
  }

  function moveStroke(imgX, imgY) {
    if (!drawing) return;
    var dx = imgX - lastX, dy = imgY - lastY;
    var minDist = 4 * (W / cssW) * (W / cssW);
    if (dx * dx + dy * dy < minDist) return;

    points.push({ x: imgX, y: imgY });
    lastX = imgX; lastY = imgY;

    var cfg = TOOL_CONFIG[currentTool];
    if (cfg && cfg.scatter) {
      drawScatterAt(imgX, imgY);
      if (hasClipMask) applyClipMask(beforeStrokeData);
      composite();
      return;
    }

    // Restore before-stroke state, redraw full path, then clip
    if (hasClipMask && beforeStrokeData) {
      colorCtx.putImageData(beforeStrokeData, 0, 0);
    }
    drawFullPath();
    if (hasClipMask && beforeStrokeData) {
      applyClipMask(beforeStrokeData);
    }
    composite();
  }

  function endStroke() {
    if (!drawing) return;
    drawing = false;
    send({ type: 'drawEnd' });

    if (currentTool === 'fuzzy' && points.length > 1) {
      if (hasClipMask && beforeStrokeData) {
        colorCtx.putImageData(beforeStrokeData, 0, 0);
      }
      drawFuzzy();
      if (hasClipMask && beforeStrokeData) {
        applyClipMask(beforeStrokeData);
      }
      composite();
    }

    if (points.length > 0) {
      pushHistory();
    }
    points = [];
    hasClipMask = false;
    beforeStrokeData = null;
  }

  function drawFullPath() {
    if (points.length < 2) return;
    var cfg = TOOL_CONFIG[currentTool] || {};
    var c = colorCtx;
    var bs = scaledBrushSize();

    c.save();
    var op = (cfg.opacity || 0.8) * brushOpacity;
    if (!(['brush','marker','fine_tip','flat_brush'].includes(currentTool))) {
      op = cfg.opacity || 0.8;
    }

    if (cfg.compositeOp) {
      c.globalCompositeOperation = cfg.compositeOp;
      c.globalAlpha = 1.0;
    } else {
      c.globalAlpha = op;
    }

    c.strokeStyle = currentColor;
    c.lineWidth = bs;
    c.lineCap = cfg.lineCap || 'round';
    c.lineJoin = cfg.lineJoin || 'round';

    if (cfg.dash) {
      var dscale = W / cssW;
      c.setLineDash(cfg.dash.map(function(v) { return v * dscale; }));
    }

    if (cfg.glow) {
      var glowW = cfg.glowWidth * (W / cssW);
      c.save();
      c.globalAlpha = cfg.glowOpacity;
      c.lineWidth = glowW;
      c.beginPath();
      drawSmoothPath(c, points);
      c.stroke();
      c.restore();
      c.globalAlpha = op;
      c.lineWidth = bs;
    }

    if (cfg.passes) {
      var pwInc = (cfg.passWidthInc || 3) * (W / cssW);
      for (var p = 0; p < cfg.passes; p++) {
        c.lineWidth = bs + p * pwInc;
        c.globalAlpha = cfg.opacity || 0.15;
        c.beginPath();
        drawSmoothPath(c, points);
        c.stroke();
      }
      c.restore();
      return;
    }

    if (currentTool === 'flat_brush' && bs >= 6) {
      var bristleCount = Math.max(5, Math.round(bs / 2));
      var bristleW = Math.max(1.5, bs / bristleCount * 1.4);
      for (var b = 0; b < bristleCount; b++) {
        var t = (b / (bristleCount - 1)) - 0.5;
        var offX = t * bs * 0.85;
        var offY = t * bs * 0.15;
        var bOp = op * (0.5 + Math.abs(Math.sin(b * 2.7)) * 0.5);
        c.globalAlpha = bOp;
        c.lineWidth = bristleW;
        c.beginPath();
        drawSmoothPathOffset(c, points, offX, offY);
        c.stroke();
      }
      c.restore();
      return;
    }

    if (currentTool === 'brush' && bs >= 4) {
      c.beginPath();
      drawSmoothPath(c, points);
      c.stroke();
      var bristleW2 = Math.max(1, bs * 0.12);
      var offsets = [-0.52, -0.42, -0.32, 0.32, 0.42, 0.52];
      c.lineWidth = bristleW2;
      c.globalAlpha = op * 0.6;
      for (var bi = 0; bi < offsets.length; bi++) {
        var ox = offsets[bi] * bs;
        var oy = offsets[bi] * bs * 0.25;
        c.beginPath();
        drawSmoothPathOffset(c, points, ox, oy);
        c.stroke();
      }
      c.restore();
      return;
    }

    c.beginPath();
    drawSmoothPath(c, points);
    c.stroke();
    c.restore();
  }

  function drawSmoothPath(c, pts) {
    if (pts.length < 1) return;
    c.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) { c.lineTo(pts[1].x, pts[1].y); return; }
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i].x + pts[i+1].x) / 2;
      var my = (pts[i].y + pts[i+1].y) / 2;
      c.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    c.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  }

  function drawSmoothPathOffset(c, pts, ox, oy) {
    if (pts.length < 1) return;
    c.moveTo(pts[0].x + ox, pts[0].y + oy);
    if (pts.length === 2) { c.lineTo(pts[1].x + ox, pts[1].y + oy); return; }
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i].x + pts[i+1].x) / 2 + ox;
      var my = (pts[i].y + pts[i+1].y) / 2 + oy;
      c.quadraticCurveTo(pts[i].x + ox, pts[i].y + oy, mx, my);
    }
    c.lineTo(pts[pts.length - 1].x + ox, pts[pts.length - 1].y + oy);
  }

  function drawScatterAt(imgX, imgY) {
    var cfg = TOOL_CONFIG[currentTool];
    var radius = scaledBrushSize();
    var count = Math.max(4, Math.floor(radius * 0.8));
    var c = colorCtx;
    c.save();
    c.fillStyle = currentColor;
    c.globalAlpha = cfg.opacity || 0.6;
    var scl = W / cssW;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var dist;
      if (cfg.scatter === 'gaussian') {
        var u = Math.random() || 0.001;
        dist = Math.abs(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random())) * radius * 0.4;
        dist = Math.min(dist, radius);
      } else {
        dist = Math.random() * radius;
      }
      var dotR = currentTool === 'glitter' ? (0.5 + Math.random() * 2.5) : (0.3 + Math.random() * 1.0);
      dotR *= scl;
      var cx = imgX + Math.cos(angle) * dist;
      var cy = imgY + Math.sin(angle) * dist;
      if (cx >= 0 && cx < W && cy >= 0 && cy < H) {
        c.beginPath();
        c.arc(cx, cy, dotR, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.restore();
  }

  function drawFuzzy() {
    var cfg = TOOL_CONFIG.fuzzy;
    var strandCount = cfg.strandCount || 6;
    var bs = scaledBrushSize();
    var scl = W / cssW;
    var c = colorCtx;
    c.save();
    c.strokeStyle = currentColor;
    c.lineWidth = Math.max(1, bs * 0.15);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.globalAlpha = cfg.opacity || 0.6;
    for (var s = 0; s < strandCount; s++) {
      var offsetX = (Math.random() - 0.5) * 12 * scl;
      var offsetY = (Math.random() - 0.5) * 12 * scl;
      c.beginPath();
      var strandPts = points.map(function(p) {
        return { x: p.x + offsetX + (Math.random() - 0.5) * 4 * scl, y: p.y + offsetY + (Math.random() - 0.5) * 4 * scl };
      });
      drawSmoothPath(c, strandPts);
      c.stroke();
    }
    c.restore();
  }

  // =================== TOUCH HANDLING ===================
  function getPointerPos(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function distBetween(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  canvas.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    pointers[e.pointerId] = getPointerPos(e);
    var pids = Object.keys(pointers);

    if (pids.length === 2) {
      if (drawing) {
        drawing = false;
        send({ type: 'drawEnd' });
        if (beforeStrokeData) {
          colorCtx.putImageData(beforeStrokeData, 0, 0);
          composite();
        } else if (historyIndex >= 0) {
          colorCtx.putImageData(historyStack[historyIndex], 0, 0);
          composite();
        }
        points = [];
        hasClipMask = false;
        beforeStrokeData = null;
      }
      pinching = true;
      var p1 = pointers[pids[0]], p2 = pointers[pids[1]];
      pinchStartDist = distBetween(p1, p2);
      pinchStartScale = scale;
      pinchMidX = (p1.x + p2.x) / 2;
      pinchMidY = (p1.y + p2.y) / 2;
      pinchStartPanX = panX;
      pinchStartPanY = panY;
      return;
    }

    if (pids.length > 2) return;
    if (pinching) return;

    var pos = getPointerPos(e);
    var imgCoords = cssToImageCoords(pos.x, pos.y);

    if (currentTool === 'fill') { floodFill(imgCoords.x, imgCoords.y, currentColor); return; }
    if (currentTool === 'eyedropper') { eyedrop(imgCoords.x, imgCoords.y); return; }

    beginStroke(imgCoords.x, imgCoords.y);
  });

  canvas.addEventListener('pointermove', function(e) {
    e.preventDefault();
    var pos = getPointerPos(e);
    pointers[e.pointerId] = pos;

    if (pinching) {
      var pids = Object.keys(pointers);
      if (pids.length < 2) return;
      var p1 = pointers[pids[0]], p2 = pointers[pids[1]];
      var dist = distBetween(p1, p2);
      var newScale = Math.min(5, Math.max(1, pinchStartScale * (dist / pinchStartDist)));
      var midX = (p1.x + p2.x) / 2;
      var midY = (p1.y + p2.y) / 2;
      var scaleRatio = newScale / pinchStartScale;
      panX = midX - (pinchMidX - pinchStartPanX) * scaleRatio;
      panY = midY - (pinchMidY - pinchStartPanY) * scaleRatio;
      scale = newScale;
      composite();
      return;
    }

    if (drawing) {
      var imgCoords = cssToImageCoords(pos.x, pos.y);
      moveStroke(imgCoords.x, imgCoords.y);
    }
  });

  function pointerUp(e) {
    delete pointers[e.pointerId];
    var pids = Object.keys(pointers);
    if (pinching && pids.length < 2) {
      pinching = false;
      if (scale <= 1.05) { scale = 1; panX = 0; panY = 0; }
      composite();
      return;
    }
    if (drawing && pids.length === 0) {
      endStroke();
    }
  }

  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  canvas.addEventListener('pointerleave', pointerUp);

  // =================== IMAGE LOADING ===================
  function loadImage(base64) {
    var img = new Image();
    img.onload = function() {
      var MAX_DIM = 1500;
      var origW = img.width, origH = img.height;
      var ratio = 1;
      if (origW > MAX_DIM || origH > MAX_DIM) {
        ratio = Math.min(MAX_DIM / origW, MAX_DIM / origH);
      }
      W = Math.round(origW * ratio);
      H = Math.round(origH * ratio);

      var rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = cssW;
      canvas.height = cssH;
      computeFit();
      bgCanvas.width = W; bgCanvas.height = H;
      colorCanvas.width = W; colorCanvas.height = H;
      linesCanvas.width = W; linesCanvas.height = H;
      clipCanvas.width = W; clipCanvas.height = H;

      bgCtx.drawImage(img, 0, 0, W, H);
      extractLines();
      colorCtx.clearRect(0, 0, W, H);
      composite();
      pushHistory();
      imageLoaded = true;
      send({ type: 'canvasReady' });
    };
    img.src = base64;
  }

  // =================== CAPTURE ===================
  function captureCanvas() {
    var expCanvas = document.createElement('canvas');
    expCanvas.width = W; expCanvas.height = H;
    var expCtx = expCanvas.getContext('2d');
    expCtx.fillStyle = '#fff';
    expCtx.fillRect(0, 0, W, H);
    expCtx.drawImage(colorCanvas, 0, 0);
    expCtx.drawImage(linesCanvas, 0, 0);
    var dataUrl = expCanvas.toDataURL('image/png');
    send({ type: 'canvasSnapshot', dataUrl: dataUrl });
  }

  // =================== MESSAGE HANDLER ===================
  document.addEventListener('message', handleMessage);
  window.addEventListener('message', handleMessage);

  function handleMessage(e) {
    var msg;
    try { msg = JSON.parse(e.data); } catch(ex) { return; }
    switch (msg.type) {
      case 'loadImage': loadImage(msg.base64); break;
      case 'setTool': currentTool = msg.tool; break;
      case 'setColor': currentColor = msg.color; break;
      case 'setBrushSize': brushSize = msg.size; break;
      case 'setBrushOpacity': brushOpacity = msg.opacity; break;
      case 'undo': undo(); break;
      case 'redo': redo(); break;
      case 'captureCanvas': captureCanvas(); break;
    }
  }

  document.addEventListener('touchstart', function(e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

})();
</script>
</body>
</html>`;
}

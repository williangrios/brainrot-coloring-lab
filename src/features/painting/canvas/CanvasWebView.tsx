import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { generateCanvasHtml } from './canvasHtml'
import { loadImageAsBase64 } from './imageLoader'
import { CanvasToRNMessage } from './messageTypes'
import { ToolType } from '../data/tools'

export interface CanvasWebViewHandle {
  undo: () => void
  redo: () => void
  capture: () => void
}

interface CanvasWebViewProps {
  imageSource: number | string
  width: number
  height: number
  tool: ToolType
  color: string
  brushSize: number
  brushOpacity: number
  onEyedropperColor?: (color: string) => void
  onHistoryChanged?: (canUndo: boolean, canRedo: boolean) => void
  onDrawStart?: () => void
  onDrawEnd?: () => void
  onCanvasReady?: () => void
  onSnapshot?: (dataUrl: string) => void
}

const CanvasWebView = forwardRef<CanvasWebViewHandle, CanvasWebViewProps>(({
  imageSource, width, height, tool, color, brushSize, brushOpacity,
  onEyedropperColor, onHistoryChanged, onDrawStart, onDrawEnd, onCanvasReady, onSnapshot,
}, ref) => {
  const webViewRef = useRef<WebView>(null)
  const [loading, setLoading] = useState(true)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const readyRef = useRef(false)

  // Load image as base64
  useEffect(() => {
    loadImageAsBase64(imageSource).then(setImageBase64)
  }, [imageSource])

  const postMsg = (msg: any) => {
    if (webViewRef.current && readyRef.current) {
      webViewRef.current.postMessage(JSON.stringify(msg))
    }
  }

  useImperativeHandle(ref, () => ({
    undo: () => postMsg({ type: 'undo' }),
    redo: () => postMsg({ type: 'redo' }),
    capture: () => postMsg({ type: 'captureCanvas' }),
  }))

  // Send state updates to WebView
  useEffect(() => { postMsg({ type: 'setTool', tool }) }, [tool])
  useEffect(() => { postMsg({ type: 'setColor', color }) }, [color])
  useEffect(() => { postMsg({ type: 'setBrushSize', size: brushSize }) }, [brushSize])
  useEffect(() => { postMsg({ type: 'setBrushOpacity', opacity: brushOpacity }) }, [brushOpacity])

  const handleMessage = (event: any) => {
    let msg: CanvasToRNMessage
    try { msg = JSON.parse(event.nativeEvent.data) } catch { return }

    switch (msg.type) {
      case 'canvasReady':
        readyRef.current = true
        setLoading(false)
        // Send current state
        postMsg({ type: 'setTool', tool })
        postMsg({ type: 'setColor', color })
        postMsg({ type: 'setBrushSize', size: brushSize })
        postMsg({ type: 'setBrushOpacity', opacity: brushOpacity })
        onCanvasReady?.()
        break
      case 'eyedropperColor':
        onEyedropperColor?.(msg.color)
        break
      case 'historyChanged':
        onHistoryChanged?.(msg.canUndo, msg.canRedo)
        break
      case 'canvasSnapshot':
        onSnapshot?.(msg.dataUrl)
        break
      case 'drawStart':
        onDrawStart?.()
        break
      case 'drawEnd':
        onDrawEnd?.()
        break
    }
  }

  const html = generateCanvasHtml()

  // Send image after WebView loads
  const onWebViewLoad = () => {
    if (imageBase64 && webViewRef.current) {
      // Use injectJavaScript to send large base64 data directly
      const escaped = imageBase64.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      webViewRef.current.injectJavaScript(`
        (function() {
          var msg = JSON.stringify({ type: 'loadImage', base64: '${escaped}' });
          window.postMessage(msg, '*');
        })();
        true;
      `)
    }
  }

  if (!imageBase64) {
    return (
      <View style={[styles.container, { width, height }]}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        onLoad={onWebViewLoad}
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={false}
        startInLoadingState={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        allowFileAccess={true}
        scalesPageToFit={false}
        textInteractionEnabled={false}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00ff88" />
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderRadius: 4,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CanvasWebView

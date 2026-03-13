const fs = require('fs');
const path = 'src/i18n/translations.ts';
let content = fs.readFileSync(path, 'utf8');

const toolPalette = {
  fr: {
    tool_fill: 'Remplissage', tool_brush: 'Pinceau', tool_spray: 'Spray', tool_eraser: 'Gomme',
    tool_crayon: 'Crayon', tool_thick_pencil: 'Crayon \u00c9pais', tool_laser: 'Stylo Laser',
    tool_neon: 'Stylo N\u00e9on', tool_watercolor: 'Aquarelle', tool_glitter: 'Paillettes',
    tool_eyedropper: 'Pipette', tool_flat_brush: 'Pinceau Plat', tool_fuzzy: 'Pinceau Flou',
    tool_marker: 'Marqueur', tool_fine_tip: 'Pointe Fine', tool_airbrush: 'A\u00e9rographe',
    palette_basic: 'Basique', palette_skin: 'Peau', palette_lips: 'L\u00e8vres', palette_eyes: 'Yeux',
    palette_hair: 'Cheveux', palette_makeup: 'Maquillage', palette_halloween: 'Halloween',
    palette_independence: 'F\u00eate Nationale', palette_cottage: 'Cottage', palette_miami: 'Miami Beach',
    palette_mystical: 'Mystique', palette_underwater: 'Sous-marin', palette_forest: 'For\u00eat',
    palette_flowers: 'Fleurs', palette_rainbow: 'Arc-en-ciel', palette_sunset: 'Coucher de Soleil',
    palette_street_party: 'F\u00eate de Rue', palette_memories: 'Souvenirs', palette_vintage_pop: 'Vintage Pop',
    palette_fallen_leaves: 'Feuilles Mortes', palette_rubber_sky: 'Ciel de Caoutchouc',
    palette_recent: 'R\u00e9cents',
  },
  de: {
    tool_fill: 'F\u00fcllung', tool_brush: 'Pinsel', tool_spray: 'Spray', tool_eraser: 'Radierer',
    tool_crayon: 'Wachsmalstift', tool_thick_pencil: 'Dicker Stift', tool_laser: 'Laserstift',
    tool_neon: 'Neonstift', tool_watercolor: 'Aquarell', tool_glitter: 'Glitzer',
    tool_eyedropper: 'Pipette', tool_flat_brush: 'Flachpinsel', tool_fuzzy: 'Fusselpinsel',
    tool_marker: 'Marker', tool_fine_tip: 'Feine Spitze', tool_airbrush: 'Airbrush',
    palette_basic: 'Basis', palette_skin: 'Haut', palette_lips: 'Lippen', palette_eyes: 'Augen',
    palette_hair: 'Haare', palette_makeup: 'Make-up', palette_halloween: 'Halloween',
    palette_independence: 'Nationalfeiertag', palette_cottage: 'Cottage', palette_miami: 'Miami Beach',
    palette_mystical: 'Mystisch', palette_underwater: 'Unterwasser', palette_forest: 'Wald',
    palette_flowers: 'Blumen', palette_rainbow: 'Regenbogen', palette_sunset: 'Sonnenuntergang',
    palette_street_party: 'Stra\u00dfenfest', palette_memories: 'Erinnerungen', palette_vintage_pop: 'Vintage Pop',
    palette_fallen_leaves: 'Herbstlaub', palette_rubber_sky: 'Gummihimmel',
    palette_recent: 'Zuletzt',
  },
  it: {
    tool_fill: 'Riempimento', tool_brush: 'Pennello', tool_spray: 'Spray', tool_eraser: 'Gomma',
    tool_crayon: 'Pastello', tool_thick_pencil: 'Matita Grossa', tool_laser: 'Penna Laser',
    tool_neon: 'Penna Neon', tool_watercolor: 'Acquerello', tool_glitter: 'Glitter',
    tool_eyedropper: 'Contagocce', tool_flat_brush: 'Pennello Piatto', tool_fuzzy: 'Pennello Peloso',
    tool_marker: 'Pennarello', tool_fine_tip: 'Punta Fine', tool_airbrush: 'Aerografo',
    palette_basic: 'Base', palette_skin: 'Pelle', palette_lips: 'Labbra', palette_eyes: 'Occhi',
    palette_hair: 'Capelli', palette_makeup: 'Trucco', palette_halloween: 'Halloween',
    palette_independence: 'Festa Nazionale', palette_cottage: 'Cottage', palette_miami: 'Miami Beach',
    palette_mystical: 'Mistico', palette_underwater: 'Sottomarino', palette_forest: 'Foresta',
    palette_flowers: 'Fiori', palette_rainbow: 'Arcobaleno', palette_sunset: 'Tramonto',
    palette_street_party: 'Festa di Strada', palette_memories: 'Ricordi', palette_vintage_pop: 'Vintage Pop',
    palette_fallen_leaves: 'Foglie Cadute', palette_rubber_sky: 'Cielo di Gomma',
    palette_recent: 'Recenti',
  },
  ja: {
    tool_fill: '\u5857\u308a\u3064\u3076\u3057', tool_brush: '\u30d6\u30e9\u30b7', tool_spray: '\u30b9\u30d7\u30ec\u30fc', tool_eraser: '\u6d88\u3057\u30b4\u30e0',
    tool_crayon: '\u30af\u30ec\u30e8\u30f3', tool_thick_pencil: '\u592a\u3044\u925b\u7b46', tool_laser: '\u30ec\u30fc\u30b6\u30fc\u30da\u30f3',
    tool_neon: '\u30cd\u30aa\u30f3\u30da\u30f3', tool_watercolor: '\u6c34\u5f69', tool_glitter: '\u30b0\u30ea\u30c3\u30bf\u30fc',
    tool_eyedropper: '\u30b9\u30dd\u30a4\u30c8', tool_flat_brush: '\u5e73\u7b46', tool_fuzzy: '\u30d5\u30a1\u30b8\u30fc\u30d6\u30e9\u30b7',
    tool_marker: '\u30de\u30fc\u30ab\u30fc', tool_fine_tip: '\u7d30\u30da\u30f3', tool_airbrush: '\u30a8\u30a2\u30d6\u30e9\u30b7',
    palette_basic: '\u30d9\u30fc\u30b7\u30c3\u30af', palette_skin: '\u808c\u8272', palette_lips: '\u30ea\u30c3\u30d7', palette_eyes: '\u30a2\u30a4',
    palette_hair: '\u30d8\u30a2\u30fc', palette_makeup: '\u30e1\u30a4\u30af', palette_halloween: '\u30cf\u30ed\u30a6\u30a3\u30f3',
    palette_independence: '\u72ec\u7acb\u8a18\u5ff5\u65e5', palette_cottage: '\u30b3\u30c6\u30fc\u30b8', palette_miami: '\u30de\u30a4\u30a2\u30df\u30d3\u30fc\u30c1',
    palette_mystical: '\u30df\u30b9\u30c6\u30a3\u30ab\u30eb', palette_underwater: '\u6c34\u4e2d', palette_forest: '\u68ee',
    palette_flowers: '\u82b1', palette_rainbow: '\u8679', palette_sunset: '\u5915\u713c\u3051',
    palette_street_party: '\u30b9\u30c8\u30ea\u30fc\u30c8\u30d1\u30fc\u30c6\u30a3\u30fc', palette_memories: '\u601d\u3044\u51fa', palette_vintage_pop: '\u30f4\u30a3\u30f3\u30c6\u30fc\u30b8\u30dd\u30c3\u30d7',
    palette_fallen_leaves: '\u843d\u3061\u8449', palette_rubber_sky: '\u30b4\u30e0\u306e\u7a7a',
    palette_recent: '\u6700\u8fd1',
  },
  ko: {
    tool_fill: '\ucc44\uc6b0\uae30', tool_brush: '\ube0c\ub7ec\uc2dc', tool_spray: '\uc2a4\ud504\ub808\uc774', tool_eraser: '\uc9c0\uc6b0\uac1c',
    tool_crayon: '\ud06c\ub808\uc6a9', tool_thick_pencil: '\ub450\uaebc\uc6b4 \uc5f0\ud544', tool_laser: '\ub808\uc774\uc800 \ud39c',
    tool_neon: '\ub124\uc628 \ud39c', tool_watercolor: '\uc218\ucc44\ud654', tool_glitter: '\uae00\ub9ac\ud130',
    tool_eyedropper: '\uc2a4\ud3ec\uc774\ud2b8', tool_flat_brush: '\ub0a9\uc791 \ubd93', tool_fuzzy: '\ud37c\uc9c0 \ube0c\ub7ec\uc2dc',
    tool_marker: '\ub9c8\ucee4', tool_fine_tip: '\uac00\ub294 \ud39c', tool_airbrush: '\uc5d0\uc5b4\ube0c\ub7ec\uc2dc',
    palette_basic: '\uae30\ubcf8', palette_skin: '\ud53c\ubd80', palette_lips: '\uc785\uc220', palette_eyes: '\ub208',
    palette_hair: '\uba38\ub9ac\uce74\ub77d', palette_makeup: '\uba54\uc774\ud06c\uc5c5', palette_halloween: '\ud560\ub85c\uc708',
    palette_independence: '\ub3c5\ub9bd\uae30\ub150\uc77c', palette_cottage: '\ucf54\ud2f0\uc9c0', palette_miami: '\ub9c8\uc774\uc560\ubbf8 \ube44\uce58',
    palette_mystical: '\uc2e0\ube44\ub85c\uc6b4', palette_underwater: '\uc218\uc911', palette_forest: '\uc232',
    palette_flowers: '\uaf43', palette_rainbow: '\ubb34\uc9c0\uac1c', palette_sunset: '\uc77c\ubab0',
    palette_street_party: '\uac70\ub9ac \ud30c\ud2f0', palette_memories: '\ucd94\uc5b5', palette_vintage_pop: '\ube48\ud2f0\uc9c0 \ud31d',
    palette_fallen_leaves: '\ub099\uc5fd', palette_rubber_sky: '\uace0\ubb34 \ud558\ub298',
    palette_recent: '\ucd5c\uadfc',
  },
  zh: {
    tool_fill: '\u586b\u5145', tool_brush: '\u753b\u7b14', tool_spray: '\u55b7\u96fe', tool_eraser: '\u6a61\u76ae\u64e6',
    tool_crayon: '\u8721\u7b14', tool_thick_pencil: '\u7c97\u94c5\u7b14', tool_laser: '\u6fc0\u5149\u7b14',
    tool_neon: '\u9713\u8679\u7b14', tool_watercolor: '\u6c34\u5f69', tool_glitter: '\u4eae\u7247',
    tool_eyedropper: '\u5438\u7ba1', tool_flat_brush: '\u5e73\u5237', tool_fuzzy: '\u6bdb\u7ed2\u5237',
    tool_marker: '\u9a6c\u514b\u7b14', tool_fine_tip: '\u7ec6\u7b14', tool_airbrush: '\u55b7\u67aa',
    palette_basic: '\u57fa\u7840', palette_skin: '\u80a4\u8272', palette_lips: '\u5507\u8272', palette_eyes: '\u773c\u8272',
    palette_hair: '\u53d1\u8272', palette_makeup: '\u5f69\u5986', palette_halloween: '\u4e07\u5723\u8282',
    palette_independence: '\u56fd\u5e86', palette_cottage: '\u7530\u56ed', palette_miami: '\u8fc8\u963f\u5bc6\u6d77\u6ee9',
    palette_mystical: '\u795e\u79d8', palette_underwater: '\u6c34\u4e0b', palette_forest: '\u68ee\u6797',
    palette_flowers: '\u82b1\u5349', palette_rainbow: '\u5f69\u8679', palette_sunset: '\u65e5\u843d',
    palette_street_party: '\u8857\u5934\u6d3e\u5bf9', palette_memories: '\u56de\u5fc6', palette_vintage_pop: '\u590d\u53e4\u6d41\u884c',
    palette_fallen_leaves: '\u843d\u53f6', palette_rubber_sky: '\u6a61\u80f6\u5929\u7a7a',
    palette_recent: '\u6700\u8fd1',
  },
  ar: {
    tool_fill: '\u062a\u0639\u0628\u0626\u0629', tool_brush: '\u0641\u0631\u0634\u0627\u0629', tool_spray: '\u0631\u0630\u0627\u0630', tool_eraser: '\u0645\u0645\u062d\u0627\u0629',
    tool_crayon: '\u0642\u0644\u0645 \u0634\u0645\u0639\u064a', tool_thick_pencil: '\u0642\u0644\u0645 \u0633\u0645\u064a\u0643', tool_laser: '\u0642\u0644\u0645 \u0644\u064a\u0632\u0631',
    tool_neon: '\u0642\u0644\u0645 \u0646\u064a\u0648\u0646', tool_watercolor: '\u0623\u0644\u0648\u0627\u0646 \u0645\u0627\u0626\u064a\u0629', tool_glitter: '\u0644\u0645\u0639\u0627\u0646',
    tool_eyedropper: '\u0642\u0637\u0627\u0631\u0629', tool_flat_brush: '\u0641\u0631\u0634\u0627\u0629 \u0645\u0633\u0637\u062d\u0629', tool_fuzzy: '\u0641\u0631\u0634\u0627\u0629 \u0636\u0628\u0627\u0628\u064a\u0629',
    tool_marker: '\u0645\u0627\u0631\u0643\u0631', tool_fine_tip: '\u0631\u0623\u0633 \u0631\u0641\u064a\u0639', tool_airbrush: '\u0628\u062e\u0627\u062e',
    palette_basic: '\u0623\u0633\u0627\u0633\u064a', palette_skin: '\u0628\u0634\u0631\u0629', palette_lips: '\u0634\u0641\u0627\u0647', palette_eyes: '\u0639\u064a\u0648\u0646',
    palette_hair: '\u0634\u0639\u0631', palette_makeup: '\u0645\u0643\u064a\u0627\u062c', palette_halloween: '\u0647\u0627\u0644\u0648\u064a\u0646',
    palette_independence: '\u0627\u0644\u0639\u064a\u062f \u0627\u0644\u0648\u0637\u0646\u064a', palette_cottage: '\u0643\u0648\u062e', palette_miami: '\u0645\u064a\u0627\u0645\u064a \u0628\u064a\u062a\u0634',
    palette_mystical: '\u063a\u0627\u0645\u0636', palette_underwater: '\u062a\u062d\u062a \u0627\u0644\u0645\u0627\u0621', palette_forest: '\u063a\u0627\u0628\u0629',
    palette_flowers: '\u0632\u0647\u0648\u0631', palette_rainbow: '\u0642\u0648\u0633 \u0642\u0632\u062d', palette_sunset: '\u063a\u0631\u0648\u0628',
    palette_street_party: '\u062d\u0641\u0644\u0629 \u0634\u0627\u0631\u0639', palette_memories: '\u0630\u0643\u0631\u064a\u0627\u062a', palette_vintage_pop: '\u0641\u064a\u0646\u062a\u0627\u062c \u0628\u0648\u0628',
    palette_fallen_leaves: '\u0623\u0648\u0631\u0627\u0642 \u0645\u062a\u0633\u0627\u0642\u0637\u0629', palette_rubber_sky: '\u0633\u0645\u0627\u0621 \u0645\u0637\u0627\u0637\u064a\u0629',
    palette_recent: '\u0627\u0644\u0623\u062e\u064a\u0631\u0629',
  },
  hi: {
    tool_fill: '\u092d\u0930\u0947\u0902', tool_brush: '\u092c\u094d\u0930\u0936', tool_spray: '\u0938\u094d\u092a\u094d\u0930\u0947', tool_eraser: '\u0930\u092c\u0921\u093c',
    tool_crayon: '\u0915\u094d\u0930\u0947\u092f\u0949\u0928', tool_thick_pencil: '\u092e\u094b\u091f\u0940 \u092a\u0947\u0902\u0938\u093f\u0932', tool_laser: '\u0932\u0947\u091c\u0930 \u092a\u0947\u0928',
    tool_neon: '\u0928\u093f\u092f\u0949\u0928 \u092a\u0947\u0928', tool_watercolor: '\u091c\u0932\u0930\u0902\u0917', tool_glitter: '\u0917\u094d\u0932\u093f\u091f\u0930',
    tool_eyedropper: '\u0921\u094d\u0930\u0949\u092a\u0930', tool_flat_brush: '\u091a\u092a\u091f\u093e \u092c\u094d\u0930\u0936', tool_fuzzy: '\u092b\u093c\u091c\u093c\u0940 \u092c\u094d\u0930\u0936',
    tool_marker: '\u092e\u093e\u0930\u094d\u0915\u0930', tool_fine_tip: '\u092c\u093e\u0930\u0940\u0915 \u0928\u094b\u0915', tool_airbrush: '\u090f\u092f\u0930\u092c\u094d\u0930\u0936',
    palette_basic: '\u092c\u0941\u0928\u093f\u092f\u093e\u0926\u0940', palette_skin: '\u0924\u094d\u0935\u091a\u093e', palette_lips: '\u0939\u094b\u0902\u0920', palette_eyes: '\u0906\u0901\u0916\u0947\u0902',
    palette_hair: '\u092c\u093e\u0932', palette_makeup: '\u092e\u0947\u0915\u0905\u092a', palette_halloween: '\u0939\u0948\u0932\u094b\u0935\u0940\u0928',
    palette_independence: '\u0938\u094d\u0935\u0924\u0902\u0924\u094d\u0930\u0924\u093e \u0926\u093f\u0935\u0938', palette_cottage: '\u0915\u0949\u091f\u0947\u091c', palette_miami: '\u092e\u093e\u092f\u093e\u092e\u0940 \u092c\u0940\u091a',
    palette_mystical: '\u0930\u0939\u0938\u094d\u092f\u092e\u092f', palette_underwater: '\u092a\u093e\u0928\u0940 \u0915\u0947 \u0928\u0940\u091a\u0947', palette_forest: '\u091c\u0902\u0917\u0932',
    palette_flowers: '\u092b\u0942\u0932', palette_rainbow: '\u0907\u0902\u0926\u094d\u0930\u0927\u0928\u0941\u0937', palette_sunset: '\u0938\u0942\u0930\u094d\u092f\u093e\u0938\u094d\u0924',
    palette_street_party: '\u0938\u0921\u093c\u0915 \u092a\u093e\u0930\u094d\u091f\u0940', palette_memories: '\u092f\u093e\u0926\u0947\u0902', palette_vintage_pop: '\u0935\u093f\u0902\u091f\u0947\u091c \u092a\u0949\u092a',
    palette_fallen_leaves: '\u0917\u093f\u0930\u0940 \u092a\u0924\u094d\u0924\u093f\u092f\u093e\u0901', palette_rubber_sky: '\u0930\u092c\u0930 \u0906\u0915\u093e\u0936',
    palette_recent: '\u0939\u093e\u0932 \u0915\u0947',
  },
  nl: {
    tool_fill: 'Vulling', tool_brush: 'Penseel', tool_spray: 'Spray', tool_eraser: 'Gum',
    tool_crayon: 'Waskrijtje', tool_thick_pencil: 'Dik Potlood', tool_laser: 'Laserpen',
    tool_neon: 'Neonpen', tool_watercolor: 'Aquarel', tool_glitter: 'Glitter',
    tool_eyedropper: 'Pipet', tool_flat_brush: 'Plat Penseel', tool_fuzzy: 'Pluizige Kwast',
    tool_marker: 'Stift', tool_fine_tip: 'Fijne Punt', tool_airbrush: 'Airbrush',
    palette_basic: 'Basis', palette_skin: 'Huid', palette_lips: 'Lippen', palette_eyes: 'Ogen',
    palette_hair: 'Haar', palette_makeup: 'Make-up', palette_halloween: 'Halloween',
    palette_independence: 'Koningsdag', palette_cottage: 'Cottage', palette_miami: 'Miami Beach',
    palette_mystical: 'Mystiek', palette_underwater: 'Onderwater', palette_forest: 'Bos',
    palette_flowers: 'Bloemen', palette_rainbow: 'Regenboog', palette_sunset: 'Zonsondergang',
    palette_street_party: 'Straatfeest', palette_memories: 'Herinneringen', palette_vintage_pop: 'Vintage Pop',
    palette_fallen_leaves: 'Herfstbladeren', palette_rubber_sky: 'Rubberlucht',
    palette_recent: 'Recent',
  },
};

for (const [lang, keys] of Object.entries(toolPalette)) {
  const extra = Object.entries(keys).map(([k,v]) => k + ": '" + v.replace(/'/g, "\\'") + "'").join(', ');

  // Each lang is on a single line like:  fr: { ... },
  // We need to find the closing }, of that lang and insert before it
  const searchStr = "  " + lang + ": {";
  const startIdx = content.indexOf(searchStr);
  if (startIdx === -1) {
    console.log('NOT FOUND: ' + lang);
    continue;
  }

  // Find the closing }, for this line - it's a single-line object
  const lineEnd = content.indexOf('\n', startIdx);
  const line = content.substring(startIdx, lineEnd);

  // Check if tool_fill already exists
  if (line.includes('tool_fill')) {
    console.log('ALREADY HAS TOOLS: ' + lang);
    continue;
  }

  // Insert before the closing },
  const closingIdx = line.lastIndexOf('},');
  if (closingIdx === -1) {
    console.log('NO CLOSING FOR: ' + lang);
    continue;
  }

  const newLine = line.substring(0, closingIdx) + ', ' + extra + '},';
  content = content.substring(0, startIdx) + newLine + content.substring(lineEnd);
  console.log('Updated: ' + lang);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');

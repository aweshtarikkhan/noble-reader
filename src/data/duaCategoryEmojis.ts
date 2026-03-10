// Emoji mapping for each dua category
export const DUA_CATEGORY_EMOJIS: Record<string, string> = {
  // Daily Essentials
  "waking-up": "🌅",
  "before-sleeping": "🌙",
  "entering-home": "🏠",
  "leaving-home": "🚪",
  "entering-mosque": "🕌",
  "leaving-mosque": "🕌",
  "before-entering-toilet": "🚻",
  "after-leaving-toilet": "🚻",
  "starting-ablution": "💧",
  "completing-ablution": "✨",

  // Meals
  "beginning-meal": "🍽️",
  "after-meal": "🤲",
  "drinking-milk": "🥛",
  "given-drink": "🥤",
  "dining-at-someones-house": "🏡",
  "someone-offers-meal": "🫶",

  // Prayer
  "after-takbeer": "🕋",
  "during-ruku": "🙇",
  "when-prostrating": "🤲",
  "between-two-sujood": "📿",
  "tashahhud": "☝️",
  "darood-ibrahimi": "💚",
  "dua-qunoot": "🌃",
  "after-salah-tasbeeh": "📿",
  "remembrance-after-prayer": "💫",

  // Forgiveness
  "for-forgiveness": "🙏",
  "forgiveness-mercy": "💝",
  "forgiveness-parents-muslims": "👨‍👩‍👧‍👦",
  "repentance": "😢",

  // Protection
  "protection-help": "🛡️",
  "protection-satan": "⚔️",
  "protection-oppressors": "🏰",
  "protection-wrongdoers": "🔒",
  "protection-ignorance": "📖",
  "fear-shirk": "⚠️",
  "protection-foolishness": "🧠",
  "seek-protection-culprits": "🛡️",

  // Daily Life
  "before-starting-anything": "▶️",
  "looking-mirror": "🪞",
  "wearing-new-clothes": "👔",
  "wearing-garment": "👕",
  "entering-market": "🏪",
  "going-to-mosque": "🚶",

  // Emotions
  "worry-sorrow": "😟",
  "in-distress": "😰",
  "feeling-frightened": "😨",
  "controlling-anger": "😤",
  "curbing-fear": "💪",
  "hard-times": "⛈️",
  "stricken-tragedy": "💔",
  "loss-occurs": "😞",
  "fail-lose": "🔄",

  // News
  "hearing-good-news": "🎉",
  "hearing-bad-news": "😔",
  "times-happiness": "😊",

  // Social
  "greeting-people": "👋",
  "responding-salam": "🤝",
  "sneezing": "🤧",
  "sneezer-reply": "😇",
  "seeing-someone-sneeze": "🤧",
  "someone-insults": "🤐",
  "someone-praises": "☺️",
  "offering-condolence": "🕊️",
  "thanking-someone": "🙏",
  "someone-lends-money": "💰",

  // Family
  "for-parents": "👨‍👩‍👧",
  "asking-child": "👶",
  "child-protection": "🧒",
  "blissful-family": "👨‍👩‍👧‍👦",
  "family-safe-transgressors": "🏠",
  "forgiveness-siblings": "🤗",
  "asking-forgiveness-house": "🏡",

  // Guidance
  "istikhara": "🧭",
  "seeking-guidance": "🔦",
  "seeking-help": "🤲",
  "seeking-satisfaction": "🕊️",
  "leaving-hands-allah": "🤲",
  "trust-allah": "💚",
  "patience": "⏳",

  // Praise & Gratitude
  "praising-allah": "🌟",
  "grateful-allah": "❤️",
  "thanking-allah": "🙏",

  // Knowledge & Growth
  "increase-knowledge": "📚",
  "confidence-eloquence": "🎤",
  "strengthen-imaan": "💎",
  "overcoming-weaknesses": "🏋️",
  "pious-muslim": "⭐",
  "practising-muslims": "🌙",
  "offer-salah": "🕌",
  "righteous-company": "👥",

  // Worldly Needs
  "rizq": "💰",
  "success": "🏆",
  "accommodation": "🏠",
  "settle-debt": "💳",
  "healthy-life": "❤️‍🩹",
  "justice": "⚖️",

  // Akhirah
  "jannah": "🌴",
  "world-aakhira": "🌍",
  "forgiveness-protection-hell": "🔥",

  // Travel
  "travel": "✈️",
  "returning-travel": "🏡",
  "returning-long-journey": "🛬",

  // Weather
  "after-rainfall": "🌧️",
  "for-rain": "☁️",
  "during-windstorm": "🌪️",
  "hearing-thunder": "⛈️",
  "crescent-moon": "🌙",

  // Health & Death
  "alleviate-pain": "💊",
  "visiting-sick": "🏥",
  "seeing-someone-trial": "👁️",
  "last-moments-life": "🕯️",
  "nearing-death": "🕯️",
  "for-deceased": "🤲",
  "funeral-prayer": "🕌",
  "placing-deceased-grave": "⚱️",
  "visiting-graves": "🪦",

  // Adhan & Dhikr
  "hearing-adhan": "📢",
  "morning-remembrance": "🌅",
  "evening-remembrance": "🌆",
  "everyday-duas": "📖",

  // Hajj
  "talbiyah": "🕋",
  "at-arafat": "⛰️",
  "mashar-al-haram": "🏔️",
  "takbeer-black-stone": "🕋",
  "yemeni-corner": "🕋",
  "safa-marwah": "🏃",
  "throwing-stones-jamarat": "🪨",
  "sacrificing-animal": "🐑",
  "during-hajj": "🕋",

  // Misc
  "end-gathering": "👋",
  "pledge-allah": "🤝",
  "in-need": "🙏",
  "having-relation-wife": "💑",
  "manzil": "📜",

  // Special
  "ramadan-duas": "🌙",
  "40-rabbana-duas": "📿",
};

// Group categories for visual sections
export const DUA_CATEGORY_GROUPS: { label: string; labelUr: string; labelHi: string; ids: string[] }[] = [
  {
    label: "🌅 Morning & Evening",
    labelUr: "🌅 صبح و شام",
    labelHi: "🌅 सुबह और शाम",
    ids: ["waking-up", "before-sleeping", "morning-remembrance", "evening-remembrance", "everyday-duas"]
  },
  {
    label: "🕌 Prayer",
    labelUr: "🕌 نماز",
    labelHi: "🕌 नमाज़",
    ids: ["after-takbeer", "during-ruku", "when-prostrating", "between-two-sujood", "tashahhud", "darood-ibrahimi", "dua-qunoot", "after-salah-tasbeeh", "remembrance-after-prayer", "hearing-adhan"]
  },
  {
    label: "🏠 Home & Daily",
    labelUr: "🏠 گھر اور روزمرہ",
    labelHi: "🏠 घर और रोज़मर्रा",
    ids: ["entering-home", "leaving-home", "before-starting-anything", "looking-mirror", "wearing-new-clothes", "wearing-garment", "entering-market", "going-to-mosque"]
  },
  {
    label: "🍽️ Food & Drink",
    labelUr: "🍽️ کھانا پینا",
    labelHi: "🍽️ खाना-पीना",
    ids: ["beginning-meal", "after-meal", "drinking-milk", "given-drink", "dining-at-someones-house", "someone-offers-meal"]
  },
  {
    label: "🕌 Mosque & Ablution",
    labelUr: "🕌 مسجد اور وضو",
    labelHi: "🕌 मस्जिद और वुज़ू",
    ids: ["entering-mosque", "leaving-mosque", "before-entering-toilet", "after-leaving-toilet", "starting-ablution", "completing-ablution"]
  },
  {
    label: "🙏 Forgiveness & Repentance",
    labelUr: "🙏 مغفرت اور توبہ",
    labelHi: "🙏 मग़फ़िरत और तौबा",
    ids: ["for-forgiveness", "forgiveness-mercy", "forgiveness-parents-muslims", "repentance", "forgiveness-siblings", "asking-forgiveness-house"]
  },
  {
    label: "🛡️ Protection",
    labelUr: "🛡️ حفاظت",
    labelHi: "🛡️ हिफ़ाज़त",
    ids: ["protection-help", "protection-satan", "protection-oppressors", "protection-wrongdoers", "protection-ignorance", "fear-shirk", "protection-foolishness", "seek-protection-culprits"]
  },
  {
    label: "😟 Emotions & Hardships",
    labelUr: "😟 جذبات اور مشکلات",
    labelHi: "😟 जज़्बात और मुश्किलात",
    ids: ["worry-sorrow", "in-distress", "feeling-frightened", "controlling-anger", "curbing-fear", "hard-times", "stricken-tragedy", "loss-occurs", "fail-lose", "patience"]
  },
  {
    label: "😊 News & Happiness",
    labelUr: "😊 خبریں اور خوشی",
    labelHi: "😊 ख़बरें और ख़ुशी",
    ids: ["hearing-good-news", "hearing-bad-news", "times-happiness"]
  },
  {
    label: "👋 Social & Greetings",
    labelUr: "👋 ملاقات اور سلام",
    labelHi: "👋 मुलाक़ात और सलाम",
    ids: ["greeting-people", "responding-salam", "sneezing", "sneezer-reply", "seeing-someone-sneeze", "someone-insults", "someone-praises", "offering-condolence", "thanking-someone", "someone-lends-money"]
  },
  {
    label: "👨‍👩‍👧 Family & Children",
    labelUr: "👨‍👩‍👧 خاندان اور اولاد",
    labelHi: "👨‍👩‍👧 परिवार और औलाद",
    ids: ["for-parents", "asking-child", "child-protection", "blissful-family", "family-safe-transgressors"]
  },
  {
    label: "🧭 Guidance & Trust",
    labelUr: "🧭 ہدایت اور توکل",
    labelHi: "🧭 हिदायत और तवक्कुल",
    ids: ["istikhara", "seeking-guidance", "seeking-help", "seeking-satisfaction", "leaving-hands-allah", "trust-allah"]
  },
  {
    label: "🌟 Praise & Gratitude",
    labelUr: "🌟 حمد اور شکر",
    labelHi: "🌟 हम्द और शुक्र",
    ids: ["praising-allah", "grateful-allah", "thanking-allah"]
  },
  {
    label: "📚 Knowledge & Growth",
    labelUr: "📚 علم اور ترقی",
    labelHi: "📚 इल्म और तरक़्क़ी",
    ids: ["increase-knowledge", "confidence-eloquence", "strengthen-imaan", "overcoming-weaknesses", "pious-muslim", "practising-muslims", "offer-salah", "righteous-company"]
  },
  {
    label: "💰 Worldly Needs",
    labelUr: "💰 دنیاوی ضروریات",
    labelHi: "💰 दुनयावी ज़रूरियात",
    ids: ["rizq", "success", "accommodation", "settle-debt", "healthy-life", "justice"]
  },
  {
    label: "🌴 Akhirah",
    labelUr: "🌴 آخرت",
    labelHi: "🌴 आख़िरत",
    ids: ["jannah", "world-aakhira", "forgiveness-protection-hell"]
  },
  {
    label: "✈️ Travel",
    labelUr: "✈️ سفر",
    labelHi: "✈️ सफ़र",
    ids: ["travel", "returning-travel", "returning-long-journey"]
  },
  {
    label: "🌧️ Weather & Nature",
    labelUr: "🌧️ موسم اور فطرت",
    labelHi: "🌧️ मौसम और फ़ितरत",
    ids: ["after-rainfall", "for-rain", "during-windstorm", "hearing-thunder", "crescent-moon"]
  },
  {
    label: "🏥 Health & Death",
    labelUr: "🏥 صحت اور موت",
    labelHi: "🏥 सेहत और मौत",
    ids: ["alleviate-pain", "visiting-sick", "seeing-someone-trial", "last-moments-life", "nearing-death", "for-deceased", "funeral-prayer", "placing-deceased-grave", "visiting-graves"]
  },
  {
    label: "🕋 Hajj & Umrah",
    labelUr: "🕋 حج اور عمرہ",
    labelHi: "🕋 हज और उमरा",
    ids: ["talbiyah", "at-arafat", "mashar-al-haram", "takbeer-black-stone", "yemeni-corner", "safa-marwah", "throwing-stones-jamarat", "sacrificing-animal", "during-hajj"]
  },
  {
    label: "📜 Other",
    labelUr: "📜 دیگر",
    labelHi: "📜 अन्य",
    ids: ["end-gathering", "pledge-allah", "in-need", "having-relation-wife", "manzil"]
  },
];

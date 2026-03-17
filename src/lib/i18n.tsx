import React, { createContext, useContext, useState, useEffect } from "react";

export type AppLanguage = "en" | "ur" | "hi";

type Translations = Record<string, Record<AppLanguage, string>>;

const T: Translations = {
  // Navigation
  "nav.home": { en: "Home", ur: "ہوم", hi: "होम" },
  "nav.quran": { en: "Quran", ur: "قرآن", hi: "क़ुरआन" },
  "nav.knowledge": { en: "Knowledge", ur: "علم", hi: "ज्ञान" },
  "nav.continue": { en: "Continue", ur: "جاری", hi: "जारी" },
  "nav.translation": { en: "Tarjuma", ur: "ترجمہ", hi: "तर्जुमा" },
  "nav.namaz": { en: "Namaz", ur: "نماز", hi: "नमाज़" },

  // Header
  "header.holyQuran": { en: "The Holy Quran", ur: "قرآن مجید", hi: "पवित्र क़ुरआन" },

  // Quick Tools
  "tool.readQuran": { en: "Read Quran", ur: "قرآن پڑھیں", hi: "क़ुरआन पढ़ें" },
  "tool.translation": { en: "Translation", ur: "ترجمہ", hi: "अनुवाद" },
  "tool.islamicCalendar": { en: "Islamic Calendar", ur: "اسلامی کیلنڈر", hi: "इस्लामी कैलेंडर" },
  "tool.bookmarks": { en: "Bookmarks", ur: "بک مارکس", hi: "बुकमार्क" },
  "tool.namaz": { en: "Namaz", ur: "نماز", hi: "नमाज़" },
  "tool.qibla": { en: "Qibla", ur: "قبلہ", hi: "क़िबला" },
  "tool.duas": { en: "Duas", ur: "دعائیں", hi: "दुआएं" },
  "tool.hadith": { en: "Hadith", ur: "حدیث", hi: "हदीस" },
  "tool.quranAudio": { en: "Quran Audio", ur: "قرآن آڈیو", hi: "क़ुरआन ऑडियो" },
  "tool.zakatCalculator": { en: "Zakat Calculator", ur: "زکوٰۃ کیلکولیٹر", hi: "ज़कात कैलकुलेटर" },
  "tool.settings": { en: "Settings", ur: "ترتیبات", hi: "सेटिंग्स" },

  // Home
  "home.quickTools": { en: "Quick Tools", ur: "فوری ٹولز", hi: "त्वरित उपकरण" },
  "home.dailyAyah": { en: "Daily Ayah", ur: "آج کی آیت", hi: "आज की आयत" },
  "home.dailyHadith": { en: "Daily Hadith", ur: "آج کی حدیث", hi: "आज की हदीस" },
  "home.upcomingPrayer": { en: "Upcoming Prayer", ur: "آنے والی نماز", hi: "आगामी नमाज़" },
  "home.remaining": { en: "remaining", ur: "باقی", hi: "शेष" },
  "home.share": { en: "SHARE", ur: "شیئر", hi: "शेयर" },
  "home.support": { en: "💝 Support Future Updates", ur: "💝 مستقبل کی اپ ڈیٹس کی حمایت کریں", hi: "💝 भविष्य के अपडेट का समर्थन करें" },
  "home.supportDesc": { en: "Your small contribution keeps this app free for everyone", ur: "آپ کا چھوٹا سا تعاون اس ایپ کو سب کے لیے مفت رکھتا ہے", hi: "आपका छोटा योगदान इस ऐप को सबके लिए मुफ़्त रखता है" },
  "home.azanAt": { en: "AZAN AT", ur: "اذان", hi: "अज़ान" },
  "home.silentMode": { en: "Silent Mode", ur: "خاموش موڈ", hi: "साइलेंट मोड" },
  "home.soundOn": { en: "Sound On", ur: "آواز آن", hi: "आवाज़ चालू" },

  // Settings / Profile
  "settings.title": { en: "Settings", ur: "ترتیبات", hi: "सेटिंग्स" },
  "settings.profile": { en: "Profile", ur: "پروفائل", hi: "प्रोफ़ाइल" },
  "settings.language": { en: "App Language", ur: "ایپ کی زبان", hi: "ऐप भाषा" },
  "settings.theme": { en: "Theme", ur: "تھیم", hi: "थीम" },
  "settings.dark": { en: "Dark", ur: "ڈارک", hi: "डार्क" },
  "settings.light": { en: "Light", ur: "لائٹ", hi: "लाइट" },
  "settings.auto": { en: "Auto", ur: "خودکار", hi: "ऑटो" },
  "settings.name": { en: "Your Name", ur: "آپ کا نام", hi: "आपका नाम" },
  "settings.readingProgress": { en: "Reading Progress", ur: "پڑھنے کی پیشرفت", hi: "पढ़ने की प्रगति" },
  "settings.totalBookmarks": { en: "Total Bookmarks", ur: "کل بک مارکس", hi: "कुल बुकमार्क" },
  "settings.favDuas": { en: "Pinned Duas", ur: "پن کی گئی دعائیں", hi: "पिन की गई दुआएं" },
  "settings.savedHadith": { en: "Saved Hadith Books", ur: "محفوظ حدیث کتابیں", hi: "सहेजी गई हदीस किताबें" },
  "settings.saved": { en: "Saved!", ur: "محفوظ!", hi: "सहेजा!" },
  "settings.profileUpdated": { en: "Profile name updated", ur: "پروفائل نام اپ ڈیٹ ہوا", hi: "प्रोफ़ाइल नाम अपडेट हुआ" },
  "settings.photoUpdated": { en: "Profile photo updated", ur: "پروفائل فوٹو اپ ڈیٹ ہوئی", hi: "प्रोफ़ाइल फ़ोटो अपडेट हुई" },
  "settings.fontSize": { en: "Font Size", ur: "فونٹ سائز", hi: "फ़ॉन्ट साइज़" },
  "settings.fontSmall": { en: "Small", ur: "چھوٹا", hi: "छोटा" },
  "settings.fontMedium": { en: "Medium", ur: "درمیانا", hi: "मध्यम" },
  "settings.fontLarge": { en: "Large", ur: "بڑا", hi: "बड़ा" },
  "settings.fontXLarge": { en: "X-Large", ur: "بہت بڑا", hi: "बहुत बड़ा" },
  "settings.fontSizeUpdated": { en: "Font size updated", ur: "فونٹ سائز اپ ڈیٹ ہوا", hi: "फ़ॉन्ट साइज़ अपडेट हुआ" },
  "settings.fontSizeHint": { en: "Changes text size across the entire app", ur: "پوری ایپ میں ٹیکسٹ کا سائز بدلتا ہے", hi: "पूरे ऐप में टेक्स्ट का साइज़ बदलता है" },

  // Pages
  "page.surahReading": { en: "Surah Reading", ur: "سورۃ کی تلاوت", hi: "सूरह पाठ" },
  "page.surahs": { en: "Surahs", ur: "سورتیں", hi: "सूरतें" },
  "page.readQuran": { en: "Read Quran", ur: "قرآن پڑھیں", hi: "क़ुरआन पढ़ें" },
  "page.bookmarks": { en: "Bookmarks", ur: "بک مارکس", hi: "बुकमार्क" },
  "page.qibla": { en: "Qibla Direction", ur: "قبلہ کی سمت", hi: "क़िबला दिशा" },
  "page.duas": { en: "Duas", ur: "دعائیں", hi: "दुआएं" },
  "page.quranAudio": { en: "Quran Audio", ur: "قرآن آڈیو", hi: "क़ुरआन ऑडियो" },
  "page.islamicCalendar": { en: "Islamic Calendar", ur: "اسلامی کیلنڈر", hi: "इस्लामी कैलेंडर" },
  "page.paraReading": { en: "Para Reading", ur: "پارہ پڑھنا", hi: "पारा पढ़ना" },
  "page.para": { en: "Para / Juz", ur: "پارہ / جز", hi: "पारा / जुज़" },
  "page.prayerTimes": { en: "Prayer Times", ur: "نماز کے اوقات", hi: "नमाज़ के समय" },
  "page.azaanSettings": { en: "Azaan Settings", ur: "اذان کی ترتیبات", hi: "अज़ान सेटिंग्स" },
  "page.translation": { en: "Translation", ur: "ترجمہ", hi: "अनुवाद" },
  "page.tafseer": { en: "Tafseer", ur: "تفسیر", hi: "तफ़सीर" },
  "page.donate": { en: "Support Us", ur: "ہماری مدد کریں", hi: "हमारा सहयोग करें" },
  "page.hadith": { en: "Hadith", ur: "حدیث", hi: "हदीस" },
  "page.settings": { en: "Settings", ur: "ترتیبات", hi: "सेटिंग्स" },
  "page.zakatCalculator": { en: "Zakat Calculator", ur: "زکوٰۃ کیلکولیٹر", hi: "ज़कात कैलकुलेटर" },
  "page.islamicKnowledge": { en: "Islamic Knowledge", ur: "اسلامی علم", hi: "इस्लामी ज्ञान" },
  "tool.islamicKnowledge": { en: "Islamic Knowledge", ur: "اسلامی علم", hi: "इस्लामी ज्ञान" },
  "knowledge.99names": { en: "99 Names of Allah", ur: "اللہ کے 99 نام", hi: "अल्लाह के 99 नाम" },
  "knowledge.seerat": { en: "Seerat un Nabi ﷺ", ur: "سیرت النبی ﷺ", hi: "सीरत उन नबी ﷺ" },
  "knowledge.books": { en: "Islamic Books", ur: "اسلامی کتابیں", hi: "इस्लामी किताबें" },
  "knowledge.lectures": { en: "Lectures / Audio", ur: "لیکچرز / آڈیو", hi: "लेक्चर / ऑडियो" },

  // Bookmarks page
  "bookmarks.myBookmarks": { en: "My Bookmarks", ur: "میرے بک مارکس", hi: "मेरे बुकमार्क" },
  "bookmarks.saved": { en: "saved", ur: "محفوظ", hi: "सहेजे गए" },
  "bookmarks.all": { en: "All", ur: "سب", hi: "सभी" },
  "bookmarks.quran": { en: "📖 Quran", ur: "📖 قرآن", hi: "📖 क़ुरआन" },
  "bookmarks.para": { en: "📚 Para", ur: "📚 پارہ", hi: "📚 पारा" },
  "bookmarks.surah": { en: "📜 Surah", ur: "📜 سورۃ", hi: "📜 सूरह" },
  "bookmarks.clearAll": { en: "Clear All", ur: "سب صاف کریں", hi: "सब हटाएं" },
  "bookmarks.noBookmarks": { en: "No bookmarks yet", ur: "ابھی کوئی بک مارک نہیں", hi: "अभी कोई बुकमार्क नहीं" },
  "bookmarks.longPress": { en: "Long press on any Quran page or tap the bookmark icon to save your place", ur: "اپنی جگہ محفوظ کرنے کے لیے کسی بھی قرآن صفحے پر دیر تک دبائیں", hi: "अपनी जगह सहेजने के लिए किसी भी क़ुरआन पेज पर लंबा दबाएं" },
  "bookmarks.page": { en: "Page", ur: "صفحہ", hi: "पृष्ठ" },
  "bookmarks.removed": { en: "Bookmark removed", ur: "بک مارک ہٹا دیا گیا", hi: "बुकमार्क हटाया गया" },
  "bookmarks.cleared": { en: "All bookmarks cleared", ur: "تمام بک مارکس صاف ہو گئے", hi: "सभी बुकमार्क हटा दिए गए" },

  // Duas page
  "duas.search": { en: "Search duas...", ur: "دعائیں تلاش کریں...", hi: "दुआएं खोजें..." },
  "duas.translationLang": { en: "Translation Language", ur: "ترجمے کی زبان", hi: "अनुवाद भाषा" },
  "duas.translation": { en: "Translation", ur: "ترجمہ", hi: "अनुवाद" },
  "duas.reference": { en: "Reference", ur: "حوالہ", hi: "संदर्भ" },
  "duas.categoriesFound": { en: "categories found", ur: "زمرے ملے", hi: "श्रेणियां मिलीं" },
  "duas.noDuasFound": { en: "No duas found for", ur: "کوئی دعا نہیں ملی", hi: "कोई दुआ नहीं मिली" },

  // Hadith page
  "hadith.books": { en: "Hadith Books", ur: "حدیث کی کتابیں", hi: "हदीस किताबें" },
  "hadith.share": { en: "Share", ur: "شیئر", hi: "शेयर" },
  "hadith.searchChapters": { en: "Search chapters...", ur: "ابواب تلاش کریں...", hi: "अध्याय खोजें..." },
  "hadith.searchHadiths": { en: "Search hadiths...", ur: "احادیث تلاش کریں...", hi: "हदीसें खोजें..." },
  "hadith.chapters": { en: "chapters", ur: "ابواب", hi: "अध्याय" },
  "hadith.hadiths": { en: "hadiths", ur: "احادیث", hi: "हदीसें" },
  "hadith.noHadiths": { en: "No hadiths found", ur: "کوئی حدیث نہیں ملی", hi: "कोई हदीस नहीं मिली" },
  "hadith.tapToBrowse": { en: "Tap to browse", ur: "براؤز کرنے کے لیے ٹیپ کریں", hi: "ब्राउज़ करने के लिए टैप करें" },
  "hadith.savedOffline": { en: "✅ Saved offline", ur: "✅ آف لائن محفوظ", hi: "✅ ऑफ़लाइन सहेजा" },
  "hadith.saveOffline": { en: "Save Offline", ur: "آف لائن محفوظ کریں", hi: "ऑफ़लाइन सहेजें" },
  "hadith.updateOffline": { en: "Update Offline", ur: "آف لائن اپ ڈیٹ کریں", hi: "ऑफ़लाइन अपडेट करें" },

  // Prayer Times page
  "prayer.detectingLocation": { en: "Detecting location...", ur: "مقام کا پتا لگایا جا رہا ہے...", hi: "स्थान का पता लगाया जा रहा है..." },
  "prayer.retry": { en: "Retry", ur: "دوبارہ کوشش کریں", hi: "पुनः प्रयास करें" },
  "prayer.sehri": { en: "Sehri (Fajr)", ur: "سحری (فجر)", hi: "सहरी (फ़ज्र)" },
  "prayer.iftar": { en: "Iftar (Maghrib)", ur: "افطار (مغرب)", hi: "इफ़्तार (मग़रिब)" },
  "prayer.timeUntilIftar": { en: "Time until Iftar", ur: "افطار میں باقی وقت", hi: "इफ़्तार में शेष समय" },
  "prayer.prayerTimes": { en: "Prayer Times", ur: "نماز کے اوقات", hi: "नमाज़ के समय" },
  "prayer.sound": { en: "Sound", ur: "آواز", hi: "आवाज़" },
  "prayer.notify": { en: "Notify", ur: "اطلاع", hi: "सूचना" },
  "prayer.azaanSettings": { en: "Azaan Settings", ur: "اذان کی ترتیبات", hi: "अज़ान सेटिंग्स" },
  "prayer.azaanOn": { en: "ON — Tap to configure style & volume", ur: "آن — اسٹائل اور والیوم ترتیب دینے کے لیے ٹیپ کریں", hi: "चालू — स्टाइल और वॉल्यूम सेट करने के लिए टैप करें" },
  "prayer.azaanOff": { en: "OFF — Tap to enable", ur: "آف — فعال کرنے کے لیے ٹیپ کریں", hi: "बंद — चालू करने के लिए टैप करें" },

  // Qibla page
  "qibla.title": { en: "Qibla Direction", ur: "قبلہ کی سمت", hi: "क़िबला दिशा" },
  "qibla.pointPhone": { en: "Point your phone toward the Kaaba 🕋", ur: "اپنا فون کعبہ کی طرف رکھیں 🕋", hi: "अपना फ़ोन काबा की ओर करें 🕋" },
  "qibla.enableCompass": { en: "Enable Compass", ur: "کمپاس فعال کریں", hi: "कंपास चालू करें" },
  "qibla.calibrating": { en: "Calibrating compass... Move your phone in a figure-8", ur: "کمپاس کیلیبریٹ ہو رہا ہے... فون کو 8 کی شکل میں گھمائیں", hi: "कंपास कैलिब्रेट हो रहा है... फ़ोन को 8 की आकृति में घुमाएं" },
  "qibla.facingQibla": { en: "✓ You are facing Qibla!", ur: "✓ آپ قبلہ رخ ہیں!", hi: "✓ आप क़िबला की ओर हैं!" },
  "qibla.bearing": { en: "Qibla bearing from North", ur: "شمال سے قبلہ کا رخ", hi: "उत्तर से क़िबला की दिशा" },
  "qibla.compass": { en: "Compass", ur: "کمپاس", hi: "कंपास" },
  "qibla.gettingLocation": { en: "Getting your location...", ur: "آپ کا مقام حاصل کیا جا رہا ہے...", hi: "आपका स्थान प्राप्त किया जा रहा है..." },
  "qibla.keepDeviceFlat": { en: "Keep your device flat and away from magnets. Move in a figure-8 to calibrate the compass for best accuracy.", ur: "اپنا آلہ ہموار رکھیں اور مقناطیس سے دور رکھیں۔ بہترین درستگی کے لیے 8 کی شکل میں گھمائیں۔", hi: "अपना डिवाइस सपाट और चुंबक से दूर रखें। सर्वोत्तम सटीकता के लिए 8 की आकृति में घुमाएं।" },

  // Quran Audio page
  "audio.quranAudio": { en: "🎧 Quran Audio", ur: "🎧 قرآن آڈیو", hi: "🎧 क़ुरआन ऑडियो" },
  "audio.urduTranslation": { en: "🗣️ Urdu Translation", ur: "🗣️ اردو ترجمہ", hi: "🗣️ उर्दू अनुवाद" },
  "audio.selectReciter": { en: "🎙️ Select Reciter", ur: "🎙️ قاری منتخب کریں", hi: "🎙️ क़ारी चुनें" },
  "audio.selectTranslator": { en: "📝 Select Translator", ur: "📝 مترجم منتخب کریں", hi: "📝 अनुवादक चुनें" },
  "audio.searchSurah": { en: "Search surah...", ur: "سورہ تلاش کریں...", hi: "सूरह खोजें..." },
  "audio.ayahs": { en: "ayahs", ur: "آیات", hi: "आयतें" },

  // Read Quran page
  "read.readQuran": { en: "Read Quran", ur: "قرآن پڑھیں", hi: "क़ुरआन पढ़ें" },
  "read.chooseHow": { en: "Choose how you'd like to read", ur: "کیسے پڑھنا چاہتے ہیں منتخب کریں", hi: "कैसे पढ़ना चाहते हैं चुनें" },
  "read.completeQuran": { en: "Complete Quran", ur: "مکمل قرآن", hi: "पूरा क़ुरआन" },
  "read.completeDesc": { en: "Read from cover to cover with continuous scrolling", ur: "مسلسل سکرولنگ کے ساتھ شروع سے آخر تک پڑھیں", hi: "लगातार स्क्रॉलिंग के साथ शुरू से अंत तक पढ़ें" },
  "read.byPara": { en: "Read by Para (Juz)", ur: "پارہ (جز) کے لحاظ سے پڑھیں", hi: "पारा (जुज़) के अनुसार पढ़ें" },
  "read.byParaDesc": { en: "Choose a specific para to read", ur: "پڑھنے کے لیے مخصوص پارہ منتخب کریں", hi: "पढ़ने के लिए विशिष्ट पारा चुनें" },
  "read.bySurah": { en: "Read by Surah", ur: "سورۃ کے لحاظ سے پڑھیں", hi: "सूरह के अनुसार पढ़ें" },
  "read.bySurahDesc": { en: "Select any surah from the 114 chapters", ur: "114 سورتوں میں سے کوئی بھی منتخب کریں", hi: "114 सूरतों में से कोई भी चुनें" },
  "read.bookmarkedAt": { en: "Bookmarked at page", ur: "صفحہ پر بک مارک", hi: "पृष्ठ पर बुकमार्क" },
  "read.back": { en: "Back", ur: "واپس", hi: "वापस" },
  "read.offlineReading": { en: "📥 Offline Reading", ur: "📥 آف لائن پڑھنا", hi: "📥 ऑफ़लाइन पढ़ना" },
  "read.pagesSaved": { en: "pages saved", ur: "صفحات محفوظ", hi: "पृष्ठ सहेजे गए" },
  "read.allDownloaded": { en: "✅ All downloaded", ur: "✅ سب ڈاؤن لوڈ ہو گئے", hi: "✅ सब डाउनलोड हो गए" },
  "read.downloadForInstant": { en: "Download for instant loading", ur: "فوری لوڈنگ کے لیے ڈاؤن لوڈ کریں", hi: "तुरंत लोडिंग के लिए डाउनलोड करें" },
  "read.stop": { en: "Stop", ur: "رکیں", hi: "रुकें" },
  "read.downloaded": { en: "Downloaded ✓", ur: "ڈاؤن لوڈ ✓", hi: "डाउनलोड ✓" },
  "read.downloadAll": { en: "Download All", ur: "سب ڈاؤن لوڈ کریں", hi: "सब डाउनलोड करें" },
  "read.jumpToPage": { en: "Jump to page", ur: "صفحہ پر جائیں", hi: "पृष्ठ पर जाएं" },
  "read.go": { en: "Go", ur: "جائیں", hi: "जाएं" },
  "read.loadingMore": { en: "Loading more pages...", ur: "مزید صفحات لوڈ ہو رہے ہیں...", hi: "और पृष्ठ लोड हो रहे हैं..." },
  "read.searchSurah": { en: "Search surah by name or number...", ur: "نام یا نمبر سے سورہ تلاش کریں...", hi: "नाम या नंबर से सूरह खोजें..." },
  "read.pages": { en: "Pages", ur: "صفحات", hi: "पृष्ठ" },
  "read.para": { en: "Para", ur: "پارہ", hi: "पारा" },

  // Translation page
  "trans.translations": { en: "Translations", ur: "تراجم", hi: "अनुवाद" },
  "trans.tafseer": { en: "Tafseer", ur: "تفسیر", hi: "तफ़सीर" },
  "trans.none": { en: "None", ur: "کوئی نہیں", hi: "कोई नहीं" },
  "trans.searchAyah": { en: "Search ayah or translation...", ur: "آیت یا ترجمہ تلاش کریں...", hi: "आयत या अनुवाद खोजें..." },
  "trans.ayahOf": { en: "Ayah", ur: "آیت", hi: "आयत" },
  "trans.of": { en: "of", ur: "از", hi: "में से" },

  // Surah pages
  "surah.notFound": { en: "Surah not found", ur: "سورۃ نہیں ملی", hi: "सूरह नहीं मिली" },
  "surah.ayahs": { en: "Ayahs", ur: "آیات", hi: "आयतें" },
  "surah.pages": { en: "pages", ur: "صفحات", hi: "पृष्ठ" },
  "surah.page": { en: "page", ur: "صفحہ", hi: "पृष्ठ" },
  "surah.downloadSurah": { en: "Download Surah", ur: "سورۃ ڈاؤن لوڈ کریں", hi: "सूरह डाउनलोड करें" },
  "surah.downloading": { en: "Downloading...", ur: "ڈاؤن لوڈ ہو رہا ہے...", hi: "डाउनलोड हो रहा है..." },
  "surah.downloadedCheck": { en: "Downloaded", ur: "ڈاؤن لوڈ ✓", hi: "डाउनलोड ✓" },

  // Para pages
  "para.notFound": { en: "Para not found", ur: "پارہ نہیں ملا", hi: "पारा नहीं मिला" },
  "para.downloadPara": { en: "Download Complete Para", ur: "مکمل پارہ ڈاؤن لوڈ کریں", hi: "पूरा पारा डाउनलोड करें" },

  // Donate page
  "donate.supportApp": { en: "Support This App", ur: "اس ایپ کی مدد کریں", hi: "इस ऐप का समर्थन करें" },
  "donate.enjoyDesc": { en: "If you enjoy using this app, a small contribution helps support future updates.", ur: "اگر آپ اس ایپ سے لطف اندوز ہیں تو ایک چھوٹا سا تعاون مستقبل کی اپ ڈیٹس میں مدد کرتا ہے۔", hi: "अगर आप इस ऐप का आनंद लेते हैं, तो एक छोटा योगदान भविष्य के अपडेट में मदद करता है।" },
  "donate.developedBy": { en: "Developed by", ur: "تیار کردہ", hi: "द्वारा विकसित" },
  "donate.chooseAmount": { en: "Choose Amount (₹)", ur: "رقم منتخب کریں (₹)", hi: "राशि चुनें (₹)" },
  "donate.customAmount": { en: "Custom Amount", ur: "حسب ضرورت رقم", hi: "कस्टम राशि" },
  "donate.scanQR": { en: "Scan QR Code to Pay", ur: "ادائیگی کے لیے QR کوڈ اسکین کریں", hi: "भुगतान के लिए QR कोड स्कैन करें" },
  "donate.payViaUPI": { en: "Pay via UPI App", ur: "UPI ایپ سے ادائیگی کریں", hi: "UPI ऐप से भुगतान करें" },
  "donate.selectAmount": { en: "Select an amount (min ₹10)", ur: "رقم منتخب کریں (کم از کم ₹10)", hi: "राशि चुनें (न्यूनतम ₹10)" },
  "donate.mayAllahReward": { en: "May Allah reward you", ur: "اللہ آپ کو جزائے خیر دے", hi: "अल्लाह आपको जज़ाए ख़ैर दे" },
  "donate.upiNote": { en: "Tapping above will open your UPI app (GPay, PhonePe, Paytm, etc.)", ur: "اوپر ٹیپ کرنے سے آپ کی UPI ایپ کھلے گی (GPay، PhonePe، Paytm وغیرہ)", hi: "ऊपर टैप करने से आपकी UPI ऐप खुलेगी (GPay, PhonePe, Paytm आदि)" },

  // Azaan Settings page
  "azaan.alerts": { en: "Azaan Alerts", ur: "اذان الرٹس", hi: "अज़ान अलर्ट" },
  "azaan.playAtPrayer": { en: "Play Azaan at prayer times", ur: "نماز کے اوقات میں اذان بجائیں", hi: "नमाज़ के समय अज़ान बजाएं" },
  "azaan.testSound": { en: "🔊 Test Current Azaan Sound", ur: "🔊 موجودہ اذان آواز ٹیسٹ کریں", hi: "🔊 मौजूदा अज़ान की आवाज़ टेस्ट करें" },
  "azaan.stopTest": { en: "⏸ Stop Test", ur: "⏸ ٹیسٹ بند کریں", hi: "⏸ टेस्ट रोकें" },
  "azaan.volume": { en: "Volume", ur: "والیوم", hi: "वॉल्यूम" },
  "azaan.chooseStyle": { en: "Choose Azaan Style", ur: "اذان کا اسٹائل منتخب کریں", hi: "अज़ान का स्टाइल चुनें" },
  "azaan.manualOverride": { en: "Manual Timing Override", ur: "دستی وقت کی تبدیلی", hi: "मैनुअल समय बदलें" },
  "azaan.manualHint": { en: "Set time manually or leave blank for auto (location-based)", ur: "وقت دستی طور پر ڈالیں یا خودکار (مقام کی بنیاد پر) کے لیے خالی چھوڑ دیں", hi: "समय मैन्युअली सेट करें या ऑटो (स्थान आधारित) के लिए खाली छोड़ दें" },
  "azaan.info": { en: "ℹ️ Azaan will play at prayer times. Use the volume button on your device to stop. Manage per-prayer sound & notification toggles from the Namaz page.", ur: "ℹ️ اذان نماز کے اوقات میں بجے گی۔ بند کرنے کے لیے اپنے آلے کا والیوم بٹن استعمال کریں۔ نماز صفحے سے ہر نماز کی آواز اور اطلاع ٹوگل کریں۔", hi: "ℹ️ अज़ान नमाज़ के समय बजेगी। बंद करने के लिए अपने डिवाइस का वॉल्यूम बटन दबाएं। नमाज़ पेज से प्रति-नमाज़ आवाज़ और सूचना टॉगल करें।" },

  // Tafseer pages
  "tafseer.translation": { en: "Translation", ur: "ترجمہ", hi: "अनुवाद" },
  "tafseer.maududi": { en: "Tafseer (Maududi)", ur: "تفسیر (مودودی)", hi: "तफ़सीर (मौदूदी)" },
  "tafseer.ayatMode": { en: "Ayat-by-Ayat Mode", ur: "آیت بہ آیت موڈ", hi: "आयत दर आयत मोड" },
  "tafseer.fullSurah": { en: "Full Surah", ur: "مکمل سورۃ", hi: "पूरी सूरह" },
  "tafseer.readerTitle": { en: "Translation + Tafseer Reader", ur: "ترجمہ + تفسیر ریڈر", hi: "अनुवाद + तफ़सीर रीडर" },
  "tafseer.selectSurah": { en: "Select a Surah to begin reading with Tafseer", ur: "تفسیر کے ساتھ پڑھنا شروع کرنے کے لیے سورہ منتخب کریں", hi: "तफ़सीर के साथ पढ़ना शुरू करने के लिए सूरह चुनें" },

  // Mushaf pages
  "mushaf.image": { en: "📷 Image", ur: "📷 تصویر", hi: "📷 चित्र" },
  "mushaf.text": { en: "📝 Text", ur: "📝 متن", hi: "📝 पाठ" },
  "mushaf.pageOf": { en: "Page", ur: "صفحہ", hi: "पृष्ठ" },
  "mushaf.failedLoad": { en: "Failed to load page", ur: "صفحہ لوڈ نہیں ہو سکا", hi: "पृष्ठ लोड नहीं हो सका" },
  "mushaf.noData": { en: "No data", ur: "کوئی ڈیٹا نہیں", hi: "कोई डेटा नहीं" },

  // Indian Mushaf
  "indianMushaf.title": { en: "🇮🇳 16-Line Indo-Pak Quran", ur: "🇮🇳 16 سطری انڈو پاک قرآن", hi: "🇮🇳 16 लाइन इंडो-पाक क़ुरआन" },
  "indianMushaf.withRuku": { en: "With Ruku markers", ur: "رکوع کے نشانات کے ساتھ", hi: "रुकू मार्कर के साथ" },
  "indianMushaf.failedLoad": { en: "Failed to load page image", ur: "صفحے کی تصویر لوڈ نہیں ہو سکی", hi: "पृष्ठ चित्र लोड नहीं हो सका" },
  "indianMushaf.serverUnavailable": { en: "The image server may be temporarily unavailable", ur: "تصویر سرور عارضی طور پر دستیاب نہیں ہو سکتا", hi: "चित्र सर्वर अस्थायी रूप से अनुपलब्ध हो सकता है" },

  // Islamic Calendar
  "calendar.indian": { en: "Indian", ur: "ہندوستانی", hi: "भारतीय" },
  "calendar.saudi": { en: "Saudi", ur: "سعودی", hi: "सऊदी" },
  "calendar.today": { en: "Today", ur: "آج", hi: "आज" },
  "calendar.ah": { en: "Hijri", ur: "ہجری", hi: "हिजरी" },
  "calendar.importantDates": { en: "Important Dates This Month", ur: "اس ماہ کی اہم تاریخیں", hi: "इस माह की महत्वपूर्ण तिथियां" },
  "calendar.dateAdjust": { en: "Date Adjustment", ur: "تاریخ کی تصحیح", hi: "तिथि समायोजन" },
  "calendar.dayBehind": { en: "-1 Day", ur: "-۱ دن", hi: "-1 दिन" },
  "calendar.auto": { en: "Auto", ur: "آٹو", hi: "ऑटो" },
  "calendar.dayAhead": { en: "+1 Day", ur: "+۱ دن", hi: "+1 दिन" },
  "calendar.events": { en: "Events", ur: "واقعات", hi: "कार्यक्रम" },

  // Prayer names
  "prayerName.Fajr": { en: "Fajr", ur: "فجر", hi: "फ़ज्र" },
  "prayerName.Dhuhr": { en: "Dhuhr", ur: "ظہر", hi: "ज़ुहर" },
  "prayerName.Asr": { en: "Asr", ur: "عصر", hi: "अस्र" },
  "prayerName.Maghrib": { en: "Maghrib", ur: "مغرب", hi: "मग़रिब" },
  "prayerName.Isha": { en: "Isha", ur: "عشاء", hi: "इशा" },
  "prayerName.Sunrise": { en: "Sunrise", ur: "طلوع آفتاب", hi: "सूर्योदय" },

  // Common
  "common.retry": { en: "Retry", ur: "دوبارہ کوشش کریں", hi: "पुनः प्रयास करें" },
  "common.prev": { en: "← Prev", ur: "← پچھلا", hi: "← पिछला" },
  "common.next": { en: "Next →", ur: "اگلا →", hi: "अगला →" },
  "common.error": { en: "Error", ur: "خرابی", hi: "त्रुटि" },
  "common.loading": { en: "Loading...", ur: "لوڈ ہو رہا ہے...", hi: "लोड हो रहा है..." },
  "common.of": { en: "of", ur: "از", hi: "में से" },
  "common.add": { en: "Add", ur: "شامل کریں", hi: "जोड़ें" },
  "common.item": { en: "Item", ur: "آئٹم", hi: "आइटम" },

  // Donate page extras
  "donate.donations": { en: "Donations", ur: "عطیات", hi: "दान" },
  "donate.raised": { en: "Raised", ur: "جمع شدہ", hi: "जुटाया गया" },
  "donate.comingSoon": { en: "Coming Soon", ur: "جلد آ رہا ہے", hi: "जल्द आ रहा है" },
  "donate.razorpayDesc": { en: "Razorpay payment gateway support with automatic donation tracking, multiple payment methods (UPI, Cards, Net Banking) & live donation stats.", ur: "Razorpay پیمنٹ گیٹ وے سپورٹ خودکار عطیات ٹریکنگ، متعدد ادائیگی طریقے (UPI، کارڈز، نیٹ بینکنگ) اور لائیو عطیات کے اعداد و شمار کے ساتھ۔", hi: "Razorpay पेमेंट गेटवे सपोर्ट ऑटोमैटिक डोनेशन ट्रैकिंग, कई पेमेंट तरीके (UPI, कार्ड, नेट बैंकिंग) और लाइव डोनेशन स्टैट्स।" },

  // Zakat Calculator
  "zakat.goldSilverRates": { en: "Chennai Gold & Silver Rates", ur: "چنئی سونے اور چاندی کی قیمتیں", hi: "चेन्नई सोने और चांदी की दरें" },
  "zakat.goldRate": { en: "Gold 22K Rate (₹/gm)", ur: "سونا 22K ریٹ (₹/گرام)", hi: "सोना 22K रेट (₹/ग्राम)" },
  "zakat.silverRate": { en: "Silver Rate (₹/gm)", ur: "چاندی ریٹ (₹/گرام)", hi: "चांदी रेट (₹/ग्राम)" },
  "zakat.gold": { en: "Gold", ur: "سونا", hi: "सोना" },
  "zakat.silver": { en: "Silver", ur: "چاندی", hi: "चांदी" },
  "zakat.inputType": { en: "Input Type", ur: "ان پٹ کی قسم", hi: "इनपुट प्रकार" },
  "zakat.grams": { en: "Grams", ur: "گرام", hi: "ग्राम" },
  "zakat.rupees": { en: "Rupees (₹)", ur: "روپے (₹)", hi: "रुपये (₹)" },
  "zakat.carat": { en: "Carat", ur: "کیرٹ", hi: "कैरेट" },
  "zakat.value": { en: "Value", ur: "قیمت", hi: "मूल्य" },
  "zakat.enterWeight": { en: "Enter weight", ur: "وزن درج کریں", hi: "वज़न दर्ज करें" },
  "zakat.enterValue": { en: "Enter value", ur: "قیمت درج کریں", hi: "मूल्य दर्ज करें" },
  "zakat.totalGold": { en: "Total Gold", ur: "کل سونا", hi: "कुल सोना" },
  "zakat.totalSilver": { en: "Total Silver", ur: "کل چاندی", hi: "कुल चांदी" },
  "zakat.cashAssets": { en: "Cash & Other Assets", ur: "نقد اور دیگر اثاثے", hi: "नकद और अन्य संपत्ति" },
  "zakat.cashInHand": { en: "Cash in Hand/Bank", ur: "ہاتھ/بینک میں نقد رقم", hi: "हाथ/बैंक में नकद" },
  "zakat.otherAssets": { en: "Other Assets (Business, Investments)", ur: "دیگر اثاثے (کاروبار، سرمایہ کاری)", hi: "अन्य संपत्ति (व्यापार, निवेश)" },
  "zakat.liabilities": { en: "Liabilities/Debts", ur: "واجبات/قرض", hi: "देनदारियां/क़र्ज़" },
  "zakat.enterAmount": { en: "Enter amount in ₹", ur: "رقم درج کریں ₹ میں", hi: "₹ में राशि दर्ज करें" },
  "zakat.calculate": { en: "Calculate Zakat", ur: "زکوٰۃ کا حساب لگائیں", hi: "ज़कात की गणना करें" },
  "zakat.totalAssets": { en: "Total Assets", ur: "کل اثاثے", hi: "कुल संपत्ति" },
  "zakat.netAssets": { en: "Net Assets (after debts)", ur: "خالص اثاثے (قرض کے بعد)", hi: "शुद्ध संपत्ति (क़र्ज़ के बाद)" },
  "zakat.nisabThreshold": { en: "Nisab Threshold", ur: "نصاب حد", hi: "निसाब सीमा" },
  "zakat.zakatPayable": { en: "Zakat Payable (2.5%)", ur: "واجب زکوٰۃ (2.5%)", hi: "देय ज़कात (2.5%)" },
  "zakat.zakatDue": { en: "Zakat Due", ur: "زکوٰۃ واجب ہے", hi: "ज़कात देय" },
  "zakat.belowNisab": { en: "Below Nisab", ur: "نصاب سے کم", hi: "निसाब से कम" },
  "zakat.belowNisabDesc": { en: "Your net assets are below the Nisab threshold. Zakat is not obligatory.", ur: "آپ کے خالص اثاثے نصاب حد سے کم ہیں۔ زکوٰۃ واجب نہیں۔", hi: "आपकी शुद्ध संपत्ति निसाब सीमा से कम है। ज़कात अनिवार्य नहीं।" },
  "zakat.downloadPDF": { en: "Download PDF Report", ur: "PDF رپورٹ ڈاؤن لوڈ کریں", hi: "PDF रिपोर्ट डाउनलोड करें" },
  "zakat.calculateFirst": { en: "Calculate first", ur: "پہلے حساب لگائیں", hi: "पहले गणना करें" },
  "zakat.calculateFirstDesc": { en: "Please calculate zakat before exporting.", ur: "ایکسپورٹ سے پہلے زکوٰۃ کا حساب لگائیں۔", hi: "निर्यात करने से पहले ज़कात की गणना करें।" },
  "zakat.pdfDownloaded": { en: "PDF Downloaded", ur: "PDF ڈاؤن لوڈ ہو گئی", hi: "PDF डाउनलोड हो गई" },
  "zakat.pdfSaved": { en: "Zakat calculation saved successfully.", ur: "زکوٰۃ کا حساب کامیابی سے محفوظ ہو گیا۔", hi: "ज़कात गणना सफलतापूर्वक सहेजी गई।" },
  "zakat.yourName": { en: "Your Name", ur: "آپ کا نام", hi: "आपका नाम" },
  "common.optional": { en: "Optional", ur: "اختیاری", hi: "वैकल्पिक" },
  "zakat.nisabInfo": { en: "Nisab Information", ur: "نصاب کی معلومات", hi: "निसाब की जानकारी" },
  "zakat.goldNisab": { en: "Gold Nisab: 87.48g (7.5 tola)", ur: "سونے کا نصاب: 87.48 گرام (7.5 تولہ)", hi: "सोने का निसाब: 87.48 ग्राम (7.5 तोला)" },
  "zakat.silverNisab": { en: "Silver Nisab: 612.36g (52.5 tola)", ur: "چاندی کا نصاب: 612.36 گرام (52.5 تولہ)", hi: "चांदी का निसाब: 612.36 ग्राम (52.5 तोला)" },
  "zakat.zakatRate": { en: "Zakat Rate: 2.5% of total zakatable wealth", ur: "زکوٰۃ کی شرح: کل قابل زکوٰۃ دولت کا 2.5%", hi: "ज़कात दर: कुल ज़कात योग्य संपत्ति का 2.5%" },
  "zakat.silverNisabNote": { en: "Note: We use Silver Nisab as it results in lower threshold.", ur: "نوٹ: ہم چاندی کا نصاب استعمال کرتے ہیں کیونکہ یہ کم حد دیتا ہے۔", hi: "नोट: हम चांदी का निसाब उपयोग करते हैं क्योंकि यह कम सीमा देता है।" },
};

type I18nContextType = {
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  isRTL: false,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() =>
    (localStorage.getItem("app_lang") as AppLanguage) || "en"
  );

  const setLang = (l: AppLanguage) => {
    setLangState(l);
    localStorage.setItem("app_lang", l);
  };

  const t = (key: string): string => {
    return T[key]?.[lang] || T[key]?.en || key;
  };

  const isRTL = lang === "ur";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
};

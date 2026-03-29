export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  translation: string;
  ayahs: number;
  type: "Meccan" | "Medinan";
}

export const SURAHS: SurahInfo[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Faatiha", translation: "The Opening", ayahs: 7, type: "Meccan" },
  { number: 2, name: "البقرة", englishName: "Al-Baqara", translation: "The Cow", ayahs: 286, type: "Medinan" },
  { number: 3, name: "آل عمران", englishName: "Aal-i-Imraan", translation: "The Family of Imraan", ayahs: 200, type: "Medinan" },
  { number: 4, name: "النساء", englishName: "An-Nisaa", translation: "The Women", ayahs: 176, type: "Medinan" },
  { number: 5, name: "المائدة", englishName: "Al-Maaida", translation: "The Table Spread", ayahs: 120, type: "Medinan" },
  { number: 6, name: "الأنعام", englishName: "Al-An'aam", translation: "The Cattle", ayahs: 165, type: "Meccan" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raaf", translation: "The Heights", ayahs: 206, type: "Meccan" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfaal", translation: "The Spoils of War", ayahs: 75, type: "Medinan" },
  { number: 9, name: "التوبة", englishName: "At-Tawba", translation: "The Repentance", ayahs: 129, type: "Medinan" },
  { number: 10, name: "يونس", englishName: "Yunus", translation: "Jonah", ayahs: 109, type: "Meccan" },
  { number: 11, name: "هود", englishName: "Hud", translation: "Hud", ayahs: 123, type: "Meccan" },
  { number: 12, name: "يوسف", englishName: "Yusuf", translation: "Joseph", ayahs: 111, type: "Meccan" },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", translation: "The Thunder", ayahs: 43, type: "Medinan" },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", translation: "Abraham", ayahs: 52, type: "Meccan" },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", translation: "The Rocky Tract", ayahs: 99, type: "Meccan" },
  { number: 16, name: "النحل", englishName: "An-Nahl", translation: "The Bee", ayahs: 128, type: "Meccan" },
  { number: 17, name: "الإسراء", englishName: "Al-Israa", translation: "The Night Journey", ayahs: 111, type: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", translation: "The Cave", ayahs: 110, type: "Meccan" },
  { number: 19, name: "مريم", englishName: "Maryam", translation: "Mary", ayahs: 98, type: "Meccan" },
  { number: 20, name: "طه", englishName: "Taa-Haa", translation: "Taa-Haa", ayahs: 135, type: "Meccan" },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiyaa", translation: "The Prophets", ayahs: 112, type: "Meccan" },
  { number: 22, name: "الحج", englishName: "Al-Hajj", translation: "The Pilgrimage", ayahs: 78, type: "Medinan" },
  { number: 23, name: "المؤمنون", englishName: "Al-Muminoon", translation: "The Believers", ayahs: 118, type: "Meccan" },
  { number: 24, name: "النور", englishName: "An-Noor", translation: "The Light", ayahs: 64, type: "Medinan" },
  { number: 25, name: "الفرقان", englishName: "Al-Furqaan", translation: "The Criterion", ayahs: 77, type: "Meccan" },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'araa", translation: "The Poets", ayahs: 227, type: "Meccan" },
  { number: 27, name: "النمل", englishName: "An-Naml", translation: "The Ant", ayahs: 93, type: "Meccan" },
  { number: 28, name: "القصص", englishName: "Al-Qasas", translation: "The Stories", ayahs: 88, type: "Meccan" },
  { number: 29, name: "العنكبوت", englishName: "Al-Ankaboot", translation: "The Spider", ayahs: 69, type: "Meccan" },
  { number: 30, name: "الروم", englishName: "Ar-Room", translation: "The Romans", ayahs: 60, type: "Meccan" },
  { number: 31, name: "لقمان", englishName: "Luqman", translation: "Luqman", ayahs: 34, type: "Meccan" },
  { number: 32, name: "السجدة", englishName: "As-Sajda", translation: "The Prostration", ayahs: 30, type: "Meccan" },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzaab", translation: "The Clans", ayahs: 73, type: "Medinan" },
  { number: 34, name: "سبأ", englishName: "Saba", translation: "Sheba", ayahs: 54, type: "Meccan" },
  { number: 35, name: "فاطر", englishName: "Faatir", translation: "The Originator", ayahs: 45, type: "Meccan" },
  { number: 36, name: "يس", englishName: "Yaseen", translation: "Yaseen", ayahs: 83, type: "Meccan" },
  { number: 37, name: "الصافات", englishName: "As-Saaffaat", translation: "Those Ranged in Ranks", ayahs: 182, type: "Meccan" },
  { number: 38, name: "ص", englishName: "Saad", translation: "The Letter Saad", ayahs: 88, type: "Meccan" },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", translation: "The Groups", ayahs: 75, type: "Meccan" },
  { number: 40, name: "غافر", englishName: "Ghafir", translation: "The Forgiver", ayahs: 85, type: "Meccan" },
  { number: 41, name: "فصلت", englishName: "Fussilat", translation: "Explained in Detail", ayahs: 54, type: "Meccan" },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", translation: "The Consultation", ayahs: 53, type: "Meccan" },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", translation: "The Gold Adornments", ayahs: 89, type: "Meccan" },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhaan", translation: "The Smoke", ayahs: 59, type: "Meccan" },
  { number: 45, name: "الجاثية", englishName: "Al-Jaathiya", translation: "The Crouching", ayahs: 37, type: "Meccan" },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", translation: "The Wind-curved Sandhills", ayahs: 35, type: "Meccan" },
  { number: 47, name: "محمد", englishName: "Muhammad", translation: "Muhammad", ayahs: 38, type: "Medinan" },
  { number: 48, name: "الفتح", englishName: "Al-Fath", translation: "The Victory", ayahs: 29, type: "Medinan" },
  { number: 49, name: "الحجرات", englishName: "Al-Hujuraat", translation: "The Rooms", ayahs: 18, type: "Medinan" },
  { number: 50, name: "ق", englishName: "Qaaf", translation: "The Letter Qaaf", ayahs: 45, type: "Meccan" },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhaariyat", translation: "The Winnowing Winds", ayahs: 60, type: "Meccan" },
  { number: 52, name: "الطور", englishName: "At-Tur", translation: "The Mount", ayahs: 49, type: "Meccan" },
  { number: 53, name: "النجم", englishName: "An-Najm", translation: "The Star", ayahs: 62, type: "Meccan" },
  { number: 54, name: "القمر", englishName: "Al-Qamar", translation: "The Moon", ayahs: 55, type: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahmaan", translation: "The Beneficent", ayahs: 78, type: "Medinan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waaqia", translation: "The Event", ayahs: 96, type: "Meccan" },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", translation: "The Iron", ayahs: 29, type: "Medinan" },
  { number: 58, name: "المجادلة", englishName: "Al-Mujaadila", translation: "The Pleading Woman", ayahs: 22, type: "Medinan" },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", translation: "The Exile", ayahs: 24, type: "Medinan" },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahana", translation: "She That Is Examined", ayahs: 13, type: "Medinan" },
  { number: 61, name: "الصف", englishName: "As-Saff", translation: "The Ranks", ayahs: 14, type: "Medinan" },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'a", translation: "The Congregation", ayahs: 11, type: "Medinan" },
  { number: 63, name: "المنافقون", englishName: "Al-Munaafiqoon", translation: "The Hypocrites", ayahs: 11, type: "Medinan" },
  { number: 64, name: "التغابن", englishName: "At-Taghaabun", translation: "The Mutual Disillusion", ayahs: 18, type: "Medinan" },
  { number: 65, name: "الطلاق", englishName: "At-Talaaq", translation: "The Divorce", ayahs: 12, type: "Medinan" },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", translation: "The Prohibition", ayahs: 12, type: "Medinan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", translation: "The Sovereignty", ayahs: 30, type: "Meccan" },
  { number: 68, name: "القلم", englishName: "Al-Qalam", translation: "The Pen", ayahs: 52, type: "Meccan" },
  { number: 69, name: "الحاقة", englishName: "Al-Haaqqa", translation: "The Reality", ayahs: 52, type: "Meccan" },
  { number: 70, name: "المعارج", englishName: "Al-Ma'aarij", translation: "The Ascending Stairways", ayahs: 44, type: "Meccan" },
  { number: 71, name: "نوح", englishName: "Nooh", translation: "Noah", ayahs: 28, type: "Meccan" },
  { number: 72, name: "الجن", englishName: "Al-Jinn", translation: "The Jinn", ayahs: 28, type: "Meccan" },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", translation: "The Enshrouded One", ayahs: 20, type: "Meccan" },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", translation: "The Cloaked One", ayahs: 56, type: "Meccan" },
  { number: 75, name: "القيامة", englishName: "Al-Qiyaama", translation: "The Resurrection", ayahs: 40, type: "Meccan" },
  { number: 76, name: "الإنسان", englishName: "Al-Insaan", translation: "The Man", ayahs: 31, type: "Medinan" },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalaat", translation: "The Emissaries", ayahs: 50, type: "Meccan" },
  { number: 78, name: "النبأ", englishName: "An-Naba", translation: "The Tidings", ayahs: 40, type: "Meccan" },
  { number: 79, name: "النازعات", englishName: "An-Naazi'aat", translation: "Those Who Drag Forth", ayahs: 46, type: "Meccan" },
  { number: 80, name: "عبس", englishName: "Abasa", translation: "He Frowned", ayahs: 42, type: "Meccan" },
  { number: 81, name: "التكوير", englishName: "At-Takwir", translation: "The Overthrowing", ayahs: 29, type: "Meccan" },
  { number: 82, name: "الانفطار", englishName: "Al-Infitaar", translation: "The Cleaving", ayahs: 19, type: "Meccan" },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", translation: "The Defrauding", ayahs: 36, type: "Meccan" },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaaq", translation: "The Sundering", ayahs: 25, type: "Meccan" },
  { number: 85, name: "البروج", englishName: "Al-Burooj", translation: "The Mansions of the Stars", ayahs: 22, type: "Meccan" },
  { number: 86, name: "الطارق", englishName: "At-Taariq", translation: "The Morning Star", ayahs: 17, type: "Meccan" },
  { number: 87, name: "الأعلى", englishName: "Al-A'laa", translation: "The Most High", ayahs: 19, type: "Meccan" },
  { number: 88, name: "الغاشية", englishName: "Al-Ghaashiya", translation: "The Overwhelming", ayahs: 26, type: "Meccan" },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", translation: "The Dawn", ayahs: 30, type: "Meccan" },
  { number: 90, name: "البلد", englishName: "Al-Balad", translation: "The City", ayahs: 20, type: "Meccan" },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", translation: "The Sun", ayahs: 15, type: "Meccan" },
  { number: 92, name: "الليل", englishName: "Al-Lail", translation: "The Night", ayahs: 21, type: "Meccan" },
  { number: 93, name: "الضحى", englishName: "Ad-Dhuhaa", translation: "The Morning Hours", ayahs: 11, type: "Meccan" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", translation: "The Relief", ayahs: 8, type: "Meccan" },
  { number: 95, name: "التين", englishName: "At-Tin", translation: "The Fig", ayahs: 8, type: "Meccan" },
  { number: 96, name: "العلق", englishName: "Al-Alaq", translation: "The Clot", ayahs: 19, type: "Meccan" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", translation: "The Power", ayahs: 5, type: "Meccan" },
  { number: 98, name: "البينة", englishName: "Al-Bayyina", translation: "The Clear Proof", ayahs: 8, type: "Medinan" },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzala", translation: "The Earthquake", ayahs: 8, type: "Medinan" },
  { number: 100, name: "العاديات", englishName: "Al-Aadiyaat", translation: "The Courser", ayahs: 11, type: "Meccan" },
  { number: 101, name: "القارعة", englishName: "Al-Qaari'a", translation: "The Calamity", ayahs: 11, type: "Meccan" },
  { number: 102, name: "التكاثر", englishName: "At-Takaathur", translation: "The Rivalry in World Increase", ayahs: 8, type: "Meccan" },
  { number: 103, name: "العصر", englishName: "Al-Asr", translation: "The Declining Day", ayahs: 3, type: "Meccan" },
  { number: 104, name: "الهمزة", englishName: "Al-Humaza", translation: "The Traducer", ayahs: 9, type: "Meccan" },
  { number: 105, name: "الفيل", englishName: "Al-Fil", translation: "The Elephant", ayahs: 5, type: "Meccan" },
  { number: 106, name: "قريش", englishName: "Quraish", translation: "Quraysh", ayahs: 4, type: "Meccan" },
  { number: 107, name: "الماعون", englishName: "Al-Maa'un", translation: "The Small Kindnesses", ayahs: 7, type: "Meccan" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", translation: "The Abundance", ayahs: 3, type: "Meccan" },
  { number: 109, name: "الكافرون", englishName: "Al-Kaafiroon", translation: "The Disbelievers", ayahs: 6, type: "Meccan" },
  { number: 110, name: "النصر", englishName: "An-Nasr", translation: "The Divine Support", ayahs: 3, type: "Medinan" },
  { number: 111, name: "المسد", englishName: "Al-Masad", translation: "The Palm Fibre", ayahs: 5, type: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlaas", translation: "The Sincerity", ayahs: 4, type: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", translation: "The Daybreak", ayahs: 5, type: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Naas", translation: "Mankind", ayahs: 6, type: "Meccan" },
];

export const TOTAL_PAGES = 604;
export const TOTAL_JUZS = 30;

// Saudi Mushaf (Madani) surah start pages
export const SURAH_START_PAGES: Record<number, number> = {
  1:1,2:2,3:50,4:77,5:106,6:128,7:151,8:177,9:187,10:208,
  11:221,12:235,13:249,14:255,15:262,16:267,17:282,18:293,19:305,20:312,
  21:322,22:332,23:342,24:350,25:359,26:367,27:377,28:385,29:396,30:404,
  31:411,32:415,33:418,34:428,35:434,36:440,37:446,38:453,39:458,40:467,
  41:477,42:483,43:489,44:496,45:499,46:502,47:507,48:511,49:515,50:518,
  51:520,52:523,53:526,54:528,55:531,56:534,57:537,58:542,59:545,60:549,
  61:551,62:553,63:554,64:556,65:558,66:560,67:562,68:564,69:566,70:568,
  71:570,72:572,73:574,74:575,75:577,76:578,77:580,78:582,79:583,80:585,
  81:586,82:587,83:587,84:589,85:590,86:591,87:591,88:592,89:593,90:594,
  91:595,92:595,93:596,94:596,95:597,96:597,97:598,98:598,99:599,100:599,
  101:600,102:600,103:601,104:601,105:601,106:602,107:602,108:602,109:603,110:603,
  111:603,112:604,113:604,114:604,
};

// Indo-Pak 16-line (Taj Company) surah start pages
export const INDIAN_SURAH_START_PAGES: Record<number, number> = {
  1:1,2:2,3:45,4:70,5:97,6:117,7:138,8:162,9:172,10:191,
  11:203,12:216,13:229,14:234,15:241,16:246,17:259,18:270,19:280,20:287,
  21:296,22:305,23:314,24:322,25:330,26:337,27:346,28:354,29:364,30:371,
  31:378,32:381,33:384,34:393,35:398,36:404,37:410,38:416,39:421,40:429,
  41:438,42:443,43:449,44:455,45:458,46:461,47:465,48:469,49:473,50:476,
  51:478,52:481,53:483,54:486,55:488,56:491,57:494,58:499,59:502,60:505,
  61:508,62:509,63:511,64:512,65:514,66:516,67:518,68:520,69:522,70:524,
  71:526,72:527,73:529,74:530,75:532,76:533,77:535,78:537,79:538,80:540,
  81:541,82:542,83:542,84:544,85:544,86:545,87:546,88:546,89:547,90:548,
  91:549,92:549,93:550,94:550,95:551,96:551,97:552,98:552,99:553,100:553,
  101:554,102:554,103:555,104:555,105:555,106:556,107:556,108:556,109:557,110:557,
  111:557,112:558,113:558,114:559,
};

export function getSurahPageRange(surahNum: number, style: "saudi" | "indopak" | "hifz"): { startPage: number; endPage: number } {
  const effectiveStyle = style === "hifz" ? "saudi" : style;
  const pages = effectiveStyle === "indopak" ? INDIAN_SURAH_START_PAGES : SURAH_START_PAGES;
  const totalPages = effectiveStyle === "indopak" ? 559 : 604;
  const start = pages[surahNum] || 1;
  const end = surahNum < 114 ? (pages[surahNum + 1] || totalPages) - 1 : totalPages;
  return { startPage: start, endPage: Math.max(start, end) };
}

export interface JuzInfo {
  number: number;
  name: string;
  nameTransliteration: string;
  startPage: number;
  endPage: number;
  startSurah: string;
  endSurah: string;
}

export const JUZ_DATA: JuzInfo[] = [
  { number: 1, name: "آلم", nameTransliteration: "Alif-Lam-Mim", startPage: 1, endPage: 21, startSurah: "Al-Faatiha 1:1", endSurah: "Al-Baqara 2:141" },
  { number: 2, name: "سيقول", nameTransliteration: "Sayaqul", startPage: 22, endPage: 41, startSurah: "Al-Baqara 2:142", endSurah: "Al-Baqara 2:252" },
  { number: 3, name: "تلك الرسل", nameTransliteration: "Tilkal Rusul", startPage: 42, endPage: 61, startSurah: "Al-Baqara 2:253", endSurah: "Aal-i-Imraan 3:92" },
  { number: 4, name: "لن تنالوا", nameTransliteration: "Lan Tanalu", startPage: 62, endPage: 81, startSurah: "Aal-i-Imraan 3:93", endSurah: "An-Nisaa 4:23" },
  { number: 5, name: "والمحصنات", nameTransliteration: "Wal Muhsanat", startPage: 82, endPage: 101, startSurah: "An-Nisaa 4:24", endSurah: "An-Nisaa 4:147" },
  { number: 6, name: "لا يحب الله", nameTransliteration: "La Yuhibbullah", startPage: 102, endPage: 121, startSurah: "An-Nisaa 4:148", endSurah: "Al-Maaida 5:81" },
  { number: 7, name: "وإذا سمعوا", nameTransliteration: "Wa Iz Sami'u", startPage: 122, endPage: 141, startSurah: "Al-Maaida 5:82", endSurah: "Al-An'aam 6:110" },
  { number: 8, name: "ولو أننا", nameTransliteration: "Wa Lau Annana", startPage: 142, endPage: 161, startSurah: "Al-An'aam 6:111", endSurah: "Al-A'raaf 7:87" },
  { number: 9, name: "قال الملأ", nameTransliteration: "Qalal Mala'u", startPage: 162, endPage: 181, startSurah: "Al-A'raaf 7:88", endSurah: "Al-Anfaal 8:40" },
  { number: 10, name: "واعلموا", nameTransliteration: "Wa'lamu", startPage: 182, endPage: 201, startSurah: "Al-Anfaal 8:41", endSurah: "At-Tawba 9:92" },
  { number: 11, name: "يعتذرون", nameTransliteration: "Ya'tazirun", startPage: 202, endPage: 221, startSurah: "At-Tawba 9:93", endSurah: "Hud 11:5" },
  { number: 12, name: "وما من دابة", nameTransliteration: "Wa Ma Min Dabbah", startPage: 222, endPage: 241, startSurah: "Hud 11:6", endSurah: "Yusuf 12:52" },
  { number: 13, name: "وما أبرئ", nameTransliteration: "Wa Ma Ubarri'u", startPage: 242, endPage: 261, startSurah: "Yusuf 12:53", endSurah: "Ibrahim 14:52" },
  { number: 14, name: "ربما", nameTransliteration: "Rubama", startPage: 262, endPage: 281, startSurah: "Al-Hijr 15:1", endSurah: "An-Nahl 16:128" },
  { number: 15, name: "سبحان الذي", nameTransliteration: "Subhanalladhi", startPage: 282, endPage: 301, startSurah: "Al-Israa 17:1", endSurah: "Al-Kahf 18:74" },
  { number: 16, name: "قال ألم", nameTransliteration: "Qala Alam", startPage: 302, endPage: 321, startSurah: "Al-Kahf 18:75", endSurah: "Taa-Haa 20:135" },
  { number: 17, name: "اقترب للناس", nameTransliteration: "Iqtaraba Lin-Nasi", startPage: 322, endPage: 341, startSurah: "Al-Anbiyaa 21:1", endSurah: "Al-Hajj 22:78" },
  { number: 18, name: "قد أفلح", nameTransliteration: "Qad Aflaha", startPage: 342, endPage: 361, startSurah: "Al-Muminoon 23:1", endSurah: "Al-Furqaan 25:20" },
  { number: 19, name: "وقال الذين", nameTransliteration: "Wa Qalal-ladhina", startPage: 362, endPage: 381, startSurah: "Al-Furqaan 25:21", endSurah: "An-Naml 27:55" },
  { number: 20, name: "أمن خلق", nameTransliteration: "Amman Khalaqa", startPage: 382, endPage: 401, startSurah: "An-Naml 27:56", endSurah: "Al-Ankaboot 29:45" },
  { number: 21, name: "اتل ما أوحي", nameTransliteration: "Utlu Ma Uhiya", startPage: 402, endPage: 421, startSurah: "Al-Ankaboot 29:46", endSurah: "Al-Ahzaab 33:30" },
  { number: 22, name: "ومن يقنت", nameTransliteration: "Wa Man Yaqnut", startPage: 422, endPage: 441, startSurah: "Al-Ahzaab 33:31", endSurah: "Yaseen 36:27" },
  { number: 23, name: "وما لي", nameTransliteration: "Wa Maliya", startPage: 442, endPage: 461, startSurah: "Yaseen 36:28", endSurah: "Az-Zumar 39:31" },
  { number: 24, name: "فمن أظلم", nameTransliteration: "Faman Azlamu", startPage: 462, endPage: 481, startSurah: "Az-Zumar 39:32", endSurah: "Fussilat 41:46" },
  { number: 25, name: "إليه يرد", nameTransliteration: "Ilaihi Yuraddu", startPage: 482, endPage: 501, startSurah: "Fussilat 41:47", endSurah: "Al-Jaathiya 45:37" },
  { number: 26, name: "حم", nameTransliteration: "Ha-Mim", startPage: 502, endPage: 521, startSurah: "Al-Ahqaf 46:1", endSurah: "Adh-Dhaariyat 51:30" },
  { number: 27, name: "قال فما خطبكم", nameTransliteration: "Qala Fama Khatbukum", startPage: 522, endPage: 541, startSurah: "Adh-Dhaariyat 51:31", endSurah: "Al-Hadid 57:29" },
  { number: 28, name: "قد سمع الله", nameTransliteration: "Qad Sami'allahu", startPage: 542, endPage: 561, startSurah: "Al-Mujaadila 58:1", endSurah: "At-Tahrim 66:12" },
  { number: 29, name: "تبارك الذي", nameTransliteration: "Tabarakalladhi", startPage: 562, endPage: 581, startSurah: "Al-Mulk 67:1", endSurah: "Al-Mursalaat 77:50" },
  { number: 30, name: "عم يتساءلون", nameTransliteration: "Amma Yatasa'alun", startPage: 582, endPage: 604, startSurah: "An-Naba 78:1", endSurah: "An-Naas 114:6" },
];

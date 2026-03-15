// Islamic Lectures - Archive.org audio sources for in-app streaming

export interface LectureSeries {
  id: string;
  title: string;
  titleUr: string;
  speaker: string;
  speakerUr: string;
  icon: string;
  description: string;
  descriptionUr: string;
  lectures: LectureItem[];
}

export interface LectureItem {
  id: string;
  title: string;
  titleUr: string;
  audioUrl: string;
  duration?: string;
}

export const LECTURE_SERIES: LectureSeries[] = [
  {
    id: "dr-israr-bayan",
    title: "Bayan ul Quran - Dr. Israr Ahmad",
    titleUr: "بیان القرآن - ڈاکٹر اسرار احمد",
    speaker: "Dr. Israr Ahmad",
    speakerUr: "ڈاکٹر اسرار احمد",
    icon: "🎙️",
    description: "Complete Urdu Tafseer of the Quran by Dr. Israr Ahmad",
    descriptionUr: "ڈاکٹر اسرار احمد کی قرآن کی مکمل اردو تفسیر",
    lectures: [
      { id: "bayan-1", title: "Surah Al-Fatihah", titleUr: "سورۃ الفاتحہ", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/001 - Al-Fatihah ( The Opening ) - سورة الفاتحة.mp3" },
      { id: "bayan-2", title: "Surah Al-Baqarah", titleUr: "سورۃ البقرہ", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/002 - Al-Baqarah ( The Cow ) - سورة البقرة.mp3" },
      { id: "bayan-3", title: "Surah Aal-e-Imran", titleUr: "سورۃ آل عمران", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/003 - Al-Imran ( The Family of Imran ) - سورة آل عمران.mp3" },
      { id: "bayan-4", title: "Surah An-Nisa", titleUr: "سورۃ النساء", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/004 - An-Nisa ( The Women ) - سورة النساء.mp3" },
      { id: "bayan-5", title: "Surah Al-Maidah", titleUr: "سورۃ المائدہ", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/005 - Al-Maidah ( The Table spread with Food ) - سورة المائدة.mp3" },
      { id: "bayan-36", title: "Surah Ya-Sin", titleUr: "سورۃ یٰسین", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/036 - Ya-seen - سورة يس.mp3" },
      { id: "bayan-55", title: "Surah Ar-Rahman", titleUr: "سورۃ الرحمٰن", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/055 - Ar-Rahman ( The Most Graciouse ) - سورة الرحمن.mp3" },
      { id: "bayan-56", title: "Surah Al-Waqiah", titleUr: "سورۃ الواقعہ", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/056 - Al-Waqi'ah ( The Event ) - سورة الواقعة.mp3" },
      { id: "bayan-67", title: "Surah Al-Mulk", titleUr: "سورۃ الملک", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/067 - Al-Mulk ( Dominion ) - سورة الملك.mp3" },
      { id: "bayan-78", title: "Surah An-Naba", titleUr: "سورۃ النبا", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/078 - An-Naba' ( The Great News ) - سورة النبأ.mp3" },
      { id: "bayan-112", title: "Surah Al-Ikhlas", titleUr: "سورۃ الاخلاص", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/112 - Al-Ikhlas ( Sincerity ) - سورة الإخلاص.mp3" },
      { id: "bayan-114", title: "Surah An-Nas", titleUr: "سورۃ الناس", audioUrl: "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/114 - An-Nas ( Mankind ) - سورة الناس.mp3" },
    ]
  },
  {
    id: "seerat-lectures",
    title: "Seerat un Nabi Lectures",
    titleUr: "سیرت النبی لیکچرز",
    speaker: "Various Scholars",
    speakerUr: "مختلف علماء",
    icon: "🕌",
    description: "Collection of lectures on the life of Prophet Muhammad ﷺ",
    descriptionUr: "نبی کریم ﷺ کی سیرت پر لیکچرز کا مجموعہ",
    lectures: [
      { id: "seerat-1", title: "Birth & Early Life of the Prophet", titleUr: "نبی ﷺ کی ولادت اور ابتدائی زندگی", audioUrl: "https://archive.org/download/Seerat-un-Nabi-PBUH-Dr-Israr-Ahmad/01-Seerat-un-Nabi-PBUH.mp3" },
      { id: "seerat-2", title: "Prophethood & First Revelation", titleUr: "نبوت اور پہلی وحی", audioUrl: "https://archive.org/download/Seerat-un-Nabi-PBUH-Dr-Israr-Ahmad/02-Seerat-un-Nabi-PBUH.mp3" },
      { id: "seerat-3", title: "Persecution & Migration", titleUr: "ایذا رسانی اور ہجرت", audioUrl: "https://archive.org/download/Seerat-un-Nabi-PBUH-Dr-Israr-Ahmad/03-Seerat-un-Nabi-PBUH.mp3" },
      { id: "seerat-4", title: "Life in Madinah", titleUr: "مدینہ کی زندگی", audioUrl: "https://archive.org/download/Seerat-un-Nabi-PBUH-Dr-Israr-Ahmad/04-Seerat-un-Nabi-PBUH.mp3" },
      { id: "seerat-5", title: "Major Battles & Conquests", titleUr: "اہم غزوات اور فتوحات", audioUrl: "https://archive.org/download/Seerat-un-Nabi-PBUH-Dr-Israr-Ahmad/05-Seerat-un-Nabi-PBUH.mp3" },
    ]
  },
  {
    id: "islamic-guidance",
    title: "Islamic Guidance & Reminders",
    titleUr: "اسلامی رہنمائی اور نصیحت",
    speaker: "Various Scholars",
    speakerUr: "مختلف علماء",
    icon: "🎤",
    description: "Short lectures on various Islamic topics for daily guidance",
    descriptionUr: "روزمرہ رہنمائی کے لیے مختلف اسلامی موضوعات پر مختصر بیانات",
    lectures: [
      { id: "guide-1", title: "Importance of Salah", titleUr: "نماز کی اہمیت", audioUrl: "https://archive.org/download/importance-of-salah-dr-israr/Importance-of-Salah.mp3" },
      { id: "guide-2", title: "Virtues of Dhikr", titleUr: "ذکر کے فضائل", audioUrl: "https://archive.org/download/Fazail-e-Zikr/Fazail-e-Zikr.mp3" },
      { id: "guide-3", title: "Rights of Parents in Islam", titleUr: "اسلام میں والدین کے حقوق", audioUrl: "https://archive.org/download/rights-of-parents-islam/Rights-of-Parents.mp3" },
    ]
  }
];

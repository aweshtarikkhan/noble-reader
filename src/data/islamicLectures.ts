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

const DR_ISRAR_BASE = "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/";

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
      { id: "bayan-1", title: "Surah Al-Fatihah", titleUr: "سورۃ الفاتحہ", audioUrl: `${DR_ISRAR_BASE}001%20-%20Al-Fatihah%20%28%20The%20Opening%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%81%D8%A7%D8%AA%D8%AD%D8%A9.mp3` },
      { id: "bayan-2", title: "Surah Al-Baqarah", titleUr: "سورۃ البقرہ", audioUrl: `${DR_ISRAR_BASE}002%20-%20Al-Baqarah%20%28%20The%20Cow%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A8%D9%82%D8%B1%D8%A9.mp3` },
      { id: "bayan-3", title: "Surah Aal-e-Imran", titleUr: "سورۃ آل عمران", audioUrl: `${DR_ISRAR_BASE}003%20-%20Al-Imran%20%28%20The%20Family%20of%20Imran%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A2%D9%84%20%D8%B9%D9%85%D8%B1%D8%A7%D9%86.mp3` },
      { id: "bayan-4", title: "Surah An-Nisa", titleUr: "سورۃ النساء", audioUrl: `${DR_ISRAR_BASE}004%20-%20An-Nisa%20%28%20The%20Women%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D8%B3%D8%A7%D8%A1.mp3` },
      { id: "bayan-5", title: "Surah Al-Maidah", titleUr: "سورۃ المائدہ", audioUrl: `${DR_ISRAR_BASE}005%20-%20Al-Maidah%20%28%20The%20Table%20spread%20with%20Food%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D8%A7%D8%A6%D8%AF%D8%A9.mp3` },
      { id: "bayan-36", title: "Surah Ya-Sin", titleUr: "سورۃ یٰسین", audioUrl: `${DR_ISRAR_BASE}036%20-%20Ya-seen%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D9%8A%D8%B3.mp3` },
      { id: "bayan-55", title: "Surah Ar-Rahman", titleUr: "سورۃ الرحمٰن", audioUrl: `${DR_ISRAR_BASE}055%20-%20Ar-Rahman%20%28%20The%20Most%20Graciouse%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86.mp3` },
      { id: "bayan-56", title: "Surah Al-Waqiah", titleUr: "سورۃ الواقعہ", audioUrl: `${DR_ISRAR_BASE}056%20-%20Al-Waqi%27ah%20%28%20The%20Event%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%88%D8%A7%D9%82%D8%B9%D8%A9.mp3` },
      { id: "bayan-67", title: "Surah Al-Mulk", titleUr: "سورۃ الملک", audioUrl: `${DR_ISRAR_BASE}067%20-%20Al-Mulk%20%28%20Dominion%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D9%84%D9%83.mp3` },
      { id: "bayan-78", title: "Surah An-Naba", titleUr: "سورۃ النبا", audioUrl: `${DR_ISRAR_BASE}078%20-%20An-Naba%27%20%28%20The%20Great%20News%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D8%A8%D8%A3.mp3` },
      { id: "bayan-112", title: "Surah Al-Ikhlas", titleUr: "سورۃ الاخلاص", audioUrl: `${DR_ISRAR_BASE}112%20-%20Al-Ikhlas%20%28%20Sincerity%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A5%D8%AE%D9%84%D8%A7%D8%B5.mp3` },
      { id: "bayan-114", title: "Surah An-Nas", titleUr: "سورۃ الناس", audioUrl: `${DR_ISRAR_BASE}114%20-%20An-Nas%20%28%20Mankind%20%29%20-%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D8%A7%D8%B3.mp3` },
    ]
  },
  {
    id: "mishary-quran",
    title: "Quran Recitation - Mishary Rashid",
    titleUr: "تلاوت قرآن - مشاری راشد",
    speaker: "Mishary Rashid Alafasy",
    speakerUr: "مشاری راشد العفاسی",
    icon: "🎧",
    description: "Beautiful Quran recitation by Mishary Rashid Alafasy",
    descriptionUr: "مشاری راشد العفاسی کی خوبصورت تلاوت",
    lectures: [
      { id: "mishary-1", title: "Surah Al-Fatihah", titleUr: "سورۃ الفاتحہ", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3" },
      { id: "mishary-36", title: "Surah Ya-Sin", titleUr: "سورۃ یٰسین", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/404.mp3" },
      { id: "mishary-55", title: "Surah Ar-Rahman", titleUr: "سورۃ الرحمٰن", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/531.mp3" },
      { id: "mishary-56", title: "Surah Al-Waqiah", titleUr: "سورۃ الواقعہ", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/534.mp3" },
      { id: "mishary-67", title: "Surah Al-Mulk", titleUr: "سورۃ الملک", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/542.mp3" },
      { id: "mishary-112", title: "Surah Al-Ikhlas", titleUr: "سورۃ الاخلاص", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/604.mp3" },
      { id: "mishary-113", title: "Surah Al-Falaq", titleUr: "سورۃ الفلق", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/605.mp3" },
      { id: "mishary-114", title: "Surah An-Nas", titleUr: "سورۃ الناس", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/606.mp3" },
    ]
  },
  {
    id: "islamic-reminders",
    title: "Islamic Reminders & Nasheeds",
    titleUr: "اسلامی نصیحت اور نشید",
    speaker: "Various Artists",
    speakerUr: "مختلف فنکار",
    icon: "🎤",
    description: "Short Islamic nasheeds and audio reminders",
    descriptionUr: "مختصر اسلامی نشید اور آڈیو نصیحتیں",
    lectures: [
      { id: "tala-al-badru", title: "Tala'al Badru Alayna", titleUr: "طلع البدر علینا", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3" },
      { id: "ayatul-kursi", title: "Ayatul Kursi (Beautiful)", titleUr: "آیۃ الکرسی", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3" },
      { id: "surah-mulk-full", title: "Surah Al-Mulk (Full)", titleUr: "سورۃ الملک (مکمل)", audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/542.mp3" },
    ]
  }
];

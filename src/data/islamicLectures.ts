// Islamic Lectures - Archive.org audio sources for in-app streaming
import { RIYAD_LECTURES } from "./riyadSaliheen";

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

const SEERAT_BASE = "https://archive.org/download/Seerat-un-nabi-seerah-urdu-mp3-audio/";

const DR_ISRAR_BASE = "https://archive.org/download/Bayan-ul-Quran-in-Urdu-by-Dr-Israr-Ahmed-Audio-MP3-CD/";

export const LECTURE_SERIES: LectureSeries[] = [
  {
    id: "seerat-un-nabi",
    title: "Seerat un Nabi ﷺ (Complete)",
    titleUr: "سیرت النبی ﷺ (مکمل)",
    speaker: "Seerah Series",
    speakerUr: "سیرت سیریز",
    icon: "🕌",
    description: "Complete Seerat un Nabi in Urdu - 34 chapters covering the life of Prophet Muhammad ﷺ",
    descriptionUr: "سیرت النبی ﷺ مکمل اردو میں - 34 ابواب نبی کریم ﷺ کی زندگی پر",
    lectures: [
      { id: "seerat-01", title: "Arab before Muhammad ﷺ", titleUr: "محمد ﷺ سے پہلے عرب", audioUrl: `${SEERAT_BASE}%2801%29%20Arab%20before%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "19:58" },
      { id: "seerat-02", title: "Makkah before Muhammad ﷺ", titleUr: "محمد ﷺ سے پہلے مکہ", audioUrl: `${SEERAT_BASE}%2802%29%20Makkah%20before%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "08:01" },
      { id: "seerat-03", title: "Shirk before Muhammad ﷺ", titleUr: "محمد ﷺ سے پہلے شرک", audioUrl: `${SEERAT_BASE}%2803%29%20Shirk%20before%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "15:31" },
      { id: "seerat-04", title: "Jews & Christians before Muhammad ﷺ", titleUr: "محمد ﷺ سے پہلے یہود و نصاریٰ", audioUrl: `${SEERAT_BASE}%2804%29%20Jews%20and%20Christians%20before%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "03:22" },
      { id: "seerat-05", title: "Character of people before Muhammad ﷺ", titleUr: "محمد ﷺ سے پہلے لوگوں کا کردار", audioUrl: `${SEERAT_BASE}%2805%29%20Character%20of%20people%20before%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "10:43" },
      { id: "seerat-06", title: "Story of the Elephant", titleUr: "واقعہ اصحاب الفیل", audioUrl: `${SEERAT_BASE}%2806%29%20Story%20of%20Elephant_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "04:29" },
      { id: "seerat-07", title: "Birth of Muhammad ﷺ & His Family", titleUr: "محمد ﷺ کی ولادت اور خاندان", audioUrl: `${SEERAT_BASE}%2807%29%20Birth%20of%20Muhammad%20%28s%29%20and%20his%20family_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "13:03" },
      { id: "seerat-08", title: "Childhood of Muhammad ﷺ", titleUr: "محمد ﷺ کا بچپن", audioUrl: `${SEERAT_BASE}%2808%29%20Childhood%20of%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "13:56" },
      { id: "seerat-09", title: "First Marriage of Muhammad ﷺ", titleUr: "محمد ﷺ کی پہلی شادی", audioUrl: `${SEERAT_BASE}%2809%29%201st%20marriage%20of%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "03:38" },
      { id: "seerat-10", title: "Muhammad ﷺ before Prophethood", titleUr: "نبوت سے پہلے محمد ﷺ", audioUrl: `${SEERAT_BASE}%2810%29%20Muhammad%20%28s%29_before_prophethood_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "11:22" },
      { id: "seerat-11", title: "Revelation (Wahi) on Prophet ﷺ", titleUr: "نبی ﷺ پر وحی", audioUrl: `${SEERAT_BASE}%2811%29%20Wahi%20on%20Prophet%20Muhammad%20%28s%29_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "09:28" },
      { id: "seerat-12", title: "Open Islamic Invitation", titleUr: "اسلام کی کھلی دعوت", audioUrl: `${SEERAT_BASE}%2812%29_Open_Islamic_invitation_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "24:00" },
      { id: "seerat-13", title: "Muslim Hijrah (Migration)", titleUr: "مسلمانوں کی ہجرت", audioUrl: `${SEERAT_BASE}%2813%29%20Muslim%20Hijrah_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "13:08" },
      { id: "seerat-14", title: "Plots to Kill Muhammad ﷺ", titleUr: "محمد ﷺ کو قتل کرنے کے منصوبے", audioUrl: `${SEERAT_BASE}%2814%29%20Muhammad%20%28s%29%20ko%20qatl%20karne%20ke%20mansoobe_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "14:58" },
      { id: "seerat-15", title: "Boycott of Prophet ﷺ & Muslims", titleUr: "نبی ﷺ اور مسلمانوں کا بائیکاٹ", audioUrl: `${SEERAT_BASE}%2815%29%20Boycott%20of%20Prophet%20Muhammad%20%28s%29%20and%20Muslim_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "15:20" },
      { id: "seerat-16", title: "Journey to Taif", titleUr: "طائف کی طرف سفر", audioUrl: `${SEERAT_BASE}%2816%29%20Muhammad%20%28s%29%20ka%20taif%20ki%20taraf%20safar_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "09:57" },
      { id: "seerat-17", title: "People Accepting Islam", titleUr: "لوگوں کا قبول اسلام", audioUrl: `${SEERAT_BASE}%2817%29%20Muhammad%20%28s%29%20ki%20dawat%20per%20logon%20ka%20qubool%20-e-Islam_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "08:47" },
      { id: "seerat-18", title: "The Night Journey (Meraj)", titleUr: "معراج کا سفر", audioUrl: `${SEERAT_BASE}%2818%29%20Meraaj%20ka%20safar_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "09:14" },
      { id: "seerat-19", title: "Pledge of Allegiance (Bait)", titleUr: "بیعت", audioUrl: `${SEERAT_BASE}%2819%29%20Muhammad%20%28s%29%20se%20bayt_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "10:45" },
      { id: "seerat-20", title: "Hijrah of Muhammad ﷺ", titleUr: "محمد ﷺ کی ہجرت", audioUrl: `${SEERAT_BASE}%2820%29%20Muhammad%20%28s%29%20ki%20Hijrat_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "16:43" },
      { id: "seerat-21", title: "Arrival in Madinah", titleUr: "مدینہ میں آمد", audioUrl: `${SEERAT_BASE}%2821%29%20Muhammad%20%28s%29%20ki%20madina%20me%20aamad_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "06:38" },
      { id: "seerat-22", title: "Construction of Masjid Nabawi", titleUr: "مسجد نبوی کی تعمیر", audioUrl: `${SEERAT_BASE}%2822%29%20Masjid%20e%20Nabwi%20ki%20tameer_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "13:20" },
      { id: "seerat-23", title: "Battle of Badr", titleUr: "جنگ بدر", audioUrl: `${SEERAT_BASE}%2823%29%20Jung%20e%20Badr_-_Seerat-un-Nabi_in_Urdu.mp3.mp3`, duration: "35:44" },
      { id: "seerat-24", title: "Battle of Uhud", titleUr: "جنگ احد", audioUrl: `${SEERAT_BASE}%2824%29%20Jung%20e%20Uhad_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "19:12" },
      { id: "seerat-25", title: "Betrayals Against Muslims", titleUr: "مسلمانوں سے دھوکے", audioUrl: `${SEERAT_BASE}%2825%29%20Musalmanoun%20se%20dhoke_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "17:00" },
      { id: "seerat-26", title: "Battle of Ahzab (Khandaq)", titleUr: "جنگ احزاب (خندق)", audioUrl: `${SEERAT_BASE}%2826%29%20Jung%20e%20Ahzaab_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "25:35" },
      { id: "seerat-27", title: "Treaty of Hudaibiyah", titleUr: "صلح حدیبیہ", audioUrl: `${SEERAT_BASE}%2827%29%20Suleh%20Hudaibiyah%20-%20Treaty%20of%20Hudaibiyah_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "14:44" },
      { id: "seerat-28", title: "Battle of Khaybar", titleUr: "جنگ خیبر", audioUrl: `${SEERAT_BASE}%2828%29%20Jung%20e%20Khaybar_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "16:29" },
      { id: "seerat-29", title: "Letters to Kings", titleUr: "بادشاہوں کو خطوط", audioUrl: `${SEERAT_BASE}%2829%29%20Letters%20of%20Prophet%20Muhammad%20%28s%29%20to%20kings_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "09:02" },
      { id: "seerat-30", title: "Conquest of Makkah", titleUr: "فتح مکہ", audioUrl: `${SEERAT_BASE}%2830%29%20Fateh%20Makkah_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "21:06" },
      { id: "seerat-31", title: "Battle of Hunain", titleUr: "جنگ حنین", audioUrl: `${SEERAT_BASE}%2831%29%20Jung%20e%20Hunain_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "09:22" },
      { id: "seerat-32", title: "Important Events of 9-10 Hijri", titleUr: "9 اور 10 ہجری کے اہم واقعات", audioUrl: `${SEERAT_BASE}%2832%29%209%20aur%2010%20Hijri%20ke%20aham%20waqiyaat_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "17:09" },
      { id: "seerat-33", title: "Last Moments of Muhammad ﷺ", titleUr: "محمد ﷺ کی زندگی کے آخری لمحات", audioUrl: `${SEERAT_BASE}%2833%29%20Muhammad%20%28s%29%20ki%20zindagi%20ke%20akhri%20lamhaat_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "21:14" },
      { id: "seerat-34", title: "Introduction of Ahle Bayt", titleUr: "اہل بیت کا تعارف", audioUrl: `${SEERAT_BASE}%2834%29%20Ahle%20bayt%20ka%20taaruf%20_-_Seerat-un-Nabi_in_Urdu.mp3`, duration: "35:00" },
    ]
  },
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
];

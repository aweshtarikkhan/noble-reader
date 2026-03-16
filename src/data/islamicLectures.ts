// Islamic Lectures - Archive.org audio sources for in-app streaming
import { RIYAD_LECTURES } from "./riyadSaliheen";
import { QASAS_ANBIYA_LECTURES } from "./qasasAmbiyaAudio";
import { DAILY_NASEEHAH_LECTURES } from "./dailyNaseehah";

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
    id: "riyad-us-saliheen",
    title: "Riyad us-Saliheen (Urdu Audio)",
    titleUr: "ریاض الصالحین (اردو آڈیو)",
    speaker: "Imam Nawawi",
    speakerUr: "امام نووی",
    icon: "📖",
    description: "Complete Urdu audio book of Riyad us-Saliheen (Gardens of the Righteous) by Imam Nawawi - 173 chapters of Hadith collection",
    descriptionUr: "ریاض الصالحین (باغات صالحین) کا مکمل اردو آڈیو - امام نووی - 173 ابواب احادیث کا مجموعہ",
    lectures: RIYAD_LECTURES,
  },
  {
    id: "qasas-ul-anbiya",
    title: "Qasas ul Anbiya - Stories of the Prophets",
    titleUr: "قصص الانبیاء - انبیاء کے واقعات",
    speaker: "Islamic Audio Series",
    speakerUr: "اسلامی آڈیو سیریز",
    icon: "📗",
    description: "Complete Urdu audio series on the Stories of the Prophets - 32 chapters covering all prophets from Adam A.S to Eisa A.S",
    descriptionUr: "قصص الانبیاء مکمل اردو آڈیو - 32 ابواب حضرت آدم سے حضرت عیسیٰ علیہم السلام تک",
    lectures: QASAS_ANBIYA_LECTURES,
  },
];

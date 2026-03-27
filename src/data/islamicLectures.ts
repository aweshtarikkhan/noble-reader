// Islamic Lectures - Archive.org audio sources for in-app streaming
import { RIYAD_LECTURES } from "./riyadSaliheen";
import { MENK_PROPHETS_LECTURES, SAHABA_STORIES_LECTURES } from "./qasasAmbiyaAudio";
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



const PANJ_SURAH_BASE = "https://archive.org/download/PanjSurah_201808/Panj%20Surah/";
const TAFSEER_AK_BASE = "https://archive.org/download/tafseerayatulkursi/";

export const LECTURE_SERIES: LectureSeries[] = [
  {
    id: "panj-surah",
    title: "Panj Surah",
    titleUr: "پنج سورہ",
    speaker: "Hafiz Fahad Shah",
    speakerUr: "حافظ فہد شاہ",
    icon: "📖",
    description: "5 important Surahs - Yaseen, Rahman, Mulk, Muzammil, Mudassir",
    descriptionUr: "پانچ اہم سورتیں - یٰسین، الرحمٰن، الملک، المزمل، المدثر",
    lectures: [
      { id: "panj-1", title: "Surah Yaseen (سورة يس)", titleUr: "سورۃ یٰسین", audioUrl: `${PANJ_SURAH_BASE}01-Surah%20Yaseen.mp3`, duration: "22:30" },
      { id: "panj-2", title: "Surah Rahman (سورة الرحمن)", titleUr: "سورۃ الرحمٰن", audioUrl: `${PANJ_SURAH_BASE}02-Surah%20Rahman.mp3`, duration: "13:46" },
      { id: "panj-3", title: "Surah Mulk (سورة الملك)", titleUr: "سورۃ الملک", audioUrl: `${PANJ_SURAH_BASE}03-Surah%20Mulk.mp3`, duration: "10:18" },
      { id: "panj-4", title: "Surah Muzammil (سورة المزمل)", titleUr: "سورۃ المزمل", audioUrl: `${PANJ_SURAH_BASE}04-Surah%20Muzammil.mp3`, duration: "06:30" },
      { id: "panj-5", title: "Surah Mudassir (سورة المدثر)", titleUr: "سورۃ المدثر", audioUrl: `${PANJ_SURAH_BASE}05-Surah%20Mudassir.mp3`, duration: "08:19" },
    ],
  },
  {
    id: "ayatul-kursi",
    title: "Ayatul Kursi - Tafseer",
    titleUr: "آیت الکرسی - تفسیر",
    speaker: "Shaikh Abu Rizwan Mohammadi Salafi / Maulana Anwar",
    speakerUr: "شیخ ابو رضوان محمدی سلفی / مولانا انور",
    icon: "🛡️",
    description: "Ayatul Kursi English meaning by Maulana Anwar + Complete 40 Durooos Urdu Tafseer by Shaikh Abu Rizwan Mohammadi Salafi",
    descriptionUr: "آیت الکرسی انگریزی معانی مولانا انور + مکمل 40 دروس اردو تفسیر شیخ ابو رضوان محمدی سلفی",
    lectures: [
      { id: "ak-en", title: "Ayatul Kursi - English Meaning", titleUr: "آیت الکرسی - انگریزی معانی", audioUrl: "https://archive.org/download/20170527QuraanTafseerAyatulKursi/20170527_QuraanTafseerAyatulKursi.mp3", duration: "38:44" },
      { id: "ak-01", title: "Dars 01 - Ahmiyat wo Fazilat", titleUr: "درس 01 - اہمیت و فضیلت", audioUrl: `${TAFSEER_AK_BASE}Dars01%20Ayatul%20Kursi%20Ahmiyat%20wo%20Fazilat%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2019_05_2020.mp3` },
      { id: "ak-02", title: "Dars 02 - La ilaha illallah Maana Aur Mafhoom", titleUr: "درس 02 - لا الہ الا اللہ معنی اور مفہوم", audioUrl: `${TAFSEER_AK_BASE}Dars02%20La%20ilaha%20illallah%20Maana%20Aur%20Mafhoom%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullaah%2020_05_2020.mp3` },
      { id: "ak-03", title: "Dars 03 - La ilaha illallah K Taqazay", titleUr: "درس 03 - لا الہ الا اللہ کے تقاضے", audioUrl: `${TAFSEER_AK_BASE}Dars03%20La%20ilaha%20illallah%20K%20Taqazay%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2021_05_2020.mp3` },
      { id: "ak-04", title: "Dars 04 - La ilaha illallah Ki Sharah", titleUr: "درس 04 - لا الہ الا اللہ کی شرح", audioUrl: `${TAFSEER_AK_BASE}Dars04%20%20La%20ilaha%20illallah%20Ki%20Sharah%20By%20Shekh%20Abu%20Rizwan%20Mohammadi%2021_05_2020.mp3` },
      { id: "ak-05", title: "Dars 05 - Kalma Ki Pahli Shart Ilm", titleUr: "درس 05 - کلمہ کی پہلی شرط علم", audioUrl: `${TAFSEER_AK_BASE}Dars05%20Kalma%20Ki%20Pahli%20Shart%20ilm.mp3` },
      { id: "ak-06", title: "Dars 06 - Kalma Ki 2ri 3ri Aur 4thi Shart", titleUr: "درس 06 - کلمہ کی دوسری تیسری چوتھی شرط", audioUrl: `${TAFSEER_AK_BASE}Dars06%20Kalma%20Ki%202ri%203ri%20Aur%204thi%20Shart%20Shekh%20Abu%20Rizwan%20Mohammadi%2022_05_2020.mp3` },
      { id: "ak-07", title: "Dars 07 - Kalma Ki 5wi Shart Mohabbat", titleUr: "درس 07 - کلمہ کی پانچویں شرط محبت", audioUrl: `${TAFSEER_AK_BASE}Dars07%20%20Kalma%20Ki%205wi%20Shart%20Mohabbat%20Shekh%20Abu%20Rizwan%20Mohammadi%2022_05_2020.mp3` },
      { id: "ak-08", title: "Dars 08 - Kalma Ki 6,7,8 Shart", titleUr: "درس 08 - کلمہ کی چھٹی ساتویں آٹھویں شرط", audioUrl: `${TAFSEER_AK_BASE}Dars08%20%20Kalma%20Ki%206%2C7%2C8%20Shart%20Shaikh%20Abu%20Rizwan%20Mohammadi%20%2023_05_2020.mp3` },
      { id: "ak-09", title: "Dars 09 - Tauheed Ki Gawahi", titleUr: "درس 09 - توحید کی گواہی", audioUrl: `${TAFSEER_AK_BASE}Dars09%20Tauheed%20Ki%20Gawahi%20Shaikh%20Abu%20Rizwan%20Mohammadi%2023_05_2020.mp3` },
      { id: "ak-10", title: "Dars 10 - Al Hayy Ki Tafseer", titleUr: "درس 10 - الحی کی تفسیر", audioUrl: `${TAFSEER_AK_BASE}Dars10%20Al%20Hayy%20Ki%20Tafseer%20Shaikh%20Abu%20Rizwan%20Mohammadi%2024_05_2020.mp3` },
      { id: "ak-11", title: "Dars 11 - Al Qayyom Ki Tafseer", titleUr: "درس 11 - القیوم کی تفسیر", audioUrl: `${TAFSEER_AK_BASE}Dars11%20Al%20Qayyom%20Ki%20Tafseer%20Shaikh%20Abu%20Rizwan%20Mohammadi%20%2024_05_2020.mp3` },
      { id: "ak-12", title: "Dars 12 - Al Hayyul Qayyom Ki Tafseer", titleUr: "درس 12 - الحی القیوم کی تفسیر", audioUrl: `${TAFSEER_AK_BASE}Dars12%20Al%20Hayyul%20Qayyom%20Ki%20Tafseer%20Shaikh%20Abu%20Rizwan%20Mohammadi%2030_05_2020.mp3` },
      { id: "ak-13", title: "Dars 13 - Al Hayyul Qayyom k Zaria Dua Karna", titleUr: "درس 13 - الحی القیوم کے ذریعے دعا کرنا", audioUrl: `${TAFSEER_AK_BASE}Dars13%20Al%20Hayyul%20Qayyom%20k%20Zaria%20Dua%20Karna%20Shaikh%20Abu%20Rizwan%20Mohammadi%2030_05_2020.mp3` },
      { id: "ak-14", title: "Dars 14 - Allah Hi Malik e Haqiqi Hai", titleUr: "درس 14 - اللہ ہی مالک حقیقی ہے", audioUrl: `${TAFSEER_AK_BASE}Dars14%20Allah%20Hi%20Malik%20e%20Haqiqi%20Hai%20Shaikh%20Abu%20Rizwan%20Mohammadi%2001_06_2020.mp3` },
      { id: "ak-15", title: "Dars 15 - Shafa'at Ka Bayan", titleUr: "درس 15 - شفاعت کا بیان", audioUrl: `${TAFSEER_AK_BASE}Dars15%20Shafa%27at%20Ka%20Bayan%20Shaikh%20Abu%20Rizwan%20Mohammadi%2002_06_2020.mp3` },
      { id: "ak-16", title: "Dars 16 - Shafa'at Aur Sifaarshi", titleUr: "درس 16 - شفاعت اور سفارشی", audioUrl: `${TAFSEER_AK_BASE}Dars16%20Shafa%27at%20Aur%20Sifaarshi%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2009_06_2020.mp3` },
      { id: "ak-17", title: "Dars 17 - Shafa'at Ki Aqsaam", titleUr: "درس 17 - شفاعت کی اقسام", audioUrl: `${TAFSEER_AK_BASE}Dars17%20Shafa%27at%20Ki%20Aqsaam%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2010_06_2020.mp3` },
      { id: "ak-18", title: "Dars 18 - Shafat e Wajahat Mohabbat Aur Ijazat", titleUr: "درس 18 - شفاعت وجاہت محبت اور اجازت", audioUrl: `${TAFSEER_AK_BASE}Dars18%20Shafat%20e%20Wajahat%20Mohabbat%20Aur%20ijazat%20Shaikh%20Abu%20Rizwan%20Mohammadi%2013_06_2020.mp3` },
      { id: "ak-19", title: "Dars 19 - Lafz Wasila Ki Haqiqat", titleUr: "درس 19 - لفظ وسیلہ کی حقیقت", audioUrl: `${TAFSEER_AK_BASE}Dars19%20Lafz%20Wasila%20Ki%20Haqiqat%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2014_06_2020.mp3` },
      { id: "ak-20", title: "Dars 20 - Jayaz Wasile", titleUr: "درس 20 - جائز وسیلے", audioUrl: `${TAFSEER_AK_BASE}Dars20%20Jayaz%20Wasile%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2015_06_2020.mp3` },
      { id: "ak-21", title: "Dars 21 - Najayaz Wasilay", titleUr: "درس 21 - ناجائز وسیلے", audioUrl: `${TAFSEER_AK_BASE}Dars21%20Najayaz%20Wasilay%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2017_06_2020.mp3` },
      { id: "ak-22", title: "Dars 22 - Nabi K Wastay Say Dua Karna", titleUr: "درس 22 - نبی کے واسطے سے دعا کرنا", audioUrl: `${TAFSEER_AK_BASE}Dars22%20Nabi%20K%20Wastay%20say%20Dua%20Karna%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2021_06_2020.mp3` },
      { id: "ak-23", title: "Dars 23 - Bidati Waselo K Dalael Ka Jayeza", titleUr: "درس 23 - بدعتی وسیلوں کے دلائل کا جائزہ", audioUrl: `${TAFSEER_AK_BASE}Dars23%20Bidati%20Waselo%20k%20Dalael%20Ka%20Jayeza%20Shaikh%20Abu%20Rizwan%20Mohammadi%2022_06_2020.mp3` },
      { id: "ak-24", title: "Dars 24 - Allah Ki Sifat e Ilm", titleUr: "درس 24 - اللہ کی صفت علم", audioUrl: `${TAFSEER_AK_BASE}Dars24%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Sifat%20e%20ilm_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2023_06_2020.mp3` },
      { id: "ak-25", title: "Dars 25 - Allah Ki Sifat e Ilm Ki Wus'at", titleUr: "درس 25 - اللہ کی صفت علم کی وسعت", audioUrl: `${TAFSEER_AK_BASE}Dars25%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Sifat%20e%20ilm%20ki%20Wus%27at_%20Shaikh%20Abu%20Rizwan%20Mohammadi%2024%2006%202020.mp3` },
      { id: "ak-26", title: "Dars 26 - Allah Ki Sifat Aleem Ki Tafseer", titleUr: "درس 26 - اللہ کی صفت علیم کی تفسیر", audioUrl: `${TAFSEER_AK_BASE}Dars26%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Sifat%20_Aleem_%20Ki%20Tafseer_%20Shaikh%20Abu%20Rizwan%20Mohammdi%2025_06_2020.mp3` },
      { id: "ak-27", title: "Dars 27 - Allah Ki Sifat e Ilm K Fawaed", titleUr: "درس 27 - اللہ کی صفت علم کے فوائد", audioUrl: `${TAFSEER_AK_BASE}Dars27%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Sifat%20e%20ilm%20K%20Fawaed_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2028_06_2020.mp3` },
      { id: "ak-28", title: "Dars 28 - Allah Ki Mashi'at Aur Kursi", titleUr: "درس 28 - اللہ کی مشیت اور کرسی", audioUrl: `${TAFSEER_AK_BASE}Dars28%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Mashi%27at%20Aur%20Kursi_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2028_06_2020.mp3` },
      { id: "ak-29", title: "Dars 29 - Asman Wo Zamin Ki Hefazt", titleUr: "درس 29 - آسمان و زمین کی حفاظت", audioUrl: `${TAFSEER_AK_BASE}Dars29%20%28Tafseer%20Ayatul%20Kursi%29%20_Asman%20Wo%20Zamin%20Ki%20Hefazt%20Se%20Allah%20Thakta%20Nahi_%20Shaikh%20Abu%20Rizwan%2029_06_2020.mp3` },
      { id: "ak-30", title: "Dars 30 - Allah Ki Sifat Al Aliyy", titleUr: "درس 30 - اللہ کی صفت العلی", audioUrl: `${TAFSEER_AK_BASE}Dars30%20%28Tsfseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Sifat%20Al%20Aliyy_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2030_06_2020.mp3` },
      { id: "ak-31", title: "Dars 31 - Allah K Buland Hone K Dalael", titleUr: "درس 31 - اللہ کے بلند ہونے کے دلائل", audioUrl: `${TAFSEER_AK_BASE}Dars31%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20K%20Buland%20Hone%20K%20Dalael_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2030_06_2020.mp3` },
      { id: "ak-32", title: "Dars 32 - Allah Sab Se Buland Hai", titleUr: "درس 32 - اللہ سب سے بلند ہے", audioUrl: `${TAFSEER_AK_BASE}Dars32%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Sab%20Se%20Buland%20Hai_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2004_07_2020.mp3` },
      { id: "ak-33", title: "Dars 33 - Har Tarah Se Allah Buland Hai", titleUr: "درس 33 - ہر طرح سے اللہ بلند ہے", audioUrl: `${TAFSEER_AK_BASE}dars33%20%28Tafseer%20Ayatul%20Kursi%29%20_Har%20Tarah%20Se%20Allah%20Buland%20Hai_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2005_07_2020.mp3` },
      { id: "ak-34", title: "Dars 34 - Allah Ki Maiyyat Ka Ma'na", titleUr: "درس 34 - اللہ کی معیت کا معنی", audioUrl: `${TAFSEER_AK_BASE}Dars34%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Maiyyat%20Ka%20Ma%27na_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2005_07_2020.mp3` },
      { id: "ak-35", title: "Dars 35 - Wahdatul Ujod Aur Hulol K Aqide Ka Rad", titleUr: "درس 35 - وحدۃ الوجود اور حلول کے عقیدے کا رد", audioUrl: `${TAFSEER_AK_BASE}Dars35%20%28Tafseer%20Ayatul%20Kursi%29%20_Wahdatul%20Ujod%20Aur%20Hulol%20k%20Aqide%20ka%20Rad_Shaikh%20Abu%20Rizwan%20Mohammadi06_07_2020.mp3` },
      { id: "ak-36", title: "Dars 36 - Allah Ki Azmat", titleUr: "درس 36 - اللہ کی عظمت", audioUrl: `${TAFSEER_AK_BASE}Dars36%20%28Tafseer%20Ayatul%20Kursi%29%20_Allah%20Ki%20Azmat_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2007_07_2020.mp3` },
      { id: "ak-37", title: "Dars 37 - Ta'zeem K Taqaze", titleUr: "درس 37 - تعظیم کے تقاضے", audioUrl: `${TAFSEER_AK_BASE}Dars37%20%28Tafseer%20Ayatul%20Kursi%29%20_Ta%27zeem%20K%20Taqaze_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2007_07_2020.mp3` },
      { id: "ak-38", title: "Dars 38 - Ta'zeem Sirf Allah K Liye", titleUr: "درس 38 - تعظیم صرف اللہ کے لیے", audioUrl: `${TAFSEER_AK_BASE}Dars38%20%28Tafseer%20Ayayul%20Kursi%29%20_Ta%27zeem%20Sirf%20Allah%20K%20Liye_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2008_07_2020.mp3` },
      { id: "ak-39", title: "Dars 39 - Ta'zeem K Asraat", titleUr: "درس 39 - تعظیم کے اثرات", audioUrl: `${TAFSEER_AK_BASE}Dars39%20%28Tafseer%20Ayatul%20Kursi%29%20_Ta%27zeem%20K%20Asraat_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2009_07_2020.mp3` },
      { id: "ak-40", title: "Dars 40 - Ayatul Kursi Ka Haasil", titleUr: "درس 40 - آیت الکرسی کا حاصل", audioUrl: `${TAFSEER_AK_BASE}Dars40%20%28Tafseer%20Ayatul%20Kursi%29%20_Ayatul%20Kursi%20Ka%20Haasil_%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%2009_07_2020.mp3` },
    ],
  },
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
  {
    id: "daily-naseehah",
    title: "Daily Naseehah - Seerah & Islamic Guidance",
    titleUr: "روزانہ نصیحہ - سیرت و اسلامی رہنمائی",
    speaker: "Mufti AK Hoosen (Compiled by Ahmed Dockrat & Ahmed Muhammad)",
    speakerUr: "مفتی اے کے حسین (مرتب: احمد ڈاکرٹ و احمد محمد)",
    icon: "🎙️",
    description: "194 short Islamic talks covering Seerah, Sahaba biographies, Islamic etiquettes and daily guidance by Mufti AK Hoosen",
    descriptionUr: "194 مختصر اسلامی بیانات - سیرت، صحابہ کی سوانح حیات، اسلامی آداب اور روزانہ رہنمائی - مفتی اے کے حسین",
    lectures: DAILY_NASEEHAH_LECTURES,
  },
];

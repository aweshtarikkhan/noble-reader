// Free Quran reciters available via cdn.islamic.network
// Audio URL format: https://cdn.islamic.network/quran/audio/128/{id}/{globalAyahNumber}.mp3

export interface QuranReciter {
  id: string;
  name: string;
  nameAr: string;
  style: string;
}

export const QURAN_RECITERS: QuranReciter[] = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", nameAr: "مشاري راشد العفاسي", style: "Murattal" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais", nameAr: "عبدالرحمن السديس", style: "Murattal" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)", nameAr: "عبدالباسط عبدالصمد", style: "Murattal" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify", nameAr: "علي الحذيفي", style: "Murattal" },
  { id: "ar.minshawi", name: "Mohamed Al-Minshawi", nameAr: "محمد صديق المنشاوي", style: "Murattal" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", nameAr: "محمود خليل الحصري", style: "Murattal" },
  { id: "ar.maaboraheem", name: "Ibrahim Al-Akhdar", nameAr: "إبراهيم الأخضر", style: "Murattal" },
  { id: "ar.parhizgar", name: "Shahriar Parhizgar", nameAr: "شهریار پرهیزگار", style: "Murattal" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub", nameAr: "محمد أيوب", style: "Murattal" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel", nameAr: "محمد جبريل", style: "Murattal" },
];

export function getAyahAudioUrl(reciterId: string, globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
}

export const DEFAULT_RECITER = "ar.alafasy";

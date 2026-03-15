import React, { useState } from "react";
import { Search, Star, BookOpen, Mic, GraduationCap, ExternalLink, Copy } from "lucide-react";
import { ALLAH_NAMES } from "@/data/allahNames";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const SEERAT_LINKS = [
  { title: "Birth & Early Life", titleUr: "ولادت اور ابتدائی زندگی", url: "https://seerahfoundation.com", icon: "🌙" },
  { title: "Prophethood & Revelation", titleUr: "نبوت اور وحی", url: "https://www.islamicstudies.info/seerah/", icon: "📜" },
  { title: "Migration to Madinah", titleUr: "مدینہ ہجرت", url: "https://sunnah.com", icon: "🕌" },
  { title: "Battles & Conquests", titleUr: "غزوات اور فتوحات", url: "https://www.islamicstudies.info/seerah/", icon: "⚔️" },
  { title: "Character & Teachings", titleUr: "اخلاق اور تعلیمات", url: "https://sunnah.com", icon: "💎" },
  { title: "Last Sermon & Passing", titleUr: "آخری خطبہ اور وصال", url: "https://sunnah.com", icon: "🤲" },
];

const BOOK_LINKS = [
  { title: "Riyad as-Salihin", titleUr: "ریاض الصالحین", url: "https://sunnah.com/riyadussalihin", icon: "📗" },
  { title: "Fortress of the Muslim", titleUr: "حصن المسلم", url: "https://www.hisnulmuslim.com/", icon: "🛡️" },
  { title: "Tafsir Ibn Kathir", titleUr: "تفسیر ابن کثیر", url: "https://www.alim.org/quran/tafsir/ibn-kathir/", icon: "📖" },
  { title: "Fiqh us-Sunnah", titleUr: "فقہ السنہ", url: "https://archive.org/search?query=fiqh+us+sunnah", icon: "📚" },
  { title: "Stories of the Prophets", titleUr: "قصص الانبیاء", url: "https://archive.org/search?query=stories+of+prophets+ibn+kathir", icon: "📕" },
  { title: "Sahih al-Bukhari (Full)", titleUr: "صحیح بخاری (مکمل)", url: "https://sunnah.com/bukhari", icon: "📘" },
];

const LECTURE_LINKS = [
  { title: "Dr. Israr Ahmad", titleUr: "ڈاکٹر اسرار احمد", url: "https://www.youtube.com/@DrIsrarAhmed", icon: "🎙️", desc: "Bayan ul Quran & Islamic lectures" },
  { title: "Mufti Menk", titleUr: "مفتی منک", url: "https://www.youtube.com/@muaborhein", icon: "🎤", desc: "Daily reminders & motivational talks" },
  { title: "Nouman Ali Khan", titleUr: "نعمان علی خان", url: "https://www.youtube.com/@baaborhein", icon: "🎧", desc: "Quran & Arabic linguistic analysis" },
  { title: "Tariq Jameel", titleUr: "طارق جمیل", url: "https://www.youtube.com/@TariqJameel", icon: "🎙️", desc: "Emotional bayans & Islamic guidance" },
  { title: "Islamic Lectures (Archive.org)", titleUr: "اسلامی لیکچرز", url: "https://archive.org/details/islamic_lectures", icon: "📻", desc: "Free audio library of Islamic lectures" },
  { title: "Quran Weekly", titleUr: "قرآن ویکلی", url: "https://www.youtube.com/@QuranWeekly", icon: "📺", desc: "Short weekly Quran reflections" },
];

const IslamicKnowledge: React.FC = () => {
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const isUrdu = lang === "ur";
  const [nameSearch, setNameSearch] = useState("");

  const filteredNames = ALLAH_NAMES.filter((n) => {
    if (!nameSearch) return true;
    const s = nameSearch.toLowerCase();
    return n.arabic.includes(nameSearch) || n.transliteration.toLowerCase().includes(s) || n.english.toLowerCase().includes(s) || n.urdu.includes(nameSearch) || String(n.number).includes(s);
  });

  const copyName = (n: typeof ALLAH_NAMES[0]) => {
    navigator.clipboard.writeText(`${n.arabic}\n${n.transliteration} — ${n.english}\n${n.urdu}`);
    toast({ title: "📋", description: `${n.transliteration} copied` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3" style={{ top: "calc(56px + env(safe-area-inset-top, 20px))" }}>
        <h1 className="text-lg font-bold text-foreground">{t("page.islamicKnowledge")}</h1>
      </div>

      <div className="px-4 py-4 space-y-8">
        {/* 99 Names of Allah */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t("knowledge.99names")}</h2>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} placeholder={isUrdu ? "نام تلاش کریں..." : "Search names..."} className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">{filteredNames.length} {isUrdu ? "نام" : "names"}</p>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNames.map((n) => (
              <div key={n.number} className="rounded-xl bg-card border border-border px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-smooth" onClick={() => copyName(n)}>
                <span className="text-[10px] font-bold text-primary bg-primary/10 w-7 h-7 flex items-center justify-center rounded-lg shrink-0">{n.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic text-lg text-foreground text-right leading-relaxed" dir="rtl">{n.arabic}</p>
                  <p className="text-xs font-semibold text-primary">{n.transliteration}</p>
                  <p className="text-xs text-muted-foreground">{n.english}</p>
                  <p className="text-xs text-muted-foreground text-right font-urdu" dir="rtl">{n.urdu}</p>
                </div>
                <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Seerat un Nabi */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t("knowledge.seerat")}</h2>
          </div>
          <div className="space-y-2">
            {SEERAT_LINKS.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-smooth">
                <span className="text-xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{isUrdu ? link.titleUr : link.title}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* Islamic Books */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t("knowledge.books")}</h2>
          </div>
          <div className="space-y-2">
            {BOOK_LINKS.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-smooth">
                <span className="text-xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{isUrdu ? link.titleUr : link.title}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* Lectures / Audio */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Mic className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t("knowledge.lectures")}</h2>
          </div>
          <div className="space-y-2">
            {LECTURE_LINKS.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-smooth">
                <span className="text-xl">{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{isUrdu ? link.titleUr : link.title}</p>
                  <p className="text-[10px] text-muted-foreground">{link.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default IslamicKnowledge;

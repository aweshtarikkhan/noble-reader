import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import SurahList from "@/pages/SurahList";
import SurahRead from "@/pages/SurahRead";
import Mushaf from "@/pages/Mushaf";
import ParaList from "@/pages/ParaList";
import ParaRead from "@/pages/ParaRead";
import Translation from "@/pages/Translation";
import TafseerReader from "@/pages/TafseerReader";
import TafseerRead from "@/pages/TafseerRead";
import ReadQuran from "@/pages/ReadQuran";
import QuranAudio from "@/pages/QuranAudio";
import IslamicCalendar from "@/pages/IslamicCalendar";
import Bookmarks from "@/pages/Bookmarks";
import Duas from "@/pages/Duas";
import IndianMushaf from "@/pages/IndianMushaf";
import PrayerTimes from "@/pages/PrayerTimes";
import AzaanSettings from "@/pages/AzaanSettings";
import Donate from "@/pages/Donate";
import QiblaDirection from "@/pages/QiblaDirection";
import Hadith from "@/pages/Hadith";
import SahihMuslim from "@/pages/SahihMuslim";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useAutoDownload } from "@/hooks/useAutoDownload";
import { LocationProvider } from "@/hooks/useSharedLocation";
import { I18nProvider } from "@/lib/i18n";

const queryClient = new QueryClient();

const AppContent = () => {
  useLocationPermission();
  useAutoDownload();

  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/surah" element={<SurahList />} />
        <Route path="/surah-read/:num" element={<SurahRead />} />
        <Route path="/mushaf" element={<Mushaf />} />
        <Route path="/mushaf/:page" element={<Mushaf />} />
        <Route path="/para" element={<ParaList />} />
        <Route path="/para-read/:num" element={<ParaRead />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/tafseer-reader" element={<TafseerReader />} />
        <Route path="/tafseer-read/:num" element={<TafseerRead />} />
        <Route path="/read-quran" element={<ReadQuran />} />
        <Route path="/quran-audio" element={<QuranAudio />} />
        <Route path="/islamic-calendar" element={<IslamicCalendar />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/duas" element={<Duas />} />
        <Route path="/indian-mushaf" element={<IndianMushaf />} />
        <Route path="/indian-mushaf/:page" element={<IndianMushaf />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/azaan-settings" element={<AzaanSettings />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/qibla" element={<QiblaDirection />} />
        <Route path="/hadith" element={<Hadith />} />
        <Route path="/sahih-muslim" element={<SahihMuslim />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <LocationProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <AppContent />
          </HashRouter>
        </LocationProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

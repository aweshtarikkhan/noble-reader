import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
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
import IndianMushaf from "@/pages/IndianMushaf";
import PrayerTimes from "@/pages/PrayerTimes";
import AzaanSettings from "@/pages/AzaanSettings";
import Donate from "@/pages/Donate";
import NotFound from "@/pages/NotFound";
import { useLocationPermission } from "@/hooks/useLocationPermission";

const queryClient = new QueryClient();

const AppContent = () => {
  // Request location permission on first launch
  useLocationPermission();

  return (
    <Layout>
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
        <Route path="/indian-mushaf" element={<IndianMushaf />} />
        <Route path="/indian-mushaf/:page" element={<IndianMushaf />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/azaan-settings" element={<AzaanSettings />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface InAppPdfViewerProps {
  pdfBase64: string;
  title?: string;
  onShare?: () => void;
  onClose?: () => void;
}

const InAppPdfViewer: React.FC<InAppPdfViewerProps> = ({ pdfBase64, title, onShare, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [baseScale, setBaseScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const renderTaskRef = useRef<any>(null);

  // Pinch zoom
  const lastDistRef = useRef<number | null>(null);
  const pinchBaseScale = useRef<number>(1.5);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 8; // ~500%+ relative to fit

  useEffect(() => {
    if (!pdfBase64) return;
    setLoading(true);
    setError("");

    const byteChars = atob(pdfBase64);
    const byteArray = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteArray[i] = byteChars.charCodeAt(i);
    }

    const loadingTask = pdfjsLib.getDocument({ data: byteArray });
    loadingTask.promise
      .then((doc) => {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("PDF load error:", err);
        setError("Failed to load PDF");
        setLoading(false);
      });

    return () => { loadingTask.destroy(); };
  }, [pdfBase64]);

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
      }
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      renderTaskRef.current = page.render({ canvasContext: ctx, viewport });
      await renderTaskRef.current.promise;
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException") console.error("Render error:", err);
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => { renderPage(); }, [renderPage]);

  // Auto-fit on load
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;
    pdfDoc.getPage(1).then((page) => {
      const cw = containerRef.current?.clientWidth || 360;
      const viewport = page.getViewport({ scale: 1 });
      const fitScale = (cw - 8) / viewport.width;
      const s = Math.max(0.8, Math.min(fitScale, 3));
      setScale(s);
      setBaseScale(s);
    });
  }, [pdfDoc]);

  // Touch pinch zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDistRef.current = Math.hypot(dx, dy);
      pinchBaseScale.current = scale;
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistRef.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastDistRef.current;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchBaseScale.current * ratio));
      setScale(newScale);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastDistRef.current = null;
  }, []);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + 0.4));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, s - 0.4));

  const zoomPercent = Math.round((scale / baseScale) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RotateCw className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading PDF...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-destructive">{error}</div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-1 min-w-0">
          {onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
          <span className="text-xs font-medium truncate max-w-[140px]">{title || "PDF"}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {onShare && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Zoom + Page controls */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevPage} disabled={currentPage <= 1}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] font-medium min-w-[44px] text-center">
            {currentPage}/{totalPages}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextPage} disabled={currentPage >= totalPages}>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <div className="w-16 mx-1">
            <Slider
              value={[scale]}
              min={MIN_SCALE}
              max={MAX_SCALE}
              step={0.1}
              onValueChange={([v]) => setScale(v)}
              className="h-4"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[10px] text-muted-foreground min-w-[32px] text-right">{zoomPercent}%</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/20 flex justify-center p-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="shadow-md" style={{ touchAction: "pan-x pan-y" }} />
      </div>
    </div>
  );
};

export default InAppPdfViewer;

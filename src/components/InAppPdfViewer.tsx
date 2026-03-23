import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface InAppPdfViewerProps {
  pdfBase64: string;
  title?: string;
  onShare?: () => void;
  onClose?: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

const InAppPdfViewer: React.FC<InAppPdfViewerProps> = ({ pdfBase64, title, onShare, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const renderTaskRef = useRef<any>(null);

  // Render scale (for canvas resolution) - stays fixed at fit-width
  const [renderScale, setRenderScale] = useState(1.5);
  // Visual zoom via CSS transform
  const [visualZoom, setVisualZoom] = useState(1);

  // Pinch zoom refs
  const lastDistRef = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  // Load PDF
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

  // Render page at fixed renderScale (only changes on page change or initial load)
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
      }
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: renderScale });
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
  }, [pdfDoc, currentPage, renderScale]);

  useEffect(() => { renderPage(); }, [renderPage]);

  // Auto-fit on load: set renderScale to fill container width with good resolution
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;
    pdfDoc.getPage(1).then((page) => {
      const cw = containerRef.current?.clientWidth || 360;
      const viewport = page.getViewport({ scale: 1 });
      // Render at 2x device pixels for crisp text
      const dpr = window.devicePixelRatio || 1;
      const fitScale = ((cw - 4) / viewport.width) * Math.min(dpr, 2);
      setRenderScale(Math.max(1, fitScale));
    });
  }, [pdfDoc]);

  // Pinch-to-zoom via CSS transform (instant, no re-render)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDistRef.current = Math.hypot(dx, dy);
      pinchStartZoom.current = visualZoom;
    }
  }, [visualZoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistRef.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastDistRef.current;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartZoom.current * ratio));
      setVisualZoom(newZoom);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastDistRef.current = null;
  }, []);

  // Double-tap to toggle zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.preventDefault();
      setVisualZoom(z => z > 1.5 ? 1 : 3);
    }
    lastTapRef.current = now;
  }, []);

  const prevPage = () => { setCurrentPage((p) => Math.max(1, p - 1)); setVisualZoom(1); };
  const nextPage = () => { setCurrentPage((p) => Math.min(totalPages, p + 1)); setVisualZoom(1); };
  const zoomIn = () => setVisualZoom((z) => Math.min(MAX_ZOOM, z + 0.5));
  const zoomOut = () => setVisualZoom((z) => Math.max(MIN_ZOOM, z - 0.5));

  const zoomPercent = Math.round(visualZoom * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <RotateCw className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading PDF...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-destructive bg-background">{error}</div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {onClose && (
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
          <span className="text-sm font-semibold truncate max-w-[180px]">{title || "PDF"}</span>
        </div>
        <div className="flex items-center gap-1">
          {onShare && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30 shrink-0">
        {/* Page nav */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevPage} disabled={currentPage <= 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium min-w-[48px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextPage} disabled={currentPage >= totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} disabled={visualZoom <= MIN_ZOOM}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-bold text-primary min-w-[40px] text-center">{zoomPercent}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} disabled={visualZoom >= MAX_ZOOM}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas with CSS transform zoom */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/10"
        style={{ touchAction: visualZoom > 1 ? "pan-x pan-y" : "manipulation" }}
        onTouchStart={(e) => { handleTouchStart(e); handleDoubleTap(e); }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex justify-center p-1 origin-top-left"
          style={{
            transform: `scale(${visualZoom})`,
            transformOrigin: "top center",
            width: visualZoom > 1 ? `${100 * visualZoom}%` : "100%",
          }}
        >
          <canvas ref={canvasRef} className="shadow-md max-w-full" />
        </div>
      </div>
    </div>
  );
};

export default InAppPdfViewer;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";

// Use CDN worker to avoid bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface InAppPdfViewerProps {
  pdfBase64: string;
  title?: string;
}

const InAppPdfViewer: React.FC<InAppPdfViewerProps> = ({ pdfBase64, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const renderTaskRef = useRef<any>(null);

  // Load PDF document
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

    return () => {
      loadingTask.destroy();
    };
  }, [pdfBase64]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      // Cancel any ongoing render
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

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
    } catch (err: any) {
      if (err?.name !== "RenderingCancelledException") {
        console.error("Page render error:", err);
      }
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Auto-fit scale on first load
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;
    pdfDoc.getPage(1).then((page) => {
      const containerWidth = containerRef.current?.clientWidth || 360;
      const viewport = page.getViewport({ scale: 1 });
      const fitScale = (containerWidth - 16) / viewport.width;
      setScale(Math.max(1, Math.min(fitScale, 3)));
    });
  }, [pdfDoc]);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(4, s + 0.3));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.3));

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
      <div className="flex items-center justify-center h-full text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevPage} disabled={currentPage <= 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextPage} disabled={currentPage >= totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs min-w-[40px] text-center">{Math.round(scale * 100 / 1.5 * 100) / 100}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-muted/30 flex justify-center p-2">
        <canvas ref={canvasRef} className="shadow-md" />
      </div>
    </div>
  );
};

export default InAppPdfViewer;

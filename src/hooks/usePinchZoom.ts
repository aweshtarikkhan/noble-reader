import { useState, useRef, useCallback } from "react";

export function usePinchZoom(initialZoom = 1, minZoom = 1, maxZoom = 4) {
  const [zoom, setZoom] = useState(initialZoom);
  const lastDistance = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDistance.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistance.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / lastDistance.current;
      setZoom((z) => Math.min(maxZoom, Math.max(minZoom, z * scale)));
      lastDistance.current = dist;
    }
  }, [minZoom, maxZoom]);

  const onTouchEnd = useCallback(() => {
    lastDistance.current = null;
  }, []);

  return { zoom, setZoom, onTouchStart, onTouchMove, onTouchEnd };
}

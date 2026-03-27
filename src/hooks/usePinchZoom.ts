import { useState, useRef, useCallback } from "react";

export function usePinchZoom(initialZoom = 1, minZoom = 1, maxZoom = 5) {
  const [zoom, setZoom] = useState(initialZoom);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const lastDistance = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDistance.current = Math.hypot(dx, dy);

      // Calculate midpoint relative to the target element
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const pctX = ((midX - rect.left) / rect.width) * 100;
      const pctY = ((midY - rect.top) / rect.height) * 100;
      setOrigin({ x: Math.max(0, Math.min(100, pctX)), y: Math.max(0, Math.min(100, pctY)) });
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

      // Update origin as fingers move
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const pctX = ((midX - rect.left) / rect.width) * 100;
      const pctY = ((midY - rect.top) / rect.height) * 100;
      setOrigin({ x: Math.max(0, Math.min(100, pctX)), y: Math.max(0, Math.min(100, pctY)) });
    }
  }, [minZoom, maxZoom]);

  const onTouchEnd = useCallback(() => {
    lastDistance.current = null;
  }, []);

  return { zoom, setZoom, origin, onTouchStart, onTouchMove, onTouchEnd };
}

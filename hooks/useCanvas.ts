'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { CanvasTransform, Tool } from '@/lib/types';

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.15;

export function useCanvas() {
  const [transform, setTransform] = useState<CanvasTransform>({ x: 0, y: 0, scale: 1 });
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  // Center canvas origin on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTransform({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 1,
      });
    }
  }, []);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  /** Zoom centered on a point in screen-space */
  const zoomAt = useCallback((screenX: number, screenY: number, delta: number) => {
    setTransform((prev) => {
      const newScale = clampScale(prev.scale + delta);
      const ratio = newScale / prev.scale;
      // Keep the point under the cursor fixed
      const newX = screenX - (screenX - prev.x) * ratio;
      const newY = screenY - (screenY - prev.y) * ratio;
      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  /** Toolbar zoom (centered on viewport) */
  const zoomIn = useCallback(() => {
    const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
    zoomAt(cx, cy, ZOOM_STEP);
  }, [zoomAt]);

  const zoomOut = useCallback(() => {
    const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
    zoomAt(cx, cy, -ZOOM_STEP);
  }, [zoomAt]);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  /** Convert screen coords to canvas coords */
  const screenToCanvas = useCallback(
    (sx: number, sy: number) => ({
      x: (sx - transform.x) / transform.scale,
      y: (sy - transform.y) / transform.scale,
    }),
    [transform]
  );

  /** Handle wheel zoom */
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      zoomAt(e.clientX, e.clientY, delta);
    },
    [zoomAt]
  );

  /** Pan start */
  const onPanStart = useCallback(
    (e: React.MouseEvent) => {
      // Middle-click or pan tool with left-click
      if (e.button === 1 || (activeTool === 'pan' && e.button === 0)) {
        e.preventDefault();
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
      }
    },
    [activeTool, transform.x, transform.y]
  );

  const onPanMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning || !panStart.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setTransform((prev) => ({
        ...prev,
        x: panStart.current!.tx + dx,
        y: panStart.current!.ty + dy,
      }));
    },
    [isPanning]
  );

  const onPanEnd = useCallback(() => {
    setIsPanning(false);
    panStart.current = null;
  }, []);

  /** Prevent default middle-click behavior */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.button === 1) e.preventDefault();
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  return {
    transform,
    activeTool,
    setActiveTool,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    screenToCanvas,
    onWheel,
    onPanStart,
    onPanMove,
    onPanEnd,
  };
}

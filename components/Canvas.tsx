'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import EmptyState from './EmptyState';
import AppNode from './AppNode';
import type { CanvasNode, CanvasTransform, Tool } from '@/lib/types';

type CanvasProps = {
  transform: CanvasTransform;
  activeTool: Tool;
  isPanning: boolean;
  isMounted: boolean;
  nodes: CanvasNode[];
  onWheel: (e: React.WheelEvent) => void;
  onPanStart: (e: React.MouseEvent) => void;
  onPanMove: (e: React.MouseEvent) => void;
  onPanEnd: () => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onRemoveNode: (id: string) => void;
  onStartCreating: () => void;
};

export default function Canvas({
  transform,
  activeTool,
  isPanning,
  isMounted,
  nodes,
  onWheel,
  onPanStart,
  onPanMove,
  onPanEnd,
  onMoveNode,
  onRemoveNode,
  onStartCreating,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  /** Mouse-follow glow effect */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      onPanMove(e);

      // Update background dot-grid parallax
      const x = (e.clientX / window.innerWidth) * 2;
      const y = (e.clientY / window.innerHeight) * 2;
      if (canvasRef.current) {
        canvasRef.current.style.backgroundPosition = `${x}px ${y}px`;
      }

      // Subtle mouse glow
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.left = `${e.clientX}px`;
        mouseGlowRef.current.style.top = `${e.clientY}px`;
      }
    },
    [onPanMove]
  );

  const cursorClass =
    activeTool === 'pan'
      ? isPanning
        ? 'cursor-grabbing'
        : 'cursor-grab'
      : 'cursor-default';

  // Prevent default wheel behavior for zoom
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const hasConnectedApps = nodes.some((node) => node.type === 'social-connector');

  return (
    <main
      ref={canvasRef}
      className={`relative h-screen w-screen overflow-hidden select-none canvas-bg ${cursorClass}`}
      onWheel={onWheel}
      onMouseDown={onPanStart}
      onMouseMove={handleMouseMove}
      onMouseUp={onPanEnd}
      onMouseLeave={onPanEnd}
    >
      {/* Mouse follow glow */}
      <div
        ref={mouseGlowRef}
        className="pointer-events-none fixed w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[80px] z-0 transition-none"
        style={{ left: '50%', top: '50%' }}
      />

      {/* Canvas transform layer */}
      <div
        className="absolute inset-0 origin-top-left transition-opacity duration-300"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          opacity: isMounted ? 1 : 0,
        }}
      >
        <svg className="absolute inset-0 pointer-events-none overflow-visible z-0" style={{ transform: 'translate(0, 0)' }}>
          <defs>
            <filter id="neon-glow" filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {nodes
            .filter((node) => node.type === 'social-connector')
            .map((node) => {
              const startX = 0;
              const startY = 0;
              const endX = node.position.x;
              const endY = node.position.y;

              // Compute control points for smooth S-curve Bezier path
              const ctrlX1 = startX + (endX - startX) * 0.25;
              const ctrlY1 = startY + (endY - startY) * 0.75;
              const ctrlX2 = startX + (endX - startX) * 0.75;
              const ctrlY2 = startY + (endY - startY) * 0.25;
              const pathD = `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`;

              return (
                <g key={`link-${node.id}`}>
                  {/* Outer neon glow line using solid color to bypass bounding-box unit rendering bug */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#adc6ff"
                    strokeWidth="2"
                    filter="url(#neon-glow)"
                    opacity="0.6"
                  />
                  {/* Inner dashed detail */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#d0bcff"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                  {/* Moving pulse dot indicating active workflow connection */}
                  <circle r="4" fill="#adc6ff" className="drop-shadow-[0_0_6px_#adc6ff]">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path={pathD} />
                  </circle>
                </g>
              );
            })}
        </svg>

        {/* Centerpiece Empty State at origin (0, 0) */}
        <div
          className="absolute pointer-events-auto z-10"
          style={{
            left: 0,
            top: 0,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <EmptyState onStartCreating={onStartCreating} showText={!hasConnectedApps} />
        </div>
        {/* Background centerpiece glow */}
        <div
          className="absolute w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"
          style={{
            left: 0,
            top: 0,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Connected Social connector App Nodes */}
        {nodes
          .filter((node) => node.type === 'social-connector')
          .map((node) => (
            <AppNode
              key={node.id}
              node={node}
              canvasScale={transform.scale}
              onMove={onMoveNode}
              onRemove={onRemoveNode}
            />
          ))}
      </div>

      {/* Scale indicator */}
      <div className="fixed bottom-8 right-8 z-40 text-on-surface-variant/40 font-label text-[11px] tracking-[0.1em] uppercase select-none max-md:bottom-20 max-md:right-4">
        {Math.round(transform.scale * 100)}%
      </div>
    </main>
  );
}

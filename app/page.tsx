'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import SideToolbar from '@/components/SideToolbar';
import Canvas from '@/components/Canvas';
import ChatBar from '@/components/ChatBar';
import HistoryPanel from '@/components/HistoryPanel';
import TemplatesPanel from '@/components/TemplatesPanel';
import AddAssetsPanel from '@/components/AddAssetsPanel';
import AIResponsePanel from '@/components/AIResponsePanel';
import { useCanvas } from '@/hooks/useCanvas';
import { useChat } from '@/hooks/useChat';
import type { SocialPlatform } from '@/lib/types';

export default function HomePage() {
  const canvas = useCanvas();
  const chat = useChat();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  /** Focus the chat input */
  const focusChatInput = useCallback(() => {
    const fn = (window as unknown as Record<string, unknown>).__Connector_focus_chat;
    if (typeof fn === 'function') (fn as () => void)();
  }, []);

  /** Open the Add Assets panel */
  const handleStartCreating = useCallback(() => {
    setAssetsOpen(true);
  }, []);

  /** Connect a social platform */
  const handleConnectPlatform = useCallback(
    (platform: SocialPlatform) => {
      setConnectedPlatforms((prev) => [...prev, platform.id]);

      // Calculate radial position around centerpiece (0, 0)
      const socialNodesCount = chat.nodes.filter((n) => n.type === 'social-connector').length;
      const angle = (socialNodesCount * 45) * (Math.PI / 180);
      const radius = 300;
      const posX = Math.round(radius * Math.cos(angle));
      const posY = Math.round(radius * Math.sin(angle));

      // Add the social-connector node to the canvas
      chat.addSocialNode(platform, { x: posX, y: posY });

      // Trigger the AI streaming response
      const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
      const canvasPos = canvas.screenToCanvas(cx, cy);
      chat.sendMessage(`Connect ${platform.name} — ${platform.description}`, canvasPos);
    },
    [canvas, chat]
  );

  /** Disconnect platform node and remove it from connected list */
  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      const node = chat.nodes.find((n) => n.id === nodeId);
      if (node && node.type === 'social-connector' && node.platform) {
        const platformId = node.platform.id;
        setConnectedPlatforms((prev) => prev.filter((id) => id !== platformId));
      }
      chat.removeNode(nodeId);
    },
    [chat]
  );

  /** Send message — place node at canvas center */
  const handleSend = useCallback(
    (prompt: string) => {
      const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
      const canvasPos = canvas.screenToCanvas(cx, cy);
      chat.sendMessage(prompt, canvasPos);
    },
    [canvas, chat]
  );

  /** Resend from history */
  const handleResend = useCallback(
    (prompt: string) => {
      handleSend(prompt);
    },
    [handleSend]
  );

  /** Template select → send immediately */
  const handleTemplateSelect = useCallback(
    (prompt: string) => {
      handleSend(prompt);
    },
    [handleSend]
  );

  return (
    <>
      <Header />

      <SideToolbar
        activeTool={canvas.activeTool}
        onToolChange={canvas.setActiveTool}
        onZoomIn={canvas.zoomIn}
        onZoomOut={canvas.zoomOut}
        onReset={canvas.resetView}
      />

      <Canvas
        transform={canvas.transform}
        activeTool={canvas.activeTool}
        isPanning={canvas.isPanning}
        nodes={chat.nodes}
        onWheel={canvas.onWheel}
        onPanStart={canvas.onPanStart}
        onPanMove={canvas.onPanMove}
        onPanEnd={canvas.onPanEnd}
        onMoveNode={chat.moveNode}
        onRemoveNode={handleRemoveNode}
        onStartCreating={handleStartCreating}
      />

      <ChatBar
        onSend={handleSend}
        onHistoryToggle={() => setHistoryOpen(!historyOpen)}
        onTemplatesToggle={() => setTemplatesOpen(!templatesOpen)}
        isStreaming={chat.isStreaming}
      />

      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        messages={chat.messages}
        onResend={handleResend}
      />

      <TemplatesPanel
        isOpen={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onSelect={handleTemplateSelect}
      />

      <AddAssetsPanel
        isOpen={assetsOpen}
        onClose={() => setAssetsOpen(false)}
        onSelectPlatform={handleConnectPlatform}
        connectedIds={connectedPlatforms}
      />

      <AIResponsePanel
        nodes={chat.nodes}
        onRemoveNode={chat.removeNode}
        isStreaming={chat.isStreaming}
      />
    </>
  );
}

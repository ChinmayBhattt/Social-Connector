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
import ConnectedAppsBar from '@/components/ConnectedAppsBar';
import ConnectionFlowModal from '@/components/ConnectionFlowModal';
import { useCanvas } from '@/hooks/useCanvas';
import { useChat } from '@/hooks/useChat';
import { useConnections } from '@/hooks/useConnections';
import { SOCIAL_PLATFORMS } from '@/lib/platforms';
import type { SocialPlatform } from '@/lib/types';

export default function HomePage() {
  const canvas = useCanvas();
  const chat = useChat();
  const {
    connections,
    connectedPlatformIds,
    getConnection,
    connectPlatform,
    disconnectPlatform,
    connectWithApiKey,
  } = useConnections();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);

  // Connection flow modal state
  const [modalPlatform, setModalPlatform] = useState<SocialPlatform | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /** Focus the chat input */
  const focusChatInput = useCallback(() => {
    const fn = (window as unknown as Record<string, unknown>).__Connector_focus_chat;
    if (typeof fn === 'function') (fn as () => void)();
  }, []);

  /** Open the Add Assets panel */
  const handleStartCreating = useCallback(() => {
    setAssetsOpen(true);
  }, []);

  /** Trigger node generation and AI notification once connected */
  const addPlatformNodeAndNotify = useCallback(
    (platform: SocialPlatform) => {
      // Calculate radial position around centerpiece (0, 0)
      const socialNodesCount = chat.nodes.filter((n) => n.type === 'social-connector').length;
      const angle = (socialNodesCount * 45) * (Math.PI / 180);
      const radius = 300;
      const posX = Math.round(radius * Math.cos(angle));
      const posY = Math.round(radius * Math.sin(angle));

      // Add the social-connector node to the canvas
      chat.addSocialNode(platform, { x: posX, y: posY });

      // Trigger the AI streaming response with new platform included in the context
      const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
      const canvasPos = canvas.screenToCanvas(cx, cy);
      
      const newConnectedIds = Array.from(new Set([...connectedPlatformIds, platform.id]));
      chat.sendMessage(`Connect ${platform.name} — ${platform.description}`, canvasPos, newConnectedIds);
    },
    [canvas, chat, connectedPlatformIds]
  );

  /** Open connection flow modal when clicking asset */
  const handleSelectPlatform = useCallback(
    (platform: SocialPlatform) => {
      setModalPlatform(platform);
      setModalOpen(true);
      setAssetsOpen(false);
    },
    []
  );

  /** Initiate OAuth / general connection simulation */
  const handleConnect = useCallback(
    async (platformId: string) => {
      const conn = await connectPlatform(platformId);
      if (conn.status === 'connected') {
        const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
        if (platform) {
          addPlatformNodeAndNotify(platform);
        }
      }
    },
    [connectPlatform, addPlatformNodeAndNotify]
  );

  /** Initiate API Key validation simulation */
  const handleConnectWithKey = useCallback(
    async (platformId: string, key: string) => {
      const conn = await connectWithApiKey(platformId, key);
      if (conn.status === 'connected') {
        const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
        if (platform) {
          addPlatformNodeAndNotify(platform);
        }
      }
    },
    [connectWithApiKey, addPlatformNodeAndNotify]
  );

  /** Disconnect platform and remove node */
  const handleDisconnect = useCallback(
    (platformId: string) => {
      disconnectPlatform(platformId);
      // Remove corresponding canvas node
      const node = chat.nodes.find(
        (n) => n.type === 'social-connector' && n.platform?.id === platformId
      );
      if (node) {
        chat.removeNode(node.id);
      }
    },
    [chat, disconnectPlatform]
  );

  /** Disconnect platform node and remove it from connected list */
  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      const node = chat.nodes.find((n) => n.id === nodeId);
      if (node && node.type === 'social-connector' && node.platform) {
        disconnectPlatform(node.platform.id);
      }
      chat.removeNode(nodeId);
    },
    [chat, disconnectPlatform]
  );

  /** Send message — place node at canvas center, forwarding active platforms to Gemini */
  const handleSend = useCallback(
    (prompt: string) => {
      const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
      const canvasPos = canvas.screenToCanvas(cx, cy);
      chat.sendMessage(prompt, canvasPos, connectedPlatformIds);
    },
    [canvas, chat, connectedPlatformIds]
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

  // Retrieve current modal connection status properties
  const modalConnection = modalPlatform ? getConnection(modalPlatform.id) : undefined;
  const connectionStatus = modalConnection?.status ?? 'disconnected';
  const connectedAs = modalConnection?.connectedAs;
  const maskedCredential = modalConnection?.maskedCredential;
  const errorMessage = modalConnection?.errorMessage;

  return (
    <>
      <Header />

      <ConnectedAppsBar
        connections={connections}
        onDisconnect={handleDisconnect}
      />

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
        isMounted={canvas.isMounted}
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
        onSelectPlatform={handleSelectPlatform}
        connectedIds={connectedPlatformIds}
      />

      <AIResponsePanel
        nodes={chat.nodes}
        onRemoveNode={chat.removeNode}
        isStreaming={chat.isStreaming}
      />

      <ConnectionFlowModal
        isOpen={modalOpen}
        platform={modalPlatform}
        onClose={() => setModalOpen(false)}
        onConnect={handleConnect}
        onConnectWithKey={handleConnectWithKey}
        connectionStatus={connectionStatus}
        connectedAs={connectedAs}
        maskedCredential={maskedCredential}
        errorMessage={errorMessage}
      />
    </>
  );
}


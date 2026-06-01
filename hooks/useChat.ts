'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { CanvasNode, Message, SocialPlatform } from '@/lib/types';
import { pickResponse } from '@/lib/mock-responses';

let nodeIdCounter = 0;
let msgIdCounter = 0;

function uid(prefix: string) {
  return `${prefix}-${++nodeIdCounter}-${Date.now()}`;
}

function msgId() {
  return `msg-${++msgIdCounter}-${Date.now()}`;
}

export function useChat() {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);



  /** Send a message and create a streaming AI node */
  const sendMessage = useCallback(
    (prompt: string, canvasCenter: { x: number; y: number }) => {
      if (!prompt.trim() || isStreaming) return;

      // Add user message to history
      const userMsg: Message = {
        id: msgId(),
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      };

      const fullResponse = pickResponse(prompt);
      const nodeId = uid('node');

      // Offset each new node slightly so they don't stack
      const offset = nodes.length * 30;

      const newNode: CanvasNode = {
        id: nodeId,
        type: 'ai-response',
        position: {
          x: canvasCenter.x - 200 + offset,
          y: canvasCenter.y - 150 + offset,
        },
        prompt,
        response: '',
        isStreaming: true,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setNodes((prev) => [...prev, newNode]);
      setIsStreaming(true);

      // Stream response character by character
      let charIndex = 0;
      streamTimerRef.current = setInterval(() => {
        charIndex += 3; // 3 chars at a time for faster streaming
        if (charIndex >= fullResponse.length) {
          charIndex = fullResponse.length;
          if (streamTimerRef.current) clearInterval(streamTimerRef.current);

          // Finalize node + add assistant message
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nodeId ? { ...n, response: fullResponse, isStreaming: false } : n
            )
          );
          setMessages((prev) => [
            ...prev,
            {
              id: msgId(),
              role: 'assistant',
              content: fullResponse,
              timestamp: new Date(),
            },
          ]);
          setIsStreaming(false);
        } else {
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nodeId
                ? { ...n, response: fullResponse.slice(0, charIndex) }
                : n
            )
          );
        }
      }, 12);
    },
    [isStreaming, nodes.length]
  );

  /** Move a node to a new position */
  const moveNode = useCallback((nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, position: { x, y } } : n))
    );
  }, []);

  /** Remove a node */
  const removeNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
  }, []);

  /** Re-send a historical prompt */
  const resendPrompt = useCallback(
    (prompt: string, canvasCenter: { x: number; y: number }) => {
      sendMessage(prompt, canvasCenter);
    },
    [sendMessage]
  );

  /** Add a social connector node to the canvas */
  const addSocialNode = useCallback((platform: SocialPlatform, position: { x: number; y: number }) => {
    const nodeId = uid('social');
    const newNode: CanvasNode = {
      id: nodeId,
      type: 'social-connector',
      position,
      prompt: `Connect ${platform.name}`,
      response: '',
      isStreaming: false,
      createdAt: new Date(),
      platform,
    };
    setNodes((prev) => [...prev, newNode]);
    return nodeId;
  }, []);

  return {
    nodes,
    messages,
    isStreaming,
    sendMessage,
    addSocialNode,
    moveNode,
    removeNode,
    resendPrompt,
  };
}

'use client';

import { useState, useCallback, useRef } from 'react';
import type { CanvasNode, Message, SocialPlatform, StructuredAIResponse } from '@/lib/types';

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
    (prompt: string, canvasCenter: { x: number; y: number }, connectedPlatformIds?: string[]) => {
      if (!prompt.trim() || isStreaming) return;

      // Add user message to history
      const userMsg: Message = {
        id: msgId(),
        role: 'user',
        content: prompt,
        timestamp: new Date(),
      };

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

      // Call Next.js API route to talk to Gemini
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          connectedPlatforms: connectedPlatformIds ?? [],
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to generate content from Gemini API');
          }
          return res.json();
        })
        .then((data) => {
          const fullResponse = data.text || '';
          const structured: StructuredAIResponse | null = data.structured || null;

          // Stream response character by character
          let charIndex = 0;
          streamTimerRef.current = setInterval(() => {
            charIndex += 4; // 4 chars at a time for fast response rendering
            if (charIndex >= fullResponse.length) {
              charIndex = fullResponse.length;
              if (streamTimerRef.current) clearInterval(streamTimerRef.current);

              setNodes((prev) =>
                prev.map((n) =>
                  n.id === nodeId
                    ? { ...n, response: fullResponse, isStreaming: false, structuredResponse: structured ?? undefined }
                    : n
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
          }, 8);
        })
        .catch((err) => {
          console.error('Gemini error:', err);
          const errorMsg = `Error: ${err.message || 'Failed to connect to Gemini API. Please make sure your GEMINI_API_KEY is correct.'}`;
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nodeId ? { ...n, response: errorMsg, isStreaming: false } : n
            )
          );
          setIsStreaming(false);
        });
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

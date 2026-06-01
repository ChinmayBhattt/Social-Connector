export type CanvasNode = {
  id: string;
  type: 'ai-response' | 'social-connector';
  position: { x: number; y: number };
  prompt: string;
  response: string;
  isStreaming: boolean;
  createdAt: Date;
  platform?: SocialPlatform;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type Tool = 'select' | 'pan' | 'zoom-in' | 'zoom-out';

export type CanvasTransform = {
  x: number;
  y: number;
  scale: number;
};

export type SocialPlatform = {
  id: string;
  name: string;
  label: string;
  icon: string; // SVG path or component identifier
  color: string; // Brand color
  bgColor: string; // Card background accent
  category: 'social' | 'video' | 'messaging' | 'professional' | 'creative' | 'music' | 'news' | 'commerce';
  description: string;
  connected?: boolean;
};

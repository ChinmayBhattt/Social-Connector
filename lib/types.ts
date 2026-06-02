/* ===== Auth & Connection Types ===== */

export type AuthType = 'oauth2' | 'api-key' | 'webhook' | 'credentials';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'verifying' | 'connected' | 'error' | 'expired';

export type PlatformConnection = {
  platformId: string;
  status: ConnectionStatus;
  connectedAt?: string;       // ISO string for localStorage serialization
  connectedAs?: string;       // "@username" or "email@..."
  maskedCredential?: string;  // "sk_live_••••••xK3p"
  errorMessage?: string;
  authType: AuthType;
};

export type PlatformAuth = {
  platformId: string;
  authType: AuthType;
  scopes?: string[];
  scopeDescriptions?: Record<string, string>;
  connectionSteps: string[];
  verifyEndpoint?: string;
  verifySuccessFormat?: string; // e.g. "Connected as @{username}"
  keyPrefix?: string;          // API key prefix e.g. "sk_live_"
  keyInstructions?: string;    // Where to get the API key
};

/* ===== Structured AI Response Types ===== */

export type PlatformContent = {
  platformId: string;
  platformName: string;
  content: string;
  hashtags?: string[];
  caption?: string;
  title?: string;
  description?: string;
  tags?: string[];
  cta?: string;
  charLimit?: number;
  charCount?: number;
};

export type PlatformAction = {
  type: string;
  platformId: string;
  label: string;
  params: Record<string, any>;
};

export type StructuredAIResponse = {
  platforms: PlatformContent[];
  actions?: PlatformAction[];
  summary: string;
};

/* ===== Canvas & Node Types ===== */

export type CanvasNode = {
  id: string;
  type: 'ai-response' | 'social-connector';
  position: { x: number; y: number };
  prompt: string;
  response: string;
  isStreaming: boolean;
  createdAt: Date;
  platform?: SocialPlatform;
  structuredResponse?: StructuredAIResponse;
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
  icon: string;
  color: string;
  bgColor: string;
  category: 'social' | 'video' | 'messaging' | 'professional' | 'creative' | 'music' | 'news' | 'commerce' | 'productivity';
  description: string;
  connected?: boolean;
};

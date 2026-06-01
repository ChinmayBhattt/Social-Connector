import type { PlatformAuth } from './types';

/**
 * Auth metadata for all supported platforms.
 * Maps each platform ID to its auth type, required scopes,
 * human-readable scope descriptions, and connection steps.
 */
export const PLATFORM_AUTH: Record<string, PlatformAuth> = {
  /* ========== OAUTH2 PLATFORMS ========== */

  'x-platform': {
    platformId: 'x-platform',
    authType: 'oauth2',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    scopeDescriptions: {
      'tweet.read': 'Read your tweets and timeline',
      'tweet.write': 'Post tweets on your behalf',
      'users.read': 'Read your profile info',
      'offline.access': 'Stay connected (refresh tokens)',
    },
    connectionSteps: [
      'You will be redirected to X\'s official login page',
      'Log in with your X account',
      'Review the permissions and click "Authorize"',
      'You will be brought back here — connected and ready',
    ],
    verifyEndpoint: 'GET /2/users/me',
    verifySuccessFormat: 'Connected as @{username}',
  },

  instagram: {
    platformId: 'instagram',
    authType: 'oauth2',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    scopeDescriptions: {
      'instagram_basic': 'Access your Instagram profile info',
      'instagram_content_publish': 'Publish photos and reels on your behalf',
      'pages_read_engagement': 'Read engagement metrics on your posts',
    },
    connectionSteps: [
      'You will be redirected to Instagram\'s login page',
      'Log in with your Instagram account',
      'Approve the requested permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /me?fields=id,name',
    verifySuccessFormat: 'Connected as {name}',
  },

  facebook: {
    platformId: 'facebook',
    authType: 'oauth2',
    scopes: ['pages_read_engagement', 'pages_manage_posts', 'public_profile'],
    scopeDescriptions: {
      'pages_read_engagement': 'Read engagement on your pages',
      'pages_manage_posts': 'Post to your Facebook Pages',
      'public_profile': 'Access your public profile info',
    },
    connectionSteps: [
      'You will be redirected to Facebook login',
      'Log in and select the Pages you want to manage',
      'Approve the requested permissions',
      'You will be brought back — connected',
    ],
    verifyEndpoint: 'GET /me',
    verifySuccessFormat: 'Connected as {name}',
  },

  linkedin: {
    platformId: 'linkedin',
    authType: 'oauth2',
    scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
    scopeDescriptions: {
      'r_liteprofile': 'Read your professional profile',
      'r_emailaddress': 'Read your email address',
      'w_member_social': 'Post content on your behalf',
    },
    connectionSteps: [
      'You will be redirected to LinkedIn',
      'Log in with your LinkedIn credentials',
      'Approve professional profile access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v2/me',
    verifySuccessFormat: 'Connected as {firstName} {lastName}',
  },

  discord: {
    platformId: 'discord',
    authType: 'oauth2',
    scopes: ['bot', 'messages.send', 'messages.read'],
    scopeDescriptions: {
      'bot': 'Add bot to your server',
      'messages.send': 'Send messages in channels',
      'messages.read': 'Read message history',
    },
    connectionSteps: [
      'You will be redirected to Discord',
      'Select the server to add the bot to',
      'Approve the bot permissions',
      'Bot will be active in your server immediately',
    ],
    verifyEndpoint: 'GET /api/users/@me',
    verifySuccessFormat: 'Bot active in {server}',
  },

  slack: {
    platformId: 'slack',
    authType: 'oauth2',
    scopes: ['chat:write', 'channels:read', 'users:read'],
    scopeDescriptions: {
      'chat:write': 'Send messages in Slack channels',
      'channels:read': 'View channel list and info',
      'users:read': 'View workspace members',
    },
    connectionSteps: [
      'You will be redirected to Slack',
      'Select your workspace',
      'Approve the requested channel access',
      'You will be brought back — connected',
    ],
    verifyEndpoint: 'POST /api/auth.test',
    verifySuccessFormat: 'Connected to {workspace}',
  },

  youtube: {
    platformId: 'youtube',
    authType: 'oauth2',
    scopes: ['youtube.upload', 'youtube.readonly'],
    scopeDescriptions: {
      'youtube.upload': 'Upload videos to your channel',
      'youtube.readonly': 'Read your channel info and analytics',
    },
    connectionSteps: [
      'You will be redirected to Google/YouTube',
      'Log in with your Google account',
      'Approve YouTube channel access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /youtube/v3/channels?mine=true',
    verifySuccessFormat: 'Connected to {channelTitle}',
  },

  tiktok: {
    platformId: 'tiktok',
    authType: 'oauth2',
    scopes: ['user.info.basic', 'video.upload', 'video.publish'],
    scopeDescriptions: {
      'user.info.basic': 'Read your TikTok profile',
      'video.upload': 'Upload video content',
      'video.publish': 'Publish videos to your account',
    },
    connectionSteps: [
      'You will be redirected to TikTok',
      'Log in with your TikTok account',
      'Approve video publishing permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /user/info',
    verifySuccessFormat: 'Connected as @{username}',
  },

  twitch: {
    platformId: 'twitch',
    authType: 'oauth2',
    scopes: ['channel:manage:broadcast', 'chat:edit', 'chat:read'],
    scopeDescriptions: {
      'channel:manage:broadcast': 'Manage your stream settings',
      'chat:edit': 'Send messages in chat',
      'chat:read': 'Read chat messages',
    },
    connectionSteps: [
      'You will be redirected to Twitch',
      'Log in with your Twitch account',
      'Approve the broadcast permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /helix/users',
    verifySuccessFormat: 'Connected as {display_name}',
  },

  github: {
    platformId: 'github',
    authType: 'oauth2',
    scopes: ['repo', 'read:user', 'write:discussion'],
    scopeDescriptions: {
      'repo': 'Access your repositories',
      'read:user': 'Read your profile info',
      'write:discussion': 'Post discussions and comments',
    },
    connectionSteps: [
      'You will be redirected to GitHub',
      'Log in with your GitHub account',
      'Approve repository access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /user',
    verifySuccessFormat: 'Connected as @{login}',
  },

  spotify: {
    platformId: 'spotify',
    authType: 'oauth2',
    scopes: ['user-read-private', 'playlist-modify-public', 'user-library-read'],
    scopeDescriptions: {
      'user-read-private': 'Read your Spotify profile',
      'playlist-modify-public': 'Create and manage playlists',
      'user-library-read': 'Read your saved tracks',
    },
    connectionSteps: [
      'You will be redirected to Spotify',
      'Log in with your Spotify account',
      'Approve playlist and profile access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v1/me',
    verifySuccessFormat: 'Connected as {display_name}',
  },

  reddit: {
    platformId: 'reddit',
    authType: 'oauth2',
    scopes: ['identity', 'submit', 'read'],
    scopeDescriptions: {
      'identity': 'Read your Reddit profile',
      'submit': 'Submit posts and comments',
      'read': 'Read content from subreddits',
    },
    connectionSteps: [
      'You will be redirected to Reddit',
      'Log in with your Reddit account',
      'Approve posting permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /api/v1/me',
    verifySuccessFormat: 'Connected as u/{name}',
  },

  threads: {
    platformId: 'threads',
    authType: 'oauth2',
    scopes: ['threads_basic', 'threads_content_publish'],
    scopeDescriptions: {
      'threads_basic': 'Read your Threads profile',
      'threads_content_publish': 'Post text content on Threads',
    },
    connectionSteps: [
      'You will be redirected to Threads/Instagram',
      'Log in with your account',
      'Approve content publishing access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /me',
    verifySuccessFormat: 'Connected as @{username}',
  },

  bluesky: {
    platformId: 'bluesky',
    authType: 'oauth2',
    scopes: ['atproto', 'transition:generic'],
    scopeDescriptions: {
      'atproto': 'Access your Bluesky account via AT Protocol',
      'transition:generic': 'Post and read content',
    },
    connectionSteps: [
      'You will be redirected to Bluesky',
      'Log in with your Bluesky handle',
      'Approve posting permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /xrpc/app.bsky.actor.getProfile',
    verifySuccessFormat: 'Connected as @{handle}',
  },

  mastodon: {
    platformId: 'mastodon',
    authType: 'oauth2',
    scopes: ['read', 'write', 'follow'],
    scopeDescriptions: {
      'read': 'Read your timeline and profile',
      'write': 'Post toots on your behalf',
      'follow': 'Manage your follow list',
    },
    connectionSteps: [
      'Enter your Mastodon instance URL',
      'You will be redirected to your instance',
      'Log in and approve permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /api/v1/accounts/verify_credentials',
    verifySuccessFormat: 'Connected as @{username}',
  },

  snapchat: {
    platformId: 'snapchat',
    authType: 'oauth2',
    scopes: ['snapchat-marketing-api', 'snapchat-profile-api'],
    scopeDescriptions: {
      'snapchat-marketing-api': 'Manage your Snap Ads',
      'snapchat-profile-api': 'Read your Snapchat profile',
    },
    connectionSteps: [
      'You will be redirected to Snapchat',
      'Log in with your Snapchat account',
      'Approve the marketing permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v1/me',
    verifySuccessFormat: 'Connected as {display_name}',
  },

  pinterest: {
    platformId: 'pinterest',
    authType: 'oauth2',
    scopes: ['boards:read', 'pins:read', 'pins:write'],
    scopeDescriptions: {
      'boards:read': 'View your Pinterest boards',
      'pins:read': 'View your pins',
      'pins:write': 'Create and manage pins',
    },
    connectionSteps: [
      'You will be redirected to Pinterest',
      'Log in with your Pinterest account',
      'Approve board and pin access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v5/user_account',
    verifySuccessFormat: 'Connected as {username}',
  },

  telegram: {
    platformId: 'telegram',
    authType: 'api-key',
    keyPrefix: 'bot',
    keyInstructions: 'Message @BotFather on Telegram → /newbot → Copy the bot token',
    connectionSteps: [
      'Open Telegram and message @BotFather',
      'Send /newbot and follow the steps to create a bot',
      'Copy the bot token BotFather gives you',
      'Paste the token here',
    ],
    verifyEndpoint: 'GET /bot{token}/getMe',
    verifySuccessFormat: 'Bot connected: @{botUsername}',
  },

  whatsapp: {
    platformId: 'whatsapp',
    authType: 'api-key',
    keyPrefix: 'whatsapp_',
    keyInstructions: 'Go to Meta Business Suite → WhatsApp → API Setup → Copy the access token',
    connectionSteps: [
      'Go to developers.facebook.com',
      'Open your WhatsApp Business app',
      'Navigate to API Setup',
      'Copy the temporary or permanent access token',
      'Paste it here',
    ],
    verifyEndpoint: 'GET /v18.0/me',
    verifySuccessFormat: 'Connected to WhatsApp Business',
  },

  /* ========== API KEY PLATFORMS ========== */

  stripe: {
    platformId: 'stripe',
    authType: 'api-key',
    keyPrefix: 'sk_',
    keyInstructions: 'Go to dashboard.stripe.com → Developers → API Keys → Copy Secret key',
    connectionSteps: [
      'Go to dashboard.stripe.com',
      'Navigate to Developers → API Keys',
      'Copy your Secret key (starts with sk_live_ or sk_test_)',
      'Paste it here — we store it encrypted',
    ],
    verifyEndpoint: 'GET /v1/account',
    verifySuccessFormat: 'Connected to Stripe: {business_name}',
  },

  shopify: {
    platformId: 'shopify',
    authType: 'api-key',
    keyPrefix: 'shpat_',
    keyInstructions: 'Shopify Admin → Settings → Apps → Develop apps → Copy Admin API access token',
    connectionSteps: [
      'Go to your Shopify Admin',
      'Settings → Apps → Develop apps',
      'Create an app → Configure Admin API scopes',
      'Install the app → Copy the Admin API access token',
      'Paste it here',
    ],
    verifyEndpoint: 'GET /admin/api/2024-01/shop.json',
    verifySuccessFormat: 'Connected to {shop_name}',
  },

  medium: {
    platformId: 'medium',
    authType: 'oauth2',
    scopes: ['basicProfile', 'publishPost'],
    scopeDescriptions: {
      'basicProfile': 'Read your Medium profile',
      'publishPost': 'Publish articles on your behalf',
    },
    connectionSteps: [
      'You will be redirected to Medium',
      'Log in with your Medium account',
      'Approve publishing permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v1/me',
    verifySuccessFormat: 'Connected as {name}',
  },

  substack: {
    platformId: 'substack',
    authType: 'api-key',
    keyPrefix: 'substack_',
    keyInstructions: 'Go to your Substack Settings → API → Generate API key',
    connectionSteps: [
      'Go to your Substack publication settings',
      'Navigate to the API section',
      'Generate a new API key',
      'Copy and paste it here',
    ],
    verifyEndpoint: 'GET /api/v1/publication',
    verifySuccessFormat: 'Connected to {publication_name}',
  },

  figma: {
    platformId: 'figma',
    authType: 'api-key',
    keyPrefix: 'figd_',
    keyInstructions: 'Figma → Settings → Personal access tokens → Generate new token',
    connectionSteps: [
      'Open Figma and go to Account Settings',
      'Scroll to "Personal access tokens"',
      'Click "Generate new token"',
      'Copy the token and paste it here',
    ],
    verifyEndpoint: 'GET /v1/me',
    verifySuccessFormat: 'Connected as {handle}',
  },

  /* ========== REMAINING OAUTH2 PLATFORMS ========== */

  dribbble: {
    platformId: 'dribbble',
    authType: 'oauth2',
    scopes: ['public', 'upload'],
    scopeDescriptions: {
      'public': 'View your public profile and shots',
      'upload': 'Upload design shots',
    },
    connectionSteps: [
      'You will be redirected to Dribbble',
      'Log in with your Dribbble account',
      'Approve design upload permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v2/user',
    verifySuccessFormat: 'Connected as {name}',
  },

  behance: {
    platformId: 'behance',
    authType: 'oauth2',
    scopes: ['activity_read', 'project_read', 'project_write'],
    scopeDescriptions: {
      'activity_read': 'View your Behance activity',
      'project_read': 'View your projects',
      'project_write': 'Manage your portfolio projects',
    },
    connectionSteps: [
      'You will be redirected to Behance/Adobe',
      'Log in with your Adobe account',
      'Approve portfolio access',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /v2/users/me',
    verifySuccessFormat: 'Connected as {display_name}',
  },

  vimeo: {
    platformId: 'vimeo',
    authType: 'oauth2',
    scopes: ['public', 'private', 'upload'],
    scopeDescriptions: {
      'public': 'View your public videos',
      'private': 'Access private video settings',
      'upload': 'Upload videos to your account',
    },
    connectionSteps: [
      'You will be redirected to Vimeo',
      'Log in with your Vimeo account',
      'Approve video upload permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /me',
    verifySuccessFormat: 'Connected as {name}',
  },

  soundcloud: {
    platformId: 'soundcloud',
    authType: 'oauth2',
    scopes: ['non-expiring', 'activity-read', 'activity-write'],
    scopeDescriptions: {
      'non-expiring': 'Persistent connection access',
      'activity-read': 'Read your audio activity',
      'activity-write': 'Upload and manage audio content',
    },
    connectionSteps: [
      'You will be redirected to SoundCloud',
      'Log in with your SoundCloud account',
      'Approve audio upload permissions',
      'You will be redirected back — connected',
    ],
    verifyEndpoint: 'GET /me',
    verifySuccessFormat: 'Connected as {username}',
  },
};

/**
 * Get the auth configuration for a platform.
 * Falls back to a generic OAuth2 config if not explicitly defined.
 */
export function getPlatformAuth(platformId: string): PlatformAuth {
  return PLATFORM_AUTH[platformId] ?? {
    platformId,
    authType: 'oauth2',
    scopes: ['read', 'write'],
    scopeDescriptions: {
      'read': 'Read your profile and content',
      'write': 'Post content on your behalf',
    },
    connectionSteps: [
      'You will be redirected to the platform\'s login page',
      'Log in with your account',
      'Approve the requested permissions',
      'You will be redirected back — connected',
    ],
    verifySuccessFormat: 'Connected successfully',
  };
}

/**
 * Simulated connected identity for demo purposes.
 * In production, this would come from the real OAuth verification.
 */
const SIMULATED_IDENTITIES: Record<string, string> = {
  'x-platform': '@connector_user',
  'instagram': '@connector.studio',
  'facebook': 'Connector Studio',
  'linkedin': 'Connector Professional',
  'discord': 'Connector Bot #8472',
  'slack': 'Connector Workspace',
  'youtube': 'Connector Channel',
  'tiktok': '@connector.creator',
  'twitch': 'ConnectorLive',
  'github': '@connector-dev',
  'spotify': 'Connector Music',
  'reddit': 'u/connector_bot',
  'threads': '@connector.threads',
  'bluesky': '@connector.bsky.social',
  'mastodon': '@connector@mastodon.social',
  'snapchat': 'connector_snap',
  'pinterest': 'ConnectorPins',
  'telegram': '@ConnectorBot',
  'whatsapp': 'WhatsApp Business',
  'stripe': 'Connector Payments Inc.',
  'shopify': 'Connector Store',
  'medium': '@connector-writer',
  'substack': 'The Connector Newsletter',
  'figma': 'connector-design',
  'dribbble': 'ConnectorDesign',
  'behance': 'Connector Creative',
  'vimeo': 'Connector Films',
  'soundcloud': 'connector-audio',
};

export function getSimulatedIdentity(platformId: string): string {
  return SIMULATED_IDENTITIES[platformId] ?? 'Connected User';
}

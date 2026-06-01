import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const platform = searchParams.get('platform');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${appUrl}/api/auth/callback`;

  if (!platform) {
    return Response.json({ error: 'Missing platform parameter' }, { status: 400 });
  }

  // Construct target OAuth URLs based on platform
  let authUrl = '';

  switch (platform) {
    case 'github': {
      const clientId = process.env.GITHUB_CLIENT_ID;
      if (!clientId) return Response.json({ error: 'GITHUB_CLIENT_ID is not configured in .env' }, { status: 500 });
      
      authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=github&scope=read:user%20repo`;
      break;
    }

    case 'linkedin': {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      if (!clientId) return Response.json({ error: 'LINKEDIN_CLIENT_ID is not configured in .env' }, { status: 500 });
      
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=linkedin&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
      break;
    }

    case 'x-platform': {
      const clientId = process.env.TWITTER_CLIENT_ID;
      if (!clientId) return Response.json({ error: 'TWITTER_CLIENT_ID is not configured in .env' }, { status: 500 });

      // Twitter OAuth 2.0 requires state, code challenge for PKCE
      // For local development simplicity we use plain method
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=x-platform&scope=tweet.read%20tweet.write%20users.read%20offline.access&code_challenge=challenge&code_challenge_method=plain`;
      break;
    }

    case 'instagram': {
      const clientId = process.env.INSTAGRAM_CLIENT_ID;
      if (!clientId) return Response.json({ error: 'INSTAGRAM_CLIENT_ID is not configured in .env' }, { status: 500 });

      authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=instagram_graph_user_profile,instagram_graph_user_media&response_type=code&state=instagram`;
      break;
    }

    default:
      return Response.json({ error: `Platform ${platform} is not supported for real OAuth2 flow` }, { status: 400 });
  }

  // Redirect to official provider login page
  redirect(authUrl);
}

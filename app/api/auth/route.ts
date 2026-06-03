import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const platform = searchParams.get('platform');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${appUrl}/api/auth/callback`;

  // HTML page that closes itself and sends the error to the opener
  const sendAuthErrorHTML = (errorMessage: string) => {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Configuration Error</title>
          <style>
            body {
              background-color: #0b0b0b;
              color: #e5e2e1;
              font-family: 'Inter', system-ui, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .error-icon {
              color: #ffb4ab;
              font-size: 48px;
              margin-bottom: 15px;
            }
            h1 {
              font-size: 20px;
              margin: 10px 0;
              font-weight: 600;
            }
            p {
              font-size: 13px;
              color: #c2c6d6;
              max-width: 320px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="error-icon">✗</div>
          <h1>Configuration Error</h1>
          <p>${errorMessage}</p>
          <p style="opacity: 0.5; font-size: 11px;">You can close this window now.</p>
          <script>
            try {
              window.opener.postMessage({
                type: 'OAUTH_RESULT',
                payload: {
                  success: false,
                  platformId: ${JSON.stringify(platform)},
                  error: ${JSON.stringify(errorMessage)}
                }
              }, window.location.origin);
            } catch (err) {
              console.error('Failed to postMessage to opener:', err);
            }
          </script>
        </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  };

  if (!platform) {
    return Response.json({ error: 'Missing platform parameter' }, { status: 400 });
  }

  // Construct target OAuth URLs based on platform
  let authUrl = '';

  switch (platform) {
    case 'github': {
      const clientId = process.env.GITHUB_CLIENT_ID;
      if (!clientId) return sendAuthErrorHTML('GITHUB_CLIENT_ID is not configured in your .env file.');
      
      authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=github&scope=read:user%20repo`;
      break;
    }

    case 'linkedin': {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      if (!clientId) return sendAuthErrorHTML('LINKEDIN_CLIENT_ID is not configured in your .env file.');
      
      // Request modern OIDC scopes (openid, profile, email) along with sharing scope (w_member_social)
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=linkedin&scope=openid%20profile%20email%20w_member_social`;
      break;
    }

    case 'x-platform': {
      const clientId = process.env.TWITTER_CLIENT_ID;
      if (!clientId) return sendAuthErrorHTML('TWITTER_CLIENT_ID is not configured in your .env file.');

      // Twitter OAuth 2.0 requires state, code challenge for PKCE (minimum 43 characters for plain method)
      authUrl = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=x-platform&scope=tweet.read%20tweet.write%20users.read%20offline.access&code_challenge=challenge_challenge_challenge_challenge_challenge&code_challenge_method=plain`;
      break;
    }

    case 'instagram': {
      const clientId = process.env.INSTAGRAM_CLIENT_ID;
      if (!clientId) return sendAuthErrorHTML('INSTAGRAM_CLIENT_ID is not configured in your .env file.');

      authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=instagram_graph_user_profile,instagram_graph_user_media&response_type=code&state=instagram`;
      break;
    }

    case 'google-sheets': {
      const clientId = process.env.GOOGLE_SHEETS_CLIENT_ID;
      if (!clientId) return sendAuthErrorHTML('GOOGLE_SHEETS_CLIENT_ID is not configured in your .env file.');

      const scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' ');

      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&state=google-sheets&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
      break;
    }

    default:
      return Response.json({ error: `Platform ${platform} is not supported for real OAuth2 flow` }, { status: 400 });
  }

  // Redirect to official provider login page
  redirect(authUrl);
}

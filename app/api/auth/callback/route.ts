import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${appUrl}/api/auth/callback`;

  // Helper function to return a postMessage HTML page to the popup
  const sendAuthResultHTML = (result: {
    success: boolean;
    platformId?: string;
    accessToken?: string;
    refreshToken?: string;
    connectedAs?: string;
    error?: string;
  }) => {
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating...</title>
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
            .spinner {
              border: 3px solid rgba(255, 255, 255, 0.05);
              border-radius: 50%;
              border-top: 3px solid #adc6ff;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }
            .success-icon {
              color: #4ade80;
              font-size: 48px;
              margin-bottom: 15px;
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
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          ${
            result.success
              ? `<div class="success-icon">✓</div>
                 <h1>Authentication Successful!</h1>
                 <p>Connected to ${result.platformId} as <strong>${result.connectedAs}</strong>.</p>
                 <p style="opacity: 0.5; font-size: 11px;">Closing this window now...</p>`
              : `<div class="error-icon">✗</div>
                 <h1>Authentication Failed</h1>
                 <p>${result.error || 'An unexpected error occurred during auth'}</p>
                 <p style="opacity: 0.5; font-size: 11px;">You can close this window and try again.</p>`
          }
          <script>
            // Send connection result back to the canvas opener window
            const resultData = ${JSON.stringify(result)};
            try {
              window.opener.postMessage({
                type: 'OAUTH_RESULT',
                payload: resultData
              }, window.location.origin);
            } catch (err) {
              console.error('Failed to postMessage to opener:', err);
            }
            
            // Auto close successful popups after 1.5 seconds
            if (resultData.success) {
              setTimeout(() => {
                window.close();
              }, 1500);
            }
          </script>
        </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  };

  // If OAuth provider returned an error direct
  if (error || errorDescription) {
    return sendAuthResultHTML({
      success: false,
      error: errorDescription || error || 'Authorization rejected by provider',
    });
  }

  if (!code || !state) {
    return sendAuthResultHTML({
      success: false,
      error: 'Missing code or state parameters from authorization provider',
    });
  }

  try {
    switch (state) {
      case 'github': {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          return sendAuthResultHTML({
            success: false,
            error: 'GitHub OAuth Client ID or Client Secret is not configured in the server .env file.',
          });
        }

        // Exchange code for token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: callbackUrl,
          }),
        });

        if (!tokenRes.ok) {
          throw new Error(`GitHub token exchange failed: ${tokenRes.statusText}`);
        }

        const tokenData = await tokenRes.json();
        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        const accessToken = tokenData.access_token;

        // Fetch User Info
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
            'User-Agent': 'Connector-Canvas-App',
          },
        });

        if (!userRes.ok) {
          throw new Error(`GitHub fetch user profile failed: ${userRes.statusText}`);
        }

        const userData = await userRes.json();
        const username = `@${userData.login}`;

        return sendAuthResultHTML({
          success: true,
          platformId: 'github',
          accessToken: accessToken,
          connectedAs: username,
        });
      }

      case 'linkedin': {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          return sendAuthResultHTML({
            success: false,
            error: 'LinkedIn Client ID/Secret is not configured in .env',
          });
        }

        // Exchange Token
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackUrl,
            client_id: clientId,
            client_secret: clientSecret,
          }),
        });

        if (!tokenRes.ok) {
          throw new Error(`LinkedIn token exchange failed: ${tokenRes.statusText}`);
        }

        const tokenData = await tokenRes.json();
        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        const accessToken = tokenData.access_token;

        // Fetch user profile
        const userRes = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let connectedAs = 'LinkedIn User';
        if (userRes.ok) {
          const userData = await userRes.json();
          const firstName = userData.localizedFirstName || '';
          const lastName = userData.localizedLastName || '';
          connectedAs = `${firstName} ${lastName}`.trim() || 'LinkedIn User';
        }

        return sendAuthResultHTML({
          success: true,
          platformId: 'linkedin',
          accessToken: accessToken,
          connectedAs,
        });
      }

      case 'x-platform': {
        const clientId = process.env.TWITTER_CLIENT_ID;
        const clientSecret = process.env.TWITTER_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          return sendAuthResultHTML({
            success: false,
            error: 'Twitter/X Client ID/Secret is not configured in .env',
          });
        }

        // Exchange Token (Basic Auth header containing id & secret is standard)
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
          },
          body: new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            redirect_uri: callbackUrl,
            code_verifier: 'challenge',
          }),
        });

        if (!tokenRes.ok) {
          const errBody = await tokenRes.json().catch(() => ({}));
          throw new Error(`Twitter token exchange failed: ${errBody.error_description || tokenRes.statusText}`);
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;

        // Fetch user profile
        const userRes = await fetch('https://api.twitter.com/2/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let connectedAs = 'Twitter User';
        if (userRes.ok) {
          const userData = await userRes.json();
          connectedAs = `@${userData.data?.username}` || 'Twitter User';
        }

        return sendAuthResultHTML({
          success: true,
          platformId: 'x-platform',
          accessToken: accessToken,
          refreshToken: refreshToken,
          connectedAs,
        });
      }

      case 'instagram': {
        const clientId = process.env.INSTAGRAM_CLIENT_ID;
        const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          return sendAuthResultHTML({
            success: false,
            error: 'Instagram Client ID/Secret is not configured in .env',
          });
        }

        // Exchange token via Meta endpoint
        const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: callbackUrl,
            code,
          }),
        });

        if (!tokenRes.ok) {
          const errBody = await tokenRes.json().catch(() => ({}));
          throw new Error(`Instagram token exchange failed: ${errBody.error_message || tokenRes.statusText}`);
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        const userId = tokenData.user_id;

        // Fetch user details
        const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
        let connectedAs = `User ID ${userId}`;
        if (userRes.ok) {
          const userData = await userRes.json();
          connectedAs = `@${userData.username}` || connectedAs;
        }

        return sendAuthResultHTML({
          success: true,
          platformId: 'instagram',
          accessToken: accessToken,
          connectedAs,
        });
      }

      default:
        throw new Error(`Unsupported state parameter: ${state}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return sendAuthResultHTML({
      success: false,
      error: msg,
    });
  }
}

import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { platformId, type, token, params } = await request.json();

    if (!platformId || !token) {
      return Response.json({ error: 'Missing platformId or token' }, { status: 400 });
    }

    if (platformId === 'x-platform' && type === 'post_tweet') {
      if (!params || !params.text) {
        return Response.json({ error: 'Missing text parameter for tweet' }, { status: 400 });
      }

      const res = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: params.text,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        // Twitter API errors are often nested in errData.errors[0].message
        const errMsg = errData.errors?.[0]?.message || errData.detail || errData.title || `Twitter API error: ${res.statusText}`;
        throw new Error(errMsg);
      }

      const data = await res.json();
      return Response.json({
        success: true,
        message: 'Tweet posted successfully!',
        url: `https://x.com/any/status/${data.data?.id}`,
      });
    }

    if (platformId === 'linkedin' && type === 'post_update') {
      if (!params || !params.text) {
        return Response.json({ error: 'Missing text parameter for LinkedIn post' }, { status: 400 });
      }

      // 1. Fetch user profile to get URN id (check userinfo first, fallback to me)
      let userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let personId = '';
      if (userRes.ok) {
        const userData = await userRes.json();
        personId = userData.sub;
      } else {
        userRes = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          personId = userData.id;
        }
      }

      if (!personId) {
        throw new Error(`Failed to fetch LinkedIn user profile details: ${userRes.statusText}`);
      }

      const authorUrn = `urn:li:person:${personId}`;

      // 2. Post UGC post
      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: params.text,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `LinkedIn API error: ${res.statusText}`);
      }

      return Response.json({
        success: true,
        message: 'LinkedIn post published successfully!',
        url: `https://www.linkedin.com/`,
      });
    }

    if (platformId === 'google-sheets' && type === 'create_sheet') {
      if (!params || !params.title) {
        return Response.json({ error: 'Missing title parameter for spreadsheet' }, { status: 400 });
      }

      const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: params.title,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `Google Sheets API error: ${res.statusText}`;
        throw new Error(errMsg);
      }

      const data = await res.json();
      const spreadsheetId = data.spreadsheetId;
      const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      if (params.headers && Array.isArray(params.headers) && params.headers.length > 0) {
        try {
          await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                values: [params.headers],
              }),
            }
          );
        } catch (appendErr) {
          console.error('Error appending headers:', appendErr);
        }
      }

      return Response.json({
        success: true,
        message: `Spreadsheet "${params.title}" created successfully!`,
        url: spreadsheetUrl,
      });
    }

    return Response.json({ error: `Platform ${platformId} action ${type} is not supported` }, { status: 400 });
  } catch (err: any) {
    console.error('Action API failed:', err);
    return Response.json({ error: err.message || 'An error occurred executing action' }, { status: 500 });
  }
}

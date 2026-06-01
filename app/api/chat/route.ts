import { buildSystemPrompt } from '@/lib/buildSystemPrompt';

async function generateContentWithModel(
  modelName: string,
  prompt: string,
  apiKey: string,
  systemPrompt?: string
) {
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  const body: Record<string, unknown> = { contents };

  // Inject system instruction if available
  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
}

export async function POST(req: Request) {
  try {
    const { prompt, connectedPlatforms } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      return Response.json(
        { error: 'Gemini API Key is not set. Please add your GEMINI_API_KEY in the .env file.' },
        { status: 500 }
      );
    }

    // Build platform-aware system prompt
    const platformIds: string[] = connectedPlatforms ?? [];
    const systemPrompt = platformIds.length > 0
      ? buildSystemPrompt(platformIds)
      : undefined;

    let response: Response | null = null;
    let success = false;
    let lastError: string = '';

    // Model list to try in order of preference (Flash -> Flash Lite -> Pro)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Querying Gemini model: ${modelName}...`);
        const res = await generateContentWithModel(modelName, prompt, apiKey, systemPrompt);

        if (res.ok) {
          response = res;
          success = true;
          console.log(`Successfully generated content using: ${modelName}`);
          break;
        } else {
          const errorData = await res.json().catch(() => ({}));
          const errMsg = errorData.error?.message || res.statusText || 'Unknown error';
          lastError = `${modelName} failed (${res.status}): ${errMsg}`;
          console.warn(lastError);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        lastError = `Network error calling ${modelName}: ${msg}`;
        console.error(lastError);
      }
    }

    if (!success || !response) {
      return Response.json(
        { error: `All Gemini models failed. Last error: ${lastError}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to parse structured JSON from the response
    let structured = null;
    try {
      // Look for JSON in the response (Gemini might wrap it in markdown code blocks)
      const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : generatedText.trim();
      const parsed = JSON.parse(jsonStr);
      if (parsed.platforms && Array.isArray(parsed.platforms)) {
        structured = parsed;
      }
    } catch {
      // Not structured JSON — that's fine, return raw text
    }

    return Response.json({ text: generatedText, structured });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json({ error: msg }, { status: 500 });
  }
}

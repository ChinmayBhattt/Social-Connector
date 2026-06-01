import { NextResponse } from 'next/server';

async function generateContentWithModel(modelName: string, prompt: string, apiKey: string) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API Key is not set. Please add your GEMINI_API_KEY in the .env file.' },
        { status: 500 }
      );
    }

    let response: Response | null = null;
    let success = false;
    let lastError: string = '';

    // Model list to try in order of preference (Flash -> Flash Lite -> Pro)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Querying Gemini model: ${modelName}...`);
        const res = await generateContentWithModel(modelName, prompt, apiKey);
        
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
      } catch (e: any) {
        lastError = `Network error calling ${modelName}: ${e.message || e}`;
        console.error(lastError);
      }
    }

    if (!success || !response) {
      return NextResponse.json(
        { error: `All Gemini models failed. Last error: ${lastError}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

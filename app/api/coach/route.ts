import { NextRequest, NextResponse } from "next/server";

interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages?: CoachMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: "Please send a message for SudoBot." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "SudoBot is not configured yet. Please add GEMINI_API_KEY to the environment." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          systemInstruction: {
            parts: [
              {
                text: `You are SudoBot, an expert and friendly Sudoku coach for SudoLogic platform.
            Help players learn strategies: naked singles, hidden singles, naked pairs,
            hidden pairs, pointing pairs, X-wing, Swordfish, Y-wing.
            Be concise, encouraging, use emojis. Max 4-5 sentences per answer.`,
              },
            ],
          },
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { text: "Sorry, SudoBot couldn't respond right now." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't respond.";

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { text: "Sorry, SudoBot ran into an error." },
      { status: 500 }
    );
  }
}

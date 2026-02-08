import { getSystemPrompt } from "@/default/system";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json(); // expects [{ role: 'user', content: '...' }, ...]

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // use 8b for speed, 70b for quality
        messages: [
          { role: "system", content: getSystemPrompt()},
          ...messages,
        ],
        max_tokens: 8000,
      }),
    });

    const data = await groqRes.json();
    console.log(data);
    

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Groq error or invalid response:", data);
      return NextResponse.json({ error: "No response from model", raw: data }, { status: 500 });
    }

    return NextResponse.json({ response: content });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

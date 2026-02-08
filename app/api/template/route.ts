
import { basePrompt } from '@/default/base';
import { nodePrompt } from '@/default/node';
import { reactPrompt } from '@/default/react';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();


        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content:
                            "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                max_tokens: 10,
            }),
        });

        const data = await groqRes.json();
        console.log(data);
        const answer = data.choices?.[0]?.message?.content?.trim().toLowerCase();


        if (answer === "react") {
            return NextResponse.json({
                prompts: [
                    basePrompt,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactPrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [reactPrompt],
            });
        }

        if (answer === "node") {
            return NextResponse.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [nodePrompt],
            });
        }

        console.error("Unknown response from Groq:", answer);

        return NextResponse.json(
            {
                message: "Model returned unexpected result",
                raw: answer,
            },
            { status: 403 }
        );

    } catch (err) {
        console.error("API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

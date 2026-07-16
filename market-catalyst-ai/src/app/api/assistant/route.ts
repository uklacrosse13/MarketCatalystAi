import { NextRequest, NextResponse } from "next/server";
import { generateAssistantReply } from "@/lib/openai";
import type { ChatMessage } from "@/lib/types";

// Canned, clearly-labeled fallback responses used when OPENAI_API_KEY isn't
// set, so the Research Assistant page is explorable without any config.
const MOCK_REPLY = `Here's how I'd think about that (mock response — connect OPENAI_API_KEY in .env.local for live AI answers):

Historically, this kind of question comes down to a few mechanisms:
- **Direct exposure** — companies whose revenue is contractually or structurally tied to the theme
- **Supply chain position** — suppliers and equipment makers one or two steps removed
- **Second-order effects** — companies affected indirectly through input costs, financing conditions, or competitive dynamics

Take a look at the Sectors and Companies pages for concrete examples grounded in the platform's event data.

This is research and education, not personalized investment advice — always do your own due diligence.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ reply: MOCK_REPLY, mock: true });
    }

    const reply = await generateAssistantReply(messages);
    return NextResponse.json({ reply, mock: false });
  } catch (err) {
    console.error("assistant route error:", err);
    return NextResponse.json({ reply: MOCK_REPLY, mock: true });
  }
}

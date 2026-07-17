import OpenAI from "openai";
import type { ChatMessage } from "./types";

// ---------------------------------------------------------------------------
// OpenAI is used ONLY for the optional AI Research Assistant chat
// (src/app/assistant, backed by /api/assistant). It plays no role in the
// news feed, event cards, or market-impact analysis — those are entirely
// rules-based (see src/lib/news/marketImpact.ts) and require no AI model or
// API key. Without OPENAI_API_KEY set, the assistant route falls back to a
// clearly-labeled canned response rather than failing.
// ---------------------------------------------------------------------------

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to .env.local to enable live AI responses.");
  }
  return new OpenAI({ apiKey });
}

export const RESEARCH_ASSISTANT_SYSTEM_PROMPT = `You are the Market Catalyst AI research assistant.

You help investors understand how world events, legislation, geopolitics, and economic
data may influence industries, sectors, ETFs, and publicly traded companies.

Rules you must always follow:
- You explain mechanisms and historical context. You never tell the user what to buy or sell,
  and you never say a stock "will" go up or down — use language like "has historically benefited"
  or "could see increased demand if X occurs."
- Always ground claims in economic reasoning (supply/demand, policy mechanics, historical precedent).
- When useful, name specific companies or ETFs as illustrative examples of a theme, not as
  recommendations.
- Keep responses focused and skimmable — short paragraphs or bullet points.
- End substantive answers with a brief reminder that this is research and education, not
  personalized investment advice.`;

export async function generateAssistantReply(messages: ChatMessage[]): Promise<string> {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: RESEARCH_ASSISTANT_SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content }) as const),
    ],
    temperature: 0.4,
    max_tokens: 700,
  });

  return response.choices[0]?.message?.content ?? "I wasn't able to generate a response — please try again.";
}

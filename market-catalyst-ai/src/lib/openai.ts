import OpenAI from "openai";
import type { ChatMessage } from "./types";

// ---------------------------------------------------------------------------
// Central OpenAI wrapper used by:
//   - src/app/api/assistant/route.ts   (AI Research Assistant chat)
//   - (extension point) an event-ingestion worker that classifies incoming
//     news into the MarketEvent shape defined in src/lib/types.ts
//
// Without OPENAI_API_KEY set, callers should catch the thrown error and fall
// back to mock data — see api/assistant/route.ts for the pattern.
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

/**
 * Extension point: classify a raw news article into the MarketEvent shape
 * (category, potential winners/losers, confidence, reasoning) used throughout
 * the platform. Wire this into a cron job or webhook that pulls from
 * src/lib/newsProvider.ts and writes results into your `events` Supabase table.
 */
export async function classifyEventFromHeadline(headline: string, articleBody: string) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const prompt = `Analyze this news for a market-research platform. Return ONLY valid JSON matching this shape:
{
  "category": string,
  "subcategory": string,
  "potentialWinners": [{ "ticker": string, "name": string, "rationale": string }],
  "potentialLosers": [{ "ticker": string, "name": string, "rationale": string }],
  "confidence": number (0-100),
  "timeHorizon": "days" | "weeks" | "1-6 months" | "6-18 months" | "1-3 years",
  "reasoning": string[]
}

Headline: ${headline}
Article: ${articleBody}`;

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 800,
  });

  const text = response.choices[0]?.message?.content ?? "{}";
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

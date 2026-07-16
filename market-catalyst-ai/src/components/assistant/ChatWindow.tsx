"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";
import { cx } from "@/lib/utils";

const SUGGESTIONS = [
  "What companies benefit from higher oil prices?",
  "What stocks usually rise during defense spending increases?",
  "Show me companies exposed to rare earth metals.",
  "What happened the last time tariffs increased?",
  "Who benefits if interest rates fall?",
  "What companies gain from AI infrastructure spending?",
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the Market Catalyst research assistant. Ask me how a news event, policy change, or economic trend tends to ripple through sectors and companies. I explain mechanisms and historical precedent, not buy/sell advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong reaching the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel flex flex-col h-[600px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cx(
                "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user" ? "bg-signal text-ink-950 font-medium" : "bg-ink-700 text-paper-100 border border-ink-600"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-ink-700 border border-ink-600 rounded-lg px-4 py-3 text-sm text-paper-500">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs text-left px-3 py-1.5 rounded-full border border-ink-600 text-paper-500 hover:border-signal/40 hover:text-signal-soft transition-colors focus-ring"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-ink-600 p-4 flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a sector, event, or historical parallel…"
          className="flex-1 bg-ink-700 border border-ink-500 rounded-md px-3 py-2 text-sm text-paper-100 placeholder:text-paper-700 focus-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-signal text-ink-950 font-semibold text-sm hover:bg-signal-soft transition-colors disabled:opacity-50 focus-ring"
        >
          Send
        </button>
      </form>
    </div>
  );
}

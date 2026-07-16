"use client";

import { useState } from "react";
import type { Watchlist } from "@/lib/types";
import { getCompany } from "@/lib/mockData";
import { formatPrice, formatPercent, cx } from "@/lib/utils";

const SUGGESTED_TICKERS = ["NVDA", "AMD", "TSM", "ASML", "LMT", "RTX", "XOM", "MP", "JPM", "FSLR", "PANW", "DE", "SMCI"];

export default function WatchlistManager({ initial }: { initial: Watchlist[] }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(initial);
  const [newName, setNewName] = useState("");

  function createWatchlist() {
    if (!newName.trim()) return;
    setWatchlists((prev) => [...prev, { id: `wl-${Date.now()}`, name: newName.trim(), tickers: [] }]);
    setNewName("");
  }

  function removeWatchlist(id: string) {
    setWatchlists((prev) => prev.filter((w) => w.id !== id));
  }

  function toggleTicker(watchlistId: string, ticker: string) {
    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === watchlistId
          ? {
              ...w,
              tickers: w.tickers.includes(ticker) ? w.tickers.filter((t) => t !== ticker) : [...w.tickers, ticker],
            }
          : w
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="panel p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createWatchlist()}
          placeholder="New watchlist name, e.g. Small Caps"
          className="flex-1 bg-ink-700 border border-ink-500 rounded-md px-3 py-2 text-sm text-paper-100 placeholder:text-paper-700 focus-ring"
        />
        <button
          onClick={createWatchlist}
          className="px-4 py-2 rounded-md bg-signal text-ink-950 font-semibold text-sm hover:bg-signal-soft transition-colors focus-ring shrink-0"
        >
          Create Watchlist
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {watchlists.map((w) => (
          <div key={w.id} className="panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-paper-100">{w.name}</h2>
              <button
                onClick={() => removeWatchlist(w.id)}
                className="text-xs text-paper-700 hover:text-fall transition-colors focus-ring rounded"
              >
                Delete
              </button>
            </div>

            {w.tickers.length === 0 ? (
              <p className="text-sm text-paper-700 italic mb-4">No tickers yet — add some below.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {w.tickers.map((t) => {
                  const c = getCompany(t);
                  return (
                    <li key={t} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-paper-100">{t}</span>
                      {c && (
                        <span className={cx("data-num text-xs", c.changePercent >= 0 ? "text-rise" : "text-fall")}>
                          ${formatPrice(c.price)} ({formatPercent(c.changePercent)})
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-ink-600">
              {SUGGESTED_TICKERS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTicker(w.id, t)}
                  className={cx(
                    "text-xs font-mono px-2 py-1 rounded border transition-colors focus-ring",
                    w.tickers.includes(t)
                      ? "bg-signal-dim/40 border-signal/40 text-signal-soft"
                      : "border-ink-600 text-paper-500 hover:border-paper-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

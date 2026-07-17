"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { EventCard } from "@/lib/news/types";
import { SECTOR_MAPPINGS } from "@/data/marketMappings";
import EventSummaryCard from "@/components/events/EventSummaryCard";

const DATE_RANGES = [
  { id: "all", label: "Any time" },
  { id: "24h", label: "Last 24 hours" },
  { id: "3d", label: "Last 3 days" },
  { id: "7d", label: "Last 7 days" },
];

const DIRECTIONS = [
  { id: "", label: "All directions" },
  { id: "positive", label: "Potentially Positive" },
  { id: "negative", label: "Potentially Negative" },
  { id: "mixed", label: "Mixed" },
  { id: "uncertain", label: "Uncertain" },
];

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "sourceCount", label: "Most Sources" },
  { id: "confidence", label: "Confidence" },
];

const inputClass =
  "bg-ink-700 border border-ink-500 rounded-md px-3 py-2 text-sm text-paper-100 placeholder:text-paper-700 focus-ring";

export default function NewsExplorer({ initialEvents }: { initialEvents: EventCard[] }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [direction, setDirection] = useState("");
  const [source, setSource] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [sort, setSort] = useState("newest");
  const [events, setEvents] = useState<EventCard[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setErrored(false);
    try {
      const params = new URLSearchParams();
      if (sector) params.set("sector", sector);
      if (direction) params.set("direction", direction);
      if (source) params.set("source", source);
      if (sort) params.set("sort", sort);

      const endpoint = query.trim()
        ? `/api/news/search?q=${encodeURIComponent(query.trim())}`
        : `/api/news?${params.toString()}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch {
      setErrored(true);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [query, sector, direction, source, sort]);

  useEffect(() => {
    const timeout = setTimeout(fetchEvents, 300); // debounce so typing doesn't spam the API
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sector, direction, source, sort]);

  const visibleEvents = useMemo(() => {
    if (dateRange === "all") return events;
    const hours = dateRange === "24h" ? 24 : dateRange === "3d" ? 72 : 168;
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return events.filter((event) => new Date(event.latestUpdated).getTime() >= cutoff);
  }, [events, dateRange]);

  return (
    <div className="space-y-6">
      <div className="panel p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search headlines and snippets…"
          className={`${inputClass} sm:col-span-2 lg:col-span-1`}
        />
        <select value={sector} onChange={(e) => setSector(e.target.value)} className={inputClass}>
          <option value="">All categories / sectors</option>
          {SECTOR_MAPPINGS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Filter by source, e.g. Federal Reserve"
          className={inputClass}
        />
        <select value={direction} onChange={(e) => setDirection(e.target.value)} className={inputClass}>
          {DIRECTIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={inputClass}>
          {DATE_RANGES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-paper-500">Updating results…</p>}
      {errored && !loading && (
        <p className="text-sm text-fall">Couldn't reach the news feed just now — showing the last known results.</p>
      )}

      {!loading && visibleEvents.length === 0 && (
        <div className="panel p-8 text-center">
          <p className="text-paper-300">No stories match these filters right now.</p>
          <p className="text-sm text-paper-700 mt-1">Try widening the date range or clearing a filter.</p>
        </div>
      )}

      <div className="space-y-3">
        {visibleEvents.map((event) => (
          <EventSummaryCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

const CALENDAR = [
  { date: "Jul 17", label: "TSMC Q2 Earnings", tag: "Earnings" },
  { date: "Jul 22", label: "Lockheed Martin Q2 Earnings", tag: "Earnings" },
  { date: "Jul 24", label: "RTX Q2 Earnings", tag: "Earnings" },
  { date: "Jul 29", label: "FOMC Meeting Begins", tag: "Fed" },
  { date: "Jul 29", label: "AMD Q2 Earnings", tag: "Earnings" },
  { date: "Aug 1", label: "July Jobs Report", tag: "Economic Data" },
  { date: "Aug 20", label: "NVIDIA Q2 Earnings", tag: "Earnings" },
];

export default function EconomicCalendar() {
  return (
    <div className="panel p-5">
      <h2 className="font-display font-semibold text-paper-100 mb-4">Economic Calendar</h2>
      <ul className="space-y-3">
        {CALENDAR.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="font-mono text-xs text-signal-soft bg-signal-dim/30 border border-signal/30 rounded px-2 py-0.5 w-16 text-center shrink-0">
              {item.date}
            </span>
            <span className="text-paper-100 flex-1">{item.label}</span>
            <span className="text-xs text-paper-700">{item.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

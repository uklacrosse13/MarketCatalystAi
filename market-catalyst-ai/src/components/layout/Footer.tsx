import Disclaimer from "./Disclaimer";

export default function Footer() {
  return (
    <footer className="border-t border-ink-600 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Disclaimer />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-paper-700">
          <p>© {new Date().getFullYear()} Market Catalyst AI. For research and educational purposes only.</p>
          <p className="font-mono">Data delayed. Not a broker-dealer or investment adviser.</p>
        </div>
      </div>
    </footer>
  );
}

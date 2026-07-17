import Link from "next/link";
import type { Company } from "@/lib/types";
import { formatPrice, formatPercent, cx } from "@/lib/utils";
import StockSparkline from "./StockSparkline";

export default function CompanyCard({ company }: { company: Company }) {
  const positive = company.changePercent >= 0;

  return (
    <Link
      href={`/companies/${company.ticker}`}
      className="panel-tight p-4 flex items-center justify-between gap-4 hover:border-signal/40 transition-colors group focus-ring"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-paper-100 group-hover:text-signal transition-colors">
            {company.ticker}
          </span>
          <span className="text-xs text-paper-500 truncate">{company.industry}</span>
        </div>
        <p className="text-sm text-paper-300 truncate mt-0.5">{company.name}</p>
      </div>

      <div className="hidden sm:block shrink-0">
        <StockSparkline data={company.sparkline} positive={positive} />
      </div>

      <div className="text-right shrink-0">
        <p className="data-num text-paper-100 font-semibold">${formatPrice(company.price)}</p>
        <p className={cx("data-num text-xs", positive ? "text-rise" : "text-fall")}>
          {formatPercent(company.changePercent)}
        </p>
      </div>
    </Link>
  );
}

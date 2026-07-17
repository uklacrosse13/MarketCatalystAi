import { sectors } from "@/lib/mockData";
import SectorCard from "@/components/shared/SectorCard";

export const metadata = { title: "Sectors — Market Catalyst AI" };

export default function SectorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-2xl text-paper-100">Sectors</h1>
        <p className="text-sm text-paper-500 mt-1">
          Every sector tracks AI sentiment, strength, catalysts, and historical returns.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((s) => (
          <SectorCard key={s.slug} sector={s} />
        ))}
      </div>
    </div>
  );
}

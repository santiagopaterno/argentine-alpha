import MacroIndicators from "@/components/dashboard/MacroIndicators";
import EquitySnapshot from "@/components/dashboard/EquitySnapshot";
import PoliticalTracker from "@/components/dashboard/PoliticalTracker";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Argentine economic, financial, and political data for international
          investors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MacroIndicators />
          <EquitySnapshot />
        </div>
        <div>
          <PoliticalTracker />
        </div>
      </div>
    </div>
  );
}

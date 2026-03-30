interface ReformRow {
  pillar: string;
  status: "advancing" | "in_progress" | "stalled" | "reversed";
  note: string;
}

interface DateToWatch {
  date: string;
  event: string;
}

const STATUS_MAP = {
  advancing: { icon: "\u2705", label: "Advancing", color: "text-accent-green" },
  in_progress: { icon: "\u23f3", label: "In progress", color: "text-accent-yellow" },
  stalled: { icon: "\u26a0\ufe0f", label: "Stalled", color: "text-accent-yellow" },
  reversed: { icon: "\ud83d\udd34", label: "Reversed", color: "text-accent-red" },
};

const REFORMS: ReformRow[] = [
  { pillar: "Fiscal anchor (zero deficit)", status: "advancing", note: "Primary surplus maintained through Feb 2026" },
  { pillar: "Monetary/FX regime", status: "in_progress", note: "Crawling peg continues, capital controls partially eased" },
  { pillar: "Deregulation (DNU 70/2023)", status: "stalled", note: "Key chapters upheld by courts, labor reform stalled" },
  { pillar: "Energy reform (Vaca Muerta)", status: "advancing", note: "New pipeline capacity online, export permits expanding" },
  { pillar: "Trade liberalization", status: "in_progress", note: "Import licensing simplified, tariff reform pending" },
];

const POLITICAL_PULSE = [
  "Milei's approval rating stabilizes around 48% — polarized but holding.",
  "Omnibus Law 2.0 negotiations advance with moderate governors; vote expected April.",
  "Provincial fiscal pact renegotiation underway — 5 provinces signed preliminary terms.",
  "IMF staff-level agreement on 5th review expected by mid-April.",
];

const DATES_TO_WATCH: DateToWatch[] = [
  { date: "Apr 15", event: "IMF 5th review board meeting" },
  { date: "Apr 30", event: "Q1 2026 fiscal balance release" },
  { date: "Jun 2026", event: "Mid-term legislative pre-campaign begins" },
  { date: "Jul 9", event: "Sovereign bond coupon payment (USD ~1.2B)" },
];

const ICG_VALUE = 2.61;
const ICG_DATE = "February 2026";

const FISCAL_SURPLUS = "+0.4% of GDP";
const FISCAL_DATE = "January 2026";

export default function PoliticalTracker() {
  return (
    <section className="panel space-y-6">
      <h2 className="text-lg text-heading">
        Political & Policy Tracker
      </h2>

      {/* ICG + Fiscal Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="panel-inner">
          <p className="text-xs text-muted mb-1">
            ICG (Gov. Confidence Index)
          </p>
          <p className="text-2xl font-bold text-primary font-mono">
            {ICG_VALUE}
            <span className="text-sm text-muted font-normal ml-1">/ 5</span>
          </p>
          <p className="text-xs text-subtle mt-1">
            UTdT &middot; {ICG_DATE}
          </p>
        </div>
        <div className="panel-inner">
          <p className="text-xs text-muted mb-1">Primary Fiscal Balance</p>
          <p className="text-2xl font-bold text-accent-green font-mono">
            {FISCAL_SURPLUS}
          </p>
          <p className="text-xs text-subtle mt-1">
            Min. Economia &middot; {FISCAL_DATE}
          </p>
        </div>
      </div>

      {/* Political Pulse */}
      <div>
        <h3 className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wider">
          Political Pulse
        </h3>
        <ul className="space-y-2">
          {POLITICAL_PULSE.map((item, i) => (
            <li
              key={i}
              className="text-sm text-muted pl-4 border-l-2 border-accent-blue/40"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Reform Tracker */}
      <div>
        <h3 className="text-sm font-semibold text-secondary mb-3 uppercase tracking-wider">
          Policy Reform Tracker
        </h3>
        <div className="space-y-2">
          {REFORMS.map((r) => {
            const s = STATUS_MAP[r.status];
            return (
              <div
                key={r.pillar}
                className="flex items-start gap-3 reform-card rounded-lg p-3"
              >
                <span className="text-base mt-0.5 shrink-0">{s.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-primary">
                      {r.pillar}
                    </span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${s.color} status-badge`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{r.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dates to Watch */}
      <div>
        <h3 className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wider">
          Dates to Watch
        </h3>
        <div className="space-y-1.5">
          {DATES_TO_WATCH.map((d, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-accent-cyan font-mono font-medium w-16 shrink-0">
                {d.date}
              </span>
              <span className="text-muted">{d.event}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-subtle">
        This panel is manually curated. Last editorial update: March 28, 2026.
      </p>
    </section>
  );
}

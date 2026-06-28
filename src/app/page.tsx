import {
  demoADRs,
  demoTechAssessments,
  demoRoadmap,
  demoTeamHealth,
  demoEngineeringKPIs,
  demoDueDiligenceFindings,
} from "@/lib/demo-data";
import type {
  ArchitectureDecision,
  TechStackAssessment,
  RoadmapItem,
  TeamHealthMetric,
  EngineeringMetric,
  DueDiligenceFinding,
} from "@/lib/types";

// ═══ Reusable components ═══════════════════════════════════════════════════════

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "red" | "amber" | "blue" | "purple" | "indigo";
}) {
  const tones: Record<string, string> = {
    slate: "border-slate-200 bg-white text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        tones[tone] || tones.slate
      }`}
    >
      {children}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}

function ProgressBar({
  value,
  color = "indigo",
}: {
  value: number;
  color?: string;
}) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  };
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-full rounded-full ${colors[color] || colors.indigo}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    accepted: "bg-emerald-400",
    proposed: "bg-amber-400",
    deprecated: "bg-red-400",
    superseded: "bg-purple-400",
    adopt: "bg-emerald-400",
    trial: "bg-blue-400",
    assess: "bg-amber-400",
    hold: "bg-red-400",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        map[status] || "bg-slate-400"
      }`}
    />
  );
}

function StatCard({
  label,
  value,
  tone = "slate",
  subtitle,
}: {
  label: string;
  value: string;
  tone?: string;
  subtitle?: string;
}) {
  const borders: Record<string, string> = {
    slate: "border-l-slate-300",
    green: "border-l-emerald-300",
    amber: "border-l-amber-300",
    red: "border-l-red-300",
    blue: "border-l-blue-300",
    indigo: "border-l-indigo-300",
    purple: "border-l-purple-300",
  };
  return (
    <div
      className={`rounded-2xl bg-white/90 p-5 shadow-sm border-l-4 ${
        borders[tone] || borders.slate
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-400">{subtitle}</div>
      )}
    </div>
  );
}

function TrendIndicator({
  trend,
  changePercent,
}: {
  trend: string;
  changePercent: number;
}) {
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const color =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-600"
        : "text-slate-500";
  return (
    <span className={`text-xs font-semibold ${color}`}>
      {arrow} {Math.abs(changePercent).toFixed(1)}%
    </span>
  );
}

// ═══ ADR Table ════════════════════════════════════════════════════════════════

function ADRRow({ adr }: { adr: ArchitectureDecision }) {
  const statusTone =
    adr.status === "accepted"
      ? "green"
      : adr.status === "proposed"
        ? "amber"
        : adr.status === "deprecated"
          ? "red"
          : "purple";
  const impactTone =
    adr.impact === "high"
      ? "red"
      : adr.impact === "medium"
        ? "amber"
        : "slate";
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="py-3 px-3 font-mono text-xs text-slate-500">{adr.id}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <StatusDot status={adr.status} />
          <span className="font-semibold text-sm text-slate-900">
            {adr.title}
          </span>
        </div>
      </td>
      <td className="py-3 px-3">
        <Badge tone={statusTone}>{adr.status}</Badge>
      </td>
      <td className="py-3 px-3 text-sm text-slate-600">
        {new Date(adr.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
      <td className="py-3 px-3">
        <Badge tone={impactTone}>{adr.impact}</Badge>
      </td>
    </tr>
  );
}

function ADRTable() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Architecture Decision Records
        </h2>
        <Badge tone="blue">{demoADRs.length} ADRs</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2 px-3 w-24">ID</th>
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Impact</th>
            </tr>
          </thead>
          <tbody>
            {[...demoADRs]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((adr) => (
                <ADRRow key={adr.id} adr={adr} />
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ═══ Tech Stack Radar / Summary Cards ═════════════════════════════════════════

function TechStackCard({ tsa }: { tsa: TechStackAssessment }) {
  const verdictTone =
    tsa.verdict === "adopt"
      ? "green"
      : tsa.verdict === "trial"
        ? "blue"
        : tsa.verdict === "assess"
          ? "amber"
          : "red";
  const categoryLabels: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    infrastructure: "Infra",
    data: "Data",
    devops: "DevOps",
    security: "Security",
    mobile: "Mobile",
    ai_ml: "AI/ML",
  };
  return (
    <div className="rounded-2xl bg-white/90 p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {categoryLabels[tsa.category] || tsa.category}
        </span>
        <Badge tone={verdictTone}>{tsa.verdict}</Badge>
      </div>
      <div className="font-bold text-slate-900 mb-1">{tsa.technology}</div>
      <div className="text-xs text-slate-500 mb-3">{tsa.rationale}</div>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>v{tsa.version}</span>
        <span>
          Proficiency:{" "}
          <span className="font-semibold text-slate-700">
            {tsa.teamProficiency}%
          </span>
        </span>
        <ProgressBar value={tsa.teamProficiency} color="indigo" />
      </div>
    </div>
  );
}

function TechStackRadar() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Tech Stack Assessments
        </h2>
        <Badge tone="indigo">{demoTechAssessments.length} technologies</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoTechAssessments.map((tsa) => (
          <TechStackCard key={tsa.id} tsa={tsa} />
        ))}
      </div>
    </Card>
  );
}

// ═══ Roadmap Timeline ═════════════════════════════════════════════════════════

function RoadmapTimelineItem({ item }: { item: RoadmapItem }) {
  const phaseColor =
    item.phase === "launch"
      ? "emerald"
      : item.phase === "build"
        ? "blue"
        : item.phase === "design"
          ? "amber"
          : "slate";
  const riskBadge =
    item.riskLevel === "high"
      ? "red"
      : item.riskLevel === "medium"
        ? "amber"
        : "green";
  return (
    <div className="flex gap-4 items-start py-3 border-b border-slate-100 last:border-0">
      <div className="w-20 shrink-0">
        <Badge tone="slate">{item.quarter}</Badge>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-slate-900">
            {item.initiative}
          </span>
          <Badge tone={riskBadge}>{item.riskLevel} risk</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Phase:{" "}
            <span className="font-semibold capitalize">{item.phase}</span>
          </span>
          <span>Owner: {item.owner}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <ProgressBar value={item.progress} color={phaseColor} />
          </div>
          <span className="text-xs font-semibold text-slate-600 w-10 text-right">
            {item.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

function RoadmapTimeline() {
  const quarters = [...new Set(demoRoadmap.map((r) => r.quarter))].sort();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Roadmap Timeline</h2>
        <Badge tone="purple">{quarters.length} quarters</Badge>
      </div>
      <div className="space-y-1">
        {demoRoadmap.map((item) => (
          <RoadmapTimelineItem key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}

// ═══ Team Health Metrics ══════════════════════════════════════════════════════

function TeamHealthCard({ metric }: { metric: TeamHealthMetric }) {
  // For "lower is better" metrics (cycle time, code review turnaround, etc.)
  const isLowerBetter = [
    "Cycle Time",
    "Code Review Turnaround",
    "Change Failure Rate",
    "Incident MTTR",
    "Onboarding Time",
  ].includes(metric.name);

  const positiveTrend =
    isLowerBetter ? metric.trend === "down" : metric.trend === "up";
  const tone = positiveTrend ? "green" : metric.trend === "stable" ? "slate" : "red";

  const barColor = positiveTrend
    ? "emerald"
    : metric.trend === "stable"
      ? "amber"
      : "red";

  return (
    <div
      className={`rounded-2xl bg-white/90 p-4 shadow-sm border-l-4 ${
        tone === "green"
          ? "border-l-emerald-300"
          : tone === "red"
            ? "border-l-red-300"
            : "border-l-slate-300"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-900">
          {metric.name}
        </span>
        <TrendIndicator
          trend={metric.trend}
          changePercent={Math.abs(metric.changePercent)}
        />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">
        {metric.value}
        <span className="text-sm font-normal text-slate-400 ml-1">
          {metric.unit}
        </span>
      </div>
      <ProgressBar
        value={(metric.value / metric.benchmark) * 100}
        color={barColor}
      />
      <div className="mt-1 text-xs text-slate-400">
        Benchmark: {metric.benchmark} {metric.unit}
      </div>
    </div>
  );
}

function TeamHealthSection() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Team Health</h2>
        <Badge tone="green">
          {demoTeamHealth.filter((m) => m.trend === "up").length} improving
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoTeamHealth.map((m) => (
          <TeamHealthCard key={m.id} metric={m} />
        ))}
      </div>
    </Card>
  );
}

// ═══ Engineering KPI Cards ════════════════════════════════════════════════════

function EngineeringMetricCard({ metric }: { metric: EngineeringMetric }) {
  const isOnTarget = metric.value <= metric.target;

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {metric.name}
        </span>
        <TrendIndicator
          trend={metric.trend}
          changePercent={
            metric.history.length >= 2
              ? ((metric.history[metric.history.length - 1] -
                  metric.history[metric.history.length - 2]) /
                  Math.abs(metric.history[metric.history.length - 2] || 1)) *
                100
              : 0
          }
        />
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">
        {metric.value}
        <span className="text-sm font-normal text-slate-400 ml-1">
          {metric.unit}
        </span>
      </div>
      <div className="text-xs text-slate-500 mb-3">
        Target: {metric.target} {metric.unit} ·{" "}
        <span className={isOnTarget ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
          {isOnTarget ? "On track" : "Needs attention"}
        </span>
      </div>
      {/* Mini sparkline */}
      <div className="flex items-end gap-1 h-10">
        {metric.history.map((v, i) => {
          const max = Math.max(...metric.history, metric.target);
          const pct = (v / max) * 100;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-indigo-500/70 hover:bg-indigo-600 transition-colors"
              style={{ height: `${Math.max(4, pct)}%` }}
              title={`${v} ${metric.unit}`}
            />
          );
        })}
      </div>
    </Card>
  );
}

function EngineeringKPISection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {demoEngineeringKPIs.map((kpi) => (
        <EngineeringMetricCard key={kpi.id} metric={kpi} />
      ))}
    </div>
  );
}

// ═══ Investor Due-Diligence Readiness ═════════════════════════════════════════

function DiligenceFindingCard({ finding }: { finding: DueDiligenceFinding }) {
  const severityTone: Record<DueDiligenceFinding["severity"], "red" | "amber" | "slate"> = {
    critical: "red",
    high: "red",
    medium: "amber",
    low: "slate",
  };
  const statusTone: Record<DueDiligenceFinding["status"], "red" | "amber" | "green" | "slate"> = {
    open: "red",
    mitigating: "amber",
    resolved: "green",
    accepted: "slate",
  };
  const materialityTone: Record<DueDiligenceFinding["investorMateriality"], "red" | "amber" | "slate"> = {
    blocking: "red",
    watchlist: "amber",
    low: "slate",
  };
  const dataroomTone: Record<DueDiligenceFinding["dataroomStatus"], "red" | "amber" | "green"> = {
    missing: "red",
    partial: "amber",
    ready: "green",
  };
  const domainLabel = finding.domain.replace(/_/g, " ");

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {domainLabel}
        </span>
        <Badge tone={severityTone[finding.severity]}>{finding.severity}</Badge>
        <Badge tone={statusTone[finding.status]}>{finding.status}</Badge>
        <Badge tone={materialityTone[finding.investorMateriality]}>
          {finding.investorMateriality}
        </Badge>
      </div>
      <p className="text-sm font-semibold text-slate-900">{finding.finding}</p>
      <p className="mt-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Investor ask: </span>
        {finding.investorQuestion}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Remediation: </span>
        {finding.recommendation}
      </p>
      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">Dataroom readiness</div>
          <Badge tone={dataroomTone[finding.dataroomStatus]}>
            {finding.dataroomStatus}
          </Badge>
        </div>
        <dl className="mt-2 space-y-1">
          <div className="flex gap-2">
            <dt className="min-w-20 font-semibold text-slate-500">Owner</dt>
            <dd>{finding.executiveOwner}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-20 font-semibold text-slate-500">Evidence</dt>
            <dd>{finding.evidenceArtifact}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-20 font-semibold text-slate-500">Target</dt>
            <dd>
              {new Date(finding.targetRemediationDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function DiligenceReadinessSection() {
  const activeFindings = demoDueDiligenceFindings.filter(
    (finding) => finding.status === "open" || finding.status === "mitigating"
  );
  const investorBlockingFindings = activeFindings.filter(
    (finding) => finding.investorMateriality === "blocking"
  );
  const coveredDomains = new Set(demoDueDiligenceFindings.map((finding) => finding.domain));
  const readyDataroomArtifacts = demoDueDiligenceFindings.filter(
    (finding) => finding.dataroomStatus === "ready"
  ).length;

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Investor Diligence Readiness
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Pre-dataroom view of risks investors ask about: architecture,
            security, data governance, operational resilience, and accountable
            remediation plans.
          </p>
        </div>
        <Badge tone={investorBlockingFindings.length > 0 ? "red" : "green"}>
          {investorBlockingFindings.length} blocking risks
        </Badge>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          label="Active Findings"
          value={String(activeFindings.length)}
          tone={activeFindings.length > 0 ? "amber" : "green"}
          subtitle="open or mitigating"
        />
        <StatCard
          label="Diligence Domains"
          value={String(coveredDomains.size)}
          tone="indigo"
          subtitle="covered in discovery"
        />
        <StatCard
          label="Investor-Blocking"
          value={String(investorBlockingFindings.length)}
          tone={investorBlockingFindings.length > 0 ? "red" : "green"}
          subtitle="explicit materiality tag"
        />
        <StatCard
          label="Ready Artifacts"
          value={`${readyDataroomArtifacts}/${demoDueDiligenceFindings.length}`}
          tone={
            readyDataroomArtifacts === demoDueDiligenceFindings.length
              ? "green"
              : "amber"
          }
          subtitle="dataroom evidence"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {activeFindings.slice(0, 3).map((finding) => (
          <DiligenceFindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </Card>
  );
}

// ═══ Main Page ════════════════════════════════════════════════════════════════

export default function Home() {
  const acceptedADRs = demoADRs.filter(
    (a) => a.status === "accepted"
  ).length;
  const techDebtScore = demoEngineeringKPIs.find(
    (k) => k.name === "Tech Debt Ratio"
  )?.value;
  const roadmapCompletion = Math.round(
    demoRoadmap.reduce((sum, r) => sum + r.progress, 0) / demoRoadmap.length
  );
  const avgVelocity =
    demoTeamHealth.find((m) => m.name === "Sprint Velocity")?.value || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 px-6 py-8 font-sans text-slate-900 antialiased">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          CTO Advisory Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tech strategy · architecture decisions · roadmap planning · team
          health metrics · engineering KPIs
        </p>
      </header>

      {/* Hero stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="ADR Count" value={String(acceptedADRs)} tone="indigo" subtitle={`${demoADRs.length} total`} />
        <StatCard
          label="Tech Debt Score"
          value={`${techDebtScore}%`}
          tone={Number(techDebtScore) > 15 ? "amber" : "green"}
          subtitle="of sprint capacity"
        />
        <StatCard
          label="Roadmap Progress"
          value={`${roadmapCompletion}%`}
          tone="blue"
          subtitle="avg completion"
        />
        <StatCard
          label="Team Velocity"
          value={String(avgVelocity)}
          tone="green"
          subtitle="pts / sprint"
        />
      </div>

      {/* Investor diligence readiness */}
      <div className="mb-8">
        <DiligenceReadinessSection />
      </div>

      {/* ADR Table + Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ADRTable />
        <TechStackRadar />
      </div>

      {/* Roadmap Timeline */}
      <div className="mb-8">
        <RoadmapTimeline />
      </div>

      {/* Team Health */}
      <div className="mb-8">
        <TeamHealthSection />
      </div>

      {/* Engineering KPIs */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Engineering KPIs
        </h2>
        <EngineeringKPISection />
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        CTO Advisory Dashboard · Portfolio demonstration · All data is fictional
        · No production keys or network calls
      </footer>
    </div>
  );
}

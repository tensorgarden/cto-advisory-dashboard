export type ADRStatus = "proposed" | "accepted" | "deprecated" | "superseded";

export type ImpactLevel = "high" | "medium" | "low";

export type TechCategory =
  | "frontend"
  | "backend"
  | "infrastructure"
  | "data"
  | "devops"
  | "security"
  | "mobile"
  | "ai_ml";

export type AssessmentVerdict = "adopt" | "trial" | "assess" | "hold";

export type RoadmapPhase = "discovery" | "design" | "build" | "launch" | "scale";

export type MetricTrend = "up" | "down" | "stable";

export interface TechStackAssessment {
  id: string;
  category: TechCategory;
  technology: string;
  version: string;
  verdict: AssessmentVerdict;
  rationale: string;
  lastEvaluated: string;
  migrationCost: "none" | "low" | "medium" | "high";
  teamProficiency: number; // 0-100
}

export interface ArchitectureDecision {
  id: string;
  title: string;
  status: ADRStatus;
  date: string;
  impact: ImpactLevel;
  context: string;
  decision: string;
  consequences: string;
  supersededBy: string | null;
}

export interface RoadmapItem {
  id: string;
  quarter: string; // e.g. "Q1 2026"
  initiative: string;
  phase: RoadmapPhase;
  progress: number; // 0-100
  owner: string;
  dependencies: string[];
  riskLevel: ImpactLevel;
}

export interface TeamHealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: MetricTrend;
  changePercent: number;
  benchmark: number;
  description: string;
}

export interface EngineeringMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: MetricTrend;
  history: number[]; // last 6 data points
  description: string;
}

export type DueDiligenceDomain =
  | "delivery_health"
  | "architecture_dependency"
  | "security_supply_chain"
  | "data_ai_governance"
  | "operational_resilience"
  | "leadership_accountability";

export type FindingSeverity = "critical" | "high" | "medium" | "low";

export type FindingStatus = "open" | "mitigating" | "resolved" | "accepted";

export type InvestorMateriality = "blocking" | "watchlist" | "low";

export type DataroomStatus = "missing" | "partial" | "ready";

export type VendorExitReadiness = "missing" | "planned" | "tested";

export type VendorContractTransferStatus =
  | "not_reviewed"
  | "consent_required"
  | "transferable";

export interface CriticalVendorDependency {
  vendor: string;
  revenueCriticalWorkflow: string;
  exitReadiness: VendorExitReadiness;
  estimatedReplacementDays: number;
  contractTransferStatus: VendorContractTransferStatus;
  contractEvidenceArtifact: string;
}

export type KeyPersonHandoverReadiness =
  | "missing"
  | "in_progress"
  | "verified";

export interface KeyPersonDependency {
  criticalSystem: string;
  primaryOwner: string;
  backupOwner: string | null;
  handoverReadiness: KeyPersonHandoverReadiness;
}

export type RecoveryExerciseOutcome =
  | "not_run"
  | "missed_objectives"
  | "met_objectives";

export interface RecoveryExerciseEvidence {
  criticalSystem: string;
  targetRtoMinutes: number;
  targetRpoMinutes: number;
  lastExerciseDate: string | null;
  actualRecoveryMinutes: number | null;
  outcome: RecoveryExerciseOutcome;
}

export type OpenSourceLicenseReviewStatus =
  | "clear"
  | "review_required"
  | "prohibited";

export interface OpenSourceLicenseReview {
  dependencySnapshotDate: string;
  reviewedPackageCount: number;
  copyleftPackageCount: number;
  status: OpenSourceLicenseReviewStatus;
  evidenceArtifact: string;
}

export interface DueDiligenceFinding {
  id: string;
  domain: DueDiligenceDomain;
  severity: FindingSeverity;
  status: FindingStatus;
  finding: string;
  impact: string;
  investorQuestion: string;
  boardReadyUpdate: string;
  investorMateriality: InvestorMateriality;
  dataroomStatus: DataroomStatus;
  criticalVendorDependency: CriticalVendorDependency | null;
  keyPersonDependency: KeyPersonDependency | null;
  recoveryExerciseEvidence: RecoveryExerciseEvidence | null;
  openSourceLicenseReview: OpenSourceLicenseReview | null;
  recommendation: string;
  executiveOwner: string;
  evidenceArtifact: string;
  estimatedRemediationCostUsd: number;
  estimatedAnnualRevenueAtRiskUsd: number;
  targetRemediationDate: string;
  discoveredAt: string;
  resolvedAt: string | null;
}

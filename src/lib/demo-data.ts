import type {
  TechStackAssessment,
  ArchitectureDecision,
  RoadmapItem,
  TeamHealthMetric,
  EngineeringMetric,
  DueDiligenceFinding,
} from "./types";

// ─── 12 Architecture Decision Records ─────────────────────────────────────────

export const demoADRs: ArchitectureDecision[] = [
  {
    id: "ADR-001",
    title: "Adopt Next.js for web platform",
    status: "accepted",
    date: "2025-11-03",
    impact: "high",
    context: "Team split between React SPA and full-stack framework. Need SSR for SEO and unified deployment model.",
    decision: "Standardize on Next.js 15 with App Router for all new web applications.",
    consequences: "Single framework reduces context switching. Server components reduce client bundle. Migration of legacy SPAs will take 2 quarters.",
    supersededBy: null,
  },
  {
    id: "ADR-002",
    title: "PostgreSQL as primary data store",
    status: "accepted",
    date: "2025-11-10",
    impact: "high",
    context: "Current mix of MySQL and MongoDB creates operational burden. Need ACID compliance and rich querying.",
    decision: "Consolidate on PostgreSQL 16 with Supabase for managed hosting and row-level security.",
    consequences: "Simplified ops, strong consistency. MongoDB workloads require migration scripts. JSONB covers document use cases.",
    supersededBy: null,
  },
  {
    id: "ADR-003",
    title: "Introduce event-driven architecture with RabbitMQ",
    status: "proposed",
    date: "2026-05-22",
    impact: "high",
    context: "Monolith coupling slowing down teams. Order processing and notification systems need decoupling.",
    decision: "Introduce RabbitMQ for async messaging between bounded contexts. Start with order-to-fulfillment pipeline.",
    consequences: "Improved team autonomy. Requires operational investment in message broker monitoring and dead-letter handling.",
    supersededBy: null,
  },
  {
    id: "ADR-004",
    title: "Migrate CI/CD from Jenkins to GitHub Actions",
    status: "accepted",
    date: "2026-01-15",
    impact: "medium",
    context: "Jenkins maintenance overhead high. Team already on GitHub. Need simpler pipeline management.",
    decision: "Migrate all CI/CD pipelines to GitHub Actions with reusable workflows.",
    consequences: "Reduced infra maintenance burden. Lost some legacy Jenkins plugin integrations — rebuilt as custom actions.",
    supersededBy: null,
  },
  {
    id: "ADR-005",
    title: "Adopt TypeScript across all services",
    status: "accepted",
    date: "2025-12-01",
    impact: "high",
    context: "JavaScript services accumulating runtime type errors. Onboarding friction for new engineers.",
    decision: "All new services and significant refactors must use TypeScript with strict mode enabled.",
    consequences: "Defect rate dropped 30% in frontend team. Legacy JS services grandfathered with migration backlog tickets.",
    supersededBy: null,
  },
  {
    id: "ADR-006",
    title: "Use Vercel for frontend hosting",
    status: "accepted",
    date: "2026-02-10",
    impact: "medium",
    context: "Current AWS CloudFront + S3 setup requires manual cache invalidation. Preview deployments missing.",
    decision: "Host all Next.js applications on Vercel Pro tier with automatic preview deployments per PR.",
    consequences: "Deploy previews accelerated review cycles. Lock-in mitigated by standard Next.js output.",
    supersededBy: null,
  },
  {
    id: "ADR-007",
    title: "Centralized logging with OpenTelemetry",
    status: "proposed",
    date: "2026-06-01",
    impact: "medium",
    context: "Debugging distributed failures requires correlating logs across 6+ services. No unified trace ID.",
    decision: "Instrument all services with OpenTelemetry SDKs. Export traces to Honeycomb and logs to Grafana Loki.",
    consequences: "Observability vastly improved. Instrumentation effort estimated at 4 sprints across all teams.",
    supersededBy: null,
  },
  {
    id: "ADR-008",
    title: "Feature flags via LaunchDarkly",
    status: "accepted",
    date: "2026-03-14",
    impact: "medium",
    context: "Long-running feature branches cause merge hell. Need safer continuous delivery patterns.",
    decision: "Adopt LaunchDarkly for feature flagging. Trunk-based development with flags gating incomplete features.",
    consequences: "Deployment frequency up 2x. Flag debt requires quarterly cleanup sprints.",
    supersededBy: null,
  },
  {
    id: "ADR-009",
    title: "Monorepo with Turborepo",
    status: "superseded",
    date: "2025-06-20",
    impact: "high",
    context: "Multiple repos causing duplicated config and inconsistent tooling across 8 TypeScript packages.",
    decision: "Consolidate into a single monorepo managed by Turborepo with shared ESLint, TSConfig, and build pipelines.",
    consequences: "Build caching reduced CI times 60%. IntelliSense improved. Some teams resisted monorepo workflow initially.",
    supersededBy: "ADR-012",
  },
  {
    id: "ADR-010",
    title: "Deprecate GraphQL in favor of tRPC",
    status: "deprecated",
    date: "2025-04-08",
    impact: "high",
    context: "GraphQL schema maintenance burdens 3-person API team. Internal services don't need public-facing query language.",
    decision: "Replace GraphQL with tRPC for internal service-to-service and BFF communication.",
    consequences: "Type safety end-to-end eliminated an entire class of runtime errors. External API still uses REST.",
    supersededBy: null,
  },
  {
    id: "ADR-011",
    title: "Redis for session and cache layer",
    status: "accepted",
    date: "2026-04-01",
    impact: "low",
    context: "In-memory session stores cause sticky-session requirement on load balancer. Rate limiting needs shared state.",
    decision: "Deploy Redis Cluster for distributed session storage, rate limiting counters, and query result caching.",
    consequences: "Stateless app servers enable horizontal scaling. Added ~$400/month in managed Redis costs.",
    supersededBy: null,
  },
  {
    id: "ADR-012",
    title: "Turborepo → Nx migration for polyglot support",
    status: "proposed",
    date: "2026-06-05",
    impact: "high",
    context: "Turborepo excellent for JS/TS but team adding Golang and Python services. Need cross-language task orchestration.",
    decision: "Evaluate Nx for monorepo management with first-class Go and Python support. Proof-of-concept in Q3.",
    consequences: "If adopted, enables unified dependency graph across languages. Migration from Turborepo is non-trivial.",
    supersededBy: null,
  },
];

// ─── 8 Tech Stack Assessments ─────────────────────────────────────────────────

export const demoTechAssessments: TechStackAssessment[] = [
  {
    id: "tsa-001",
    category: "frontend",
    technology: "Next.js 15 + React 19",
    version: "15.4.6",
    verdict: "adopt",
    rationale: "App Router stable, server components mature, excellent SSR performance. Team proficiency high after 6 months.",
    lastEvaluated: "2026-05-01",
    migrationCost: "none",
    teamProficiency: 88,
  },
  {
    id: "tsa-002",
    category: "backend",
    technology: "Go 1.23",
    version: "1.23.4",
    verdict: "trial",
    rationale: "Strong performance for data-intensive services. Growing team interest. Existing Node.js services sufficient for most workloads.",
    lastEvaluated: "2026-04-15",
    migrationCost: "high",
    teamProficiency: 42,
  },
  {
    id: "tsa-003",
    category: "data",
    technology: "PostgreSQL 16 + Supabase",
    version: "16.4",
    verdict: "adopt",
    rationale: "Production-proven with row-level security. Managed hosting reduces DBA burden. JSONB covers document use cases.",
    lastEvaluated: "2026-03-20",
    migrationCost: "low",
    teamProficiency: 79,
  },
  {
    id: "tsa-004",
    category: "infrastructure",
    technology: "Kubernetes (EKS)",
    version: "1.31",
    verdict: "adopt",
    rationale: "Mature orchestration. Team has 2 years of operational experience. Cost optimization with spot instances in place.",
    lastEvaluated: "2026-02-28",
    migrationCost: "none",
    teamProficiency: 76,
  },
  {
    id: "tsa-005",
    category: "devops",
    technology: "Terraform + Atlantis",
    version: "1.10",
    verdict: "adopt",
    rationale: "Infrastructure-as-code mandatory for SOC 2. Atlantis provides PR-based plan/apply workflow.",
    lastEvaluated: "2026-05-15",
    migrationCost: "none",
    teamProficiency: 72,
  },
  {
    id: "tsa-006",
    category: "security",
    technology: "Snyk + Dependabot",
    version: "latest",
    verdict: "adopt",
    rationale: "Automated vulnerability scanning integrated into CI. Low false-positive rate. SOC 2 requirement satisfied.",
    lastEvaluated: "2026-03-01",
    migrationCost: "low",
    teamProficiency: 85,
  },
  {
    id: "tsa-007",
    category: "mobile",
    technology: "React Native + Expo",
    version: "0.76",
    verdict: "assess",
    rationale: "Business case for mobile app emerging. Team has React expertise but no native mobile experience. Evaluate vs Flutter.",
    lastEvaluated: "2026-06-01",
    migrationCost: "high",
    teamProficiency: 30,
  },
  {
    id: "tsa-008",
    category: "ai_ml",
    technology: "OpenAI API + LangChain",
    version: "GPT-4o",
    verdict: "trial",
    rationale: "Customer support chatbot pilot shows 40% deflection rate. Cost and latency need monitoring before production commitment.",
    lastEvaluated: "2026-05-30",
    migrationCost: "medium",
    teamProficiency: 55,
  },
];

// ─── Roadmap (6 quarters) ─────────────────────────────────────────────────────

export const demoRoadmap: RoadmapItem[] = [
  {
    id: "rm-001",
    quarter: "Q2 2026",
    initiative: "Platform authentication overhaul (OAuth 2.1 + passkeys)",
    phase: "build",
    progress: 65,
    owner: "Sarah Chen",
    dependencies: [],
    riskLevel: "medium",
  },
  {
    id: "rm-002",
    quarter: "Q2 2026",
    initiative: "CI/CD pipeline migration to GitHub Actions",
    phase: "launch",
    progress: 90,
    owner: "DevOps Team",
    dependencies: ["ADR-004"],
    riskLevel: "low",
  },
  {
    id: "rm-003",
    quarter: "Q3 2026",
    initiative: "Event-driven order processing (RabbitMQ)",
    phase: "design",
    progress: 20,
    owner: "Marcus Webb",
    dependencies: ["ADR-003"],
    riskLevel: "high",
  },
  {
    id: "rm-004",
    quarter: "Q3 2026",
    initiative: "OpenTelemetry observability rollout",
    phase: "discovery",
    progress: 10,
    owner: "Priya Nair",
    dependencies: ["ADR-007"],
    riskLevel: "medium",
  },
  {
    id: "rm-005",
    quarter: "Q4 2026",
    initiative: "Customer-facing mobile app MVP",
    phase: "discovery",
    progress: 5,
    owner: "Mobile Team",
    dependencies: ["tsa-007"],
    riskLevel: "high",
  },
  {
    id: "rm-006",
    quarter: "Q4 2026",
    initiative: "AI chatbot production deployment",
    phase: "build",
    progress: 35,
    owner: "AI Team",
    dependencies: ["tsa-008"],
    riskLevel: "medium",
  },
  {
    id: "rm-007",
    quarter: "Q1 2027",
    initiative: "Multi-region deployment (EU data residency)",
    phase: "design",
    progress: 5,
    owner: "Infra Team",
    dependencies: ["rm-004"],
    riskLevel: "medium",
  },
  {
    id: "rm-008",
    quarter: "Q1 2027",
    initiative: "Polyglot monorepo migration (Nx)",
    phase: "discovery",
    progress: 0,
    owner: "Platform Team",
    dependencies: ["ADR-012"],
    riskLevel: "high",
  },
  {
    id: "rm-009",
    quarter: "Q2 2027",
    initiative: "Go backend service extraction",
    phase: "discovery",
    progress: 0,
    owner: "Backend Team",
    dependencies: ["tsa-002", "rm-008"],
    riskLevel: "medium",
  },
  {
    id: "rm-010",
    quarter: "Q2 2027",
    initiative: "SOC 2 Type II audit preparation",
    phase: "build",
    progress: 40,
    owner: "CISO Office",
    dependencies: ["rm-004", "tsa-006"],
    riskLevel: "low",
  },
];

// ─── Team Health Metrics ──────────────────────────────────────────────────────

export const demoTeamHealth: TeamHealthMetric[] = [
  {
    id: "th-001",
    name: "Sprint Velocity",
    value: 142,
    unit: "story pts",
    trend: "up",
    changePercent: 8.4,
    benchmark: 130,
    description: "Average story points completed per 2-week sprint across all engineering teams",
  },
  {
    id: "th-002",
    name: "Cycle Time",
    value: 3.8,
    unit: "days",
    trend: "down",
    changePercent: -12.5,
    benchmark: 5.0,
    description: "Median time from first commit to production deploy (lower is better)",
  },
  {
    id: "th-003",
    name: "Code Review Turnaround",
    value: 4.2,
    unit: "hours",
    trend: "up",
    changePercent: 15.3,
    benchmark: 6.0,
    description: "Median time from PR open to first review (lower is better — increasing is a warning)",
  },
  {
    id: "th-004",
    name: "Change Failure Rate",
    value: 4.7,
    unit: "%",
    trend: "down",
    changePercent: -22.1,
    benchmark: 10.0,
    description: "Percentage of deployments causing incidents requiring rollback or hotfix",
  },
  {
    id: "th-005",
    name: "Incident MTTR",
    value: 47,
    unit: "min",
    trend: "down",
    changePercent: -18.2,
    benchmark: 60,
    description: "Mean time to resolve production incidents from alert to mitigation",
  },
  {
    id: "th-006",
    name: "Developer Satisfaction",
    value: 8.1,
    unit: "/10",
    trend: "up",
    changePercent: 5.2,
    benchmark: 7.5,
    description: "Quarterly dev satisfaction survey score across engineering org",
  },
  {
    id: "th-007",
    name: "Test Coverage",
    value: 78,
    unit: "%",
    trend: "up",
    changePercent: 4.1,
    benchmark: 80,
    description: "Overall codebase test coverage across all services",
  },
  {
    id: "th-008",
    name: "Onboarding Time",
    value: 21,
    unit: "days",
    trend: "down",
    changePercent: -9.0,
    benchmark: 30,
    description: "Median days until new engineer ships first production change",
  },
];

// ─── Engineering KPIs ─────────────────────────────────────────────────────────

export const demoEngineeringKPIs: EngineeringMetric[] = [
  {
    id: "eng-001",
    name: "Deployment Frequency",
    value: 24,
    unit: "/week",
    target: 30,
    trend: "up",
    history: [14, 16, 18, 20, 22, 24],
    description: "Production deployments per week across all services",
  },
  {
    id: "eng-002",
    name: "Lead Time for Changes",
    value: 28,
    unit: "hours",
    target: 24,
    trend: "down",
    history: [48, 42, 38, 34, 30, 28],
    description: "Median time from commit to production deploy",
  },
  {
    id: "eng-003",
    name: "Incident Count",
    value: 3,
    unit: "/month",
    target: 2,
    trend: "stable",
    history: [5, 4, 4, 3, 3, 3],
    description: "P1 and P2 production incidents per month",
  },
  {
    id: "eng-004",
    name: "Tech Debt Ratio",
    value: 14.2,
    unit: "%",
    target: 10,
    trend: "down",
    history: [21, 19, 17.5, 16, 15, 14.2],
    description: "Percentage of sprint capacity allocated to tech debt remediation",
  },
  {
    id: "eng-005",
    name: "Security Vulnerabilities",
    value: 8,
    unit: "open",
    target: 0,
    trend: "down",
    history: [22, 18, 15, 12, 10, 8],
    description: "Open critical and high severity vulnerabilities across all services",
  },
  {
    id: "eng-006",
    name: "API P99 Latency",
    value: 320,
    unit: "ms",
    target: 250,
    trend: "stable",
    history: [380, 350, 340, 330, 325, 320],
    description: "99th percentile API response time across all endpoints",
  },
];

// ─── 7 Due-Diligence Findings (pre-engagement discovery) ──────────────────────

export const demoDueDiligenceFindings: DueDiligenceFinding[] = [
  {
    id: "dd-001",
    domain: "delivery_health",
    severity: "high",
    status: "mitigating",
    finding:
      "Change failure rate is 4.7% but teams cannot explain incident repeat patterns with evidence — root cause taxonomy and post-incident review process are missing.",
    impact:
      "Recurring incidents erode customer trust and consume 12% of sprint capacity on unplanned hotfix work. Without structured post-mortems, the same failure classes repeat quarterly.",
    investorQuestion:
      "Can management prove repeat production incidents have root causes, assigned owners, and trend evidence before investor diligence?",
    boardReadyUpdate:
      "Board update: incident repeat patterns are now a financing-readiness blocker; VP Engineering owns the RCA taxonomy and will return with owner-by-failure-class evidence before the next board pack.",
    investorMateriality: "blocking",
    dataroomStatus: "partial",
    criticalVendorDependency: null,
    keyPersonDependency: null,
    recoveryExerciseEvidence: null,
    openSourceLicenseReview: null,
    penetrationTestEvidence: null,
    complianceCertificationEvidence: null,
    intellectualPropertyAssignmentEvidence: null,
    recommendation:
      "Institute blameless post-incident reviews with a shared RCA template within 2 sprints. Tag every P1/P2 incident against a failure taxonomy so patterns become visible to leadership.",
    executiveOwner: "VP Engineering",
    evidenceArtifact: "Incident taxonomy pilot board memo with P1/P2 RCA template and trend extract",
    estimatedRemediationCostUsd: 12000,
    estimatedAnnualRevenueAtRiskUsd: 240000,
    targetRemediationDate: "2026-06-21",
    discoveredAt: "2026-06-01",
    resolvedAt: null,
  },
  {
    id: "dd-002",
    domain: "architecture_dependency",
    severity: "critical",
    status: "open",
    finding:
      "Order-processing service has an undocumented runtime dependency on a third-party address-validation API with no circuit breaker or fallback — discovered only during a production outage.",
    impact:
      "A single vendor API degradation blocks the entire checkout flow. No timeout or fallback means every request hangs until the upstream TCP connection times out at 30 seconds.",
    investorQuestion:
      "Can the company prove revenue-critical vendor dependencies have fallbacks before diligence exposes a single-point-of-failure risk?",
    boardReadyUpdate:
      "Board update: revenue-critical vendor drag is concentrated in checkout; Head of Platform owns circuit-breaker proof and degraded-mode acceptance criteria for the next investment committee readout.",
    investorMateriality: "blocking",
    dataroomStatus: "partial",
    criticalVendorDependency: {
      vendor: "AddressVerify Cloud",
      revenueCriticalWorkflow: "Checkout address validation",
      exitReadiness: "missing",
      estimatedReplacementDays: 45,
      contractTransferStatus: "consent_required",
      contractEvidenceArtifact:
        "Executed vendor agreement with change-of-control clause and written consent request tracker",
    },
    keyPersonDependency: {
      criticalSystem: "Checkout failure and degraded-mode operations",
      primaryOwner: "Marcus Webb",
      backupOwner: null,
      handoverReadiness: "missing",
    },
    recoveryExerciseEvidence: null,
    openSourceLicenseReview: null,
    penetrationTestEvidence: null,
    complianceCertificationEvidence: null,
    intellectualPropertyAssignmentEvidence: null,
    recommendation:
      "Wrap the address-validation call in a circuit breaker (3 failures in 60s → open for 30s) and add a degraded-mode fallback that accepts unverified addresses with a manual-review flag. Obtain written change-of-control consent from the vendor. Name and cross-train a backup operator, then run a checkout-failure handover drill within 1 sprint.",
    executiveOwner: "Head of Platform",
    evidenceArtifact: "Checkout dependency map, address-validation runbook, degraded-mode fallback plan, vendor consent record, and backup-operator handover drill record",
    estimatedRemediationCostUsd: 18000,
    estimatedAnnualRevenueAtRiskUsd: 720000,
    targetRemediationDate: "2026-06-17",
    discoveredAt: "2026-06-03",
    resolvedAt: null,
  },
  {
    id: "dd-003",
    domain: "security_supply_chain",
    severity: "high",
    status: "open",
    finding:
      "CI/CD pipeline secrets are stored in repository-level GitHub Secrets but any maintainer can modify the workflow YAML to exfiltrate them in a build step — no branch-protection rules or required reviews on workflow changes.",
    impact:
      "A compromised personal access token or a malicious workflow edit could expose production credentials, database connection strings, and deployment keys to any actor with write access.",
    investorQuestion:
      "Can leadership substantiate cybersecurity maturity with protected workflow controls instead of self-attested scanner coverage?",
    boardReadyUpdate:
      "Board update: workflow-change control is the clearest security diligence gap; CISO Office owns branch-protection evidence and action-pinning register before diligence Q&A.",
    investorMateriality: "blocking",
    dataroomStatus: "missing",
    criticalVendorDependency: null,
    keyPersonDependency: null,
    recoveryExerciseEvidence: null,
    openSourceLicenseReview: {
      dependencySnapshotDate: "2026-06-08",
      reviewedPackageCount: 418,
      copyleftPackageCount: 2,
      status: "review_required",
      evidenceArtifact:
        "Software bill of materials with package-level license scan and counsel disposition register",
    },
    penetrationTestEvidence: {
      scope:
        "Production web platform, CI/CD pipeline, and cloud infrastructure",
      testingFirm: null,
      lastTestDate: null,
      openHighCriticalFindings: null,
      retestVerifiedDate: null,
      status: "not_run",
      evidenceArtifact:
        "No independent penetration-test report on file — automated scanner coverage only",
    },
    complianceCertificationEvidence: {
      framework: "SOC 2 Type II",
      scope:
        "Production web platform, CI/CD pipeline, and customer data handling controls",
      status: "in_progress",
      certificationDate: null,
      expiryOrTargetDate: "2026-09-30",
      evidenceArtifact:
        "SOC 2 Type II gap assessment, control-mapping register, and audit firm engagement letter",
    },
    intellectualPropertyAssignmentEvidence: null,
    recommendation:
      "Enable branch protection on main with required PR reviews for `.github/workflows/*`. Pin GitHub Actions to commit SHAs. Add a CI step that diffs workflow files against an allowlist and blocks unapproved changes. Complete counsel disposition for the two copyleft packages before marking the security evidence pack ready. Commission an independent third-party penetration test of the production platform and CI/CD pipeline, with a verified retest of any high or critical findings, before diligence Q&A. Map controls to the SOC 2 Type II trust service criteria and book the external audit window with the selected firm before diligence Q&A.",
    executiveOwner: "CISO Office",
    evidenceArtifact: "Workflow-change control evidence pack with branch-protection screenshot, action pinning register, and SOC 2 Type II readiness tracker",
    estimatedRemediationCostUsd: 8500,
    estimatedAnnualRevenueAtRiskUsd: 900000,
    targetRemediationDate: "2026-06-24",
    discoveredAt: "2026-05-28",
    resolvedAt: null,
  },
  {
    id: "dd-004",
    domain: "data_ai_governance",
    severity: "medium",
    status: "mitigating",
    finding:
      "Customer-support chatbot (GPT-4o pilot) generates responses that occasionally include hallucinated policy details — no verification gate, no confidence threshold, and no human-review escalation path for low-certainty answers.",
    impact:
      "One observed hallucination invented a refund window that contradicted the published terms. Without guardrails, customer-facing AI output creates compliance and trust risk at scale.",
    investorQuestion:
      "Can the team show AI customer-response controls, confidence thresholds, and human review before scaling the pilot?",
    boardReadyUpdate:
      "Board update: AI support scaling remains a watchlist item until Head of Customer Experience owns confidence thresholds, human review, and customer disclosure artifacts in the dataroom.",
    investorMateriality: "watchlist",
    dataroomStatus: "partial",
    criticalVendorDependency: null,
    keyPersonDependency: null,
    recoveryExerciseEvidence: null,
    openSourceLicenseReview: null,
    penetrationTestEvidence: null,
    complianceCertificationEvidence: {
      framework: "GDPR / CCPA / EU AI Act readiness",
      scope:
        "Customer-support chatbot data flows, marketing analytics, and EU data residency",
      status: "not_started",
      certificationDate: null,
      expiryOrTargetDate: null,
      evidenceArtifact:
        "Privacy compliance gap register with EU AI Act applicability assessment and DPO engagement note",
    },
    intellectualPropertyAssignmentEvidence: null,
    recommendation:
      "Add a confidence-score check before surfacing AI-generated answers to customers. Route responses below 0.85 confidence to a human-review queue. Publish an AI-usage disclosure in the help center. Begin a GDPR/CCPA readiness assessment and document EU AI Act applicability for the chatbot before scaling the pilot.",
    executiveOwner: "Head of Customer Experience",
    evidenceArtifact: "AI response QA sample, low-confidence escalation SOP, published disclosure draft, and privacy gap register with EU AI Act applicability assessment",
    estimatedRemediationCostUsd: 9500,
    estimatedAnnualRevenueAtRiskUsd: 180000,
    targetRemediationDate: "2026-06-28",
    discoveredAt: "2026-06-05",
    resolvedAt: null,
  },
  {
    id: "dd-005",
    domain: "operational_resilience",
    severity: "medium",
    status: "open",
    finding:
      "On-call rotation covers only the backend team — frontend and data-platform incidents have no defined escalation path. Weekend incidents in those areas wait until Monday unless someone notices Slack.",
    impact:
      "Mean time to acknowledge (MTTA) for non-backend incidents is unbounded. Last quarter, a data-pipeline stall went undetected for 14 hours, delaying customer-facing analytics dashboards.",
    investorQuestion:
      "Can operations prove every production surface has named responders, escalation evidence, and tabletop rehearsal coverage?",
    boardReadyUpdate:
      "Board update: operational resilience coverage is incomplete outside backend; Engineering Ops owns escalation coverage and tabletop rehearsal proof for the next risk review.",
    investorMateriality: "watchlist",
    dataroomStatus: "partial",
    criticalVendorDependency: null,
    keyPersonDependency: null,
    recoveryExerciseEvidence: {
      criticalSystem: "Customer analytics data pipeline",
      targetRtoMinutes: 240,
      targetRpoMinutes: 60,
      lastExerciseDate: null,
      actualRecoveryMinutes: null,
      outcome: "not_run",
    },
    openSourceLicenseReview: null,
    penetrationTestEvidence: null,
    complianceCertificationEvidence: null,
    intellectualPropertyAssignmentEvidence: null,
    recommendation:
      "Extend on-call rotation to one frontend and one data-platform engineer per week. Define severity levels and escalation policies in a shared runbook. Run a recovery exercise within 30 days and measure actual restoration against the 4-hour RTO and 1-hour RPO.",
    executiveOwner: "Director of Engineering Operations",
    evidenceArtifact: "On-call coverage matrix, escalation policy, and signed recovery-exercise result with RTO/RPO measurements",
    estimatedRemediationCostUsd: 7000,
    estimatedAnnualRevenueAtRiskUsd: 150000,
    targetRemediationDate: "2026-07-02",
    discoveredAt: "2026-06-02",
    resolvedAt: null,
  },
  {
    id: "dd-006",
    domain: "leadership_accountability",
    severity: "low",
    status: "accepted",
    finding:
      "No formal decision-making framework (DACI/RAPID) is used for architecture or roadmap choices — decisions are made in ad-hoc Slack threads without documented rationale or assigned accountability.",
    impact:
      "ADR-009 (monorepo with Turborepo) was reversed by ADR-012 (Nx migration) within 12 months. Team reports context-switching fatigue because decisions lack visible owners and committed review dates.",
    investorQuestion:
      "Can the CTO show decision ownership, review cadence, and governance evidence for major technical direction changes?",
    boardReadyUpdate:
      "Board update: decision accountability is accepted as a governance process change; CTO owns the RAPID register and 6-month ADR review cadence in board materials.",
    investorMateriality: "low",
    dataroomStatus: "ready",
    criticalVendorDependency: null,
    keyPersonDependency: null,
    recoveryExerciseEvidence: null,
    openSourceLicenseReview: null,
    penetrationTestEvidence: null,
    complianceCertificationEvidence: null,
    intellectualPropertyAssignmentEvidence: null,
    recommendation:
      "Adopt a lightweight RAPID framework for all architecture decisions. Every ADR must list a Recommender, Approver, and a 6-month review date. This finding is accepted as a process change, not a technical fix.",
    executiveOwner: "CTO",
    evidenceArtifact: "RAPID decision log template plus ADR ownership register",
    estimatedRemediationCostUsd: 3000,
    estimatedAnnualRevenueAtRiskUsd: 0,
    targetRemediationDate: "2026-06-10",
    discoveredAt: "2026-05-30",
    resolvedAt: "2026-06-10",
  },
  {
    id: "dd-007",
    domain: "intellectual_property",
    severity: "high",
    status: "open",
    finding:
      "Four of the nine people who contributed production code never signed a proprietary information and inventions agreement: two early contractors and two current engineers. Their code has no assignment clause or work-for-hire documentation on file.",
    impact:
      "The company may not own all of its own codebase. Unsigned contributors could retain rights over customer-facing checkout logic and internal tooling. IP ownership gaps are the most common legal red flag investors surface during diligence.",
    investorQuestion:
      "Can the company produce signed invention-assignment agreements from every founder, employee, and contractor who contributed to the product?",
    boardReadyUpdate:
      "Board update: IP assignment gaps are the top legal diligence red flag for this round; General Counsel owns the PIIA register and signed-assignment evidence before the investment committee pack.",
    investorMateriality: "blocking",
    dataroomStatus: "partial",
    criticalVendorDependency: null,
    keyPersonDependency: null,
    recoveryExerciseEvidence: null,
    openSourceLicenseReview: null,
    penetrationTestEvidence: null,
    complianceCertificationEvidence: null,
    intellectualPropertyAssignmentEvidence: {
      contributorClass:
        "Founders, employees, and contractors with production-code access",
      totalContributors: 9,
      signedAssignmentCount: 5,
      status: "partial",
      evidenceArtifact:
        "PIIA assignment register with per-contributor signature status and counsel confirmatory-assignment tracker",
    },
    recommendation:
      "Have all four unsigned contributors execute a PIIA with present and future invention assignment, and obtain confirmatory assignments or work-for-hire documentation from counsel for the two early contractors. Route unsigned contributors off production access until the register shows full signature coverage.",
    executiveOwner: "General Counsel",
    evidenceArtifact:
      "PIIA assignment register, counsel confirmatory-assignment tracker, and production-access revocation checklist",
    estimatedRemediationCostUsd: 7500,
    estimatedAnnualRevenueAtRiskUsd: 300000,
    targetRemediationDate: "2026-06-30",
    discoveredAt: "2026-06-09",
    resolvedAt: null,
  },
];

export const demoActiveAnnualRevenueAtRiskUsd = demoDueDiligenceFindings
  .filter(
    (finding) => finding.status === "open" || finding.status === "mitigating"
  )
  .reduce(
    (total, finding) => total + finding.estimatedAnnualRevenueAtRiskUsd,
    0
  );

const DAY_MS = 1000 * 60 * 60 * 24;
const NINETY_DAY_DILIGENCE_WINDOW = 90;

const remediationWindowDays = (finding: DueDiligenceFinding) =>
  Math.ceil(
    (Date.parse(finding.targetRemediationDate) - Date.parse(finding.discoveredAt)) /
      DAY_MS
  );

export const demoNinetyDayDiligencePlan = [...demoDueDiligenceFindings]
  .filter(
    (finding) => finding.status === "open" || finding.status === "mitigating"
  )
  .filter(
    (finding) => remediationWindowDays(finding) <= NINETY_DAY_DILIGENCE_WINDOW
  )
  .sort(
    (a, b) =>
      Date.parse(a.targetRemediationDate) - Date.parse(b.targetRemediationDate)
  );

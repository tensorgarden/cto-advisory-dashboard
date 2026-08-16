import { describe, it, expect } from "vitest";
import {
  demoADRs,
  demoTechAssessments,
  demoRoadmap,
  demoTeamHealth,
  demoEngineeringKPIs,
  demoDueDiligenceFindings,
  demoNinetyDayDiligencePlan,
  demoActiveAnnualRevenueAtRiskUsd,
} from "@/lib/demo-data";
import type {
  ComplianceCertificationStatus,
  DataroomStatus,
  DueDiligenceDomain,
  InvestorMateriality,
  IpAssignmentCoverageStatus,
  KeyPersonHandoverReadiness,
  OpenSourceLicenseReviewStatus,
  PenetrationTestStatus,
  RecoveryExerciseOutcome,
  TechCategory,
  VendorContractTransferStatus,
  VendorExitReadiness,
} from "@/lib/types";

describe("CTO Advisory Dashboard - demo data integrity", () => {
  it("has exactly 12 ADRs", () => {
    expect(demoADRs.length).toBe(12);
  });

  it("ADR statuses are all valid", () => {
    const valid = ["proposed", "accepted", "deprecated", "superseded"];
    for (const adr of demoADRs) {
      expect(valid).toContain(adr.status);
    }
  });

  it("accepting an ADR sets supersededBy on the one it replaces", () => {
    const superseded = demoADRs.filter((a) => a.supersededBy !== null);
    for (const adr of superseded) {
      expect(adr.supersededBy).toBeTruthy();
      const target = demoADRs.find((a) => a.id === adr.supersededBy);
      expect(target).toBeDefined();
    }
  });

  it("has exactly 8 tech stack assessments", () => {
    expect(demoTechAssessments.length).toBe(8);
  });

  it("tech stack verdicts are valid", () => {
    const valid = ["adopt", "trial", "assess", "hold"];
    for (const tsa of demoTechAssessments) {
      expect(valid).toContain(tsa.verdict);
    }
  });

  it("team proficiency is between 0 and 100", () => {
    for (const tsa of demoTechAssessments) {
      expect(tsa.teamProficiency).toBeGreaterThanOrEqual(0);
      expect(tsa.teamProficiency).toBeLessThanOrEqual(100);
    }
  });

  it("roadmap has items across at least 4 quarters", () => {
    const quarters = new Set(demoRoadmap.map((r) => r.quarter));
    expect(quarters.size).toBeGreaterThanOrEqual(4);
  });

  it("roadmap progress is between 0 and 100", () => {
    for (const item of demoRoadmap) {
      expect(item.progress).toBeGreaterThanOrEqual(0);
      expect(item.progress).toBeLessThanOrEqual(100);
    }
  });

  it("has exactly 8 team health metrics", () => {
    expect(demoTeamHealth.length).toBe(8);
  });

  it("team health trend values are valid", () => {
    const valid = ["up", "down", "stable"];
    for (const m of demoTeamHealth) {
      expect(valid).toContain(m.trend);
    }
  });

  it("has exactly 6 engineering KPIs", () => {
    expect(demoEngineeringKPIs.length).toBe(6);
  });

  it("engineering KPI history has exactly 6 data points each", () => {
    for (const kpi of demoEngineeringKPIs) {
      expect(kpi.history.length).toBe(6);
    }
  });
});

// ─── Fractional CTO domain invariants ────────────────────────────────────────

describe("Fractional CTO domain invariants", () => {
  it("covers every tech category with at least one assessment (no blind spots)", () => {
    const coveredCategories = new Set(
      demoTechAssessments.map((tsa) => tsa.category)
    );
    const expected: TechCategory[] = [
      "frontend",
      "backend",
      "infrastructure",
      "data",
      "devops",
      "security",
      "mobile",
      "ai_ml",
    ];
    for (const cat of expected) {
      expect(coveredCategories.has(cat)).toBe(true);
    }
  });

  it("roadmap dependencies referencing ADR-IDs point to existing ADRs", () => {
    const adrIds = new Set(demoADRs.map((a) => a.id));
    for (const item of demoRoadmap) {
      for (const dep of item.dependencies) {
        if (dep.startsWith("ADR-")) {
          expect(adrIds.has(dep)).toBe(true);
        }
      }
    }
  });

  it("engineering KPI history aligns with declared trend", () => {
    for (const kpi of demoEngineeringKPIs) {
      const h = kpi.history;
      if (h.length < 2) continue;
      const lastTwo = [h[h.length - 2], h[h.length - 1]];
      if (kpi.trend === "up") {
        expect(lastTwo[1]).toBeGreaterThanOrEqual(lastTwo[0]);
      } else if (kpi.trend === "down") {
        expect(lastTwo[1]).toBeLessThanOrEqual(lastTwo[0]);
      }
      // "stable" trend has no strict constraint — it's a judgment call
    }
  });
});

// ─── Due-diligence finding domain invariants ──────────────────────────────────

describe("Due-diligence findings", () => {
  it("has exactly 7 findings covering every diligence domain", () => {
    expect(demoDueDiligenceFindings.length).toBe(7);
    const domains = new Set(demoDueDiligenceFindings.map((f) => f.domain));
    const expected: DueDiligenceDomain[] = [
      "delivery_health",
      "architecture_dependency",
      "security_supply_chain",
      "data_ai_governance",
      "operational_resilience",
      "leadership_accountability",
      "intellectual_property",
    ];
    for (const domain of expected) {
      expect(domains.has(domain)).toBe(true);
    }
  });

  it("every finding has a valid status and severity", () => {
    const validStatuses = ["open", "mitigating", "resolved", "accepted"];
    const validSeverities = ["critical", "high", "medium", "low"];
    for (const f of demoDueDiligenceFindings) {
      expect(validStatuses).toContain(f.status);
      expect(validSeverities).toContain(f.severity);
    }
  });

  it("tags every finding with investor materiality and dataroom status", () => {
    const validMateriality: InvestorMateriality[] = [
      "blocking",
      "watchlist",
      "low",
    ];
    const validDataroomStatuses: DataroomStatus[] = [
      "missing",
      "partial",
      "ready",
    ];

    for (const f of demoDueDiligenceFindings) {
      expect(validMateriality).toContain(f.investorMateriality);
      expect(validDataroomStatuses).toContain(f.dataroomStatus);
      expect(f.investorQuestion.length).toBeGreaterThan(50);
      expect(f.investorQuestion.endsWith("?")).toBe(true);
      expect(f.boardReadyUpdate.length).toBeGreaterThan(80);
      expect(f.boardReadyUpdate.toLowerCase()).toContain("board");
    }
  });

  it("keeps active board updates actionable and owner-backed", () => {
    for (const f of demoDueDiligenceFindings) {
      const isActive = f.status === "open" || f.status === "mitigating";
      if (!isActive) continue;

      const update = f.boardReadyUpdate.toLowerCase();

      expect(update).toContain("board");
      expect(update).toMatch(/own|owner/);
      expect(update).not.toContain("tbd");
    }
  });

  it("escalates vendor-drag risk in the board packet for architecture dependency blockers", () => {
    const finding = demoDueDiligenceFindings.find(
      (f) =>
        f.domain === "architecture_dependency" &&
        f.investorMateriality === "blocking"
    );

    expect(finding).toBeDefined();
    if (!finding) return;

    const boardUpdate = finding.boardReadyUpdate.toLowerCase();

    expect(boardUpdate).toContain("vendor");
    expect(boardUpdate).toContain("checkout");
    expect(finding.executiveOwner).toBe("Head of Platform");
  });

  it("makes critical vendor concentration and exit readiness explicit", () => {
    const vendorDependencies = demoDueDiligenceFindings.filter(
      (finding) => finding.criticalVendorDependency !== null
    );
    const validReadiness: VendorExitReadiness[] = [
      "missing",
      "planned",
      "tested",
    ];

    expect(vendorDependencies.length).toBeGreaterThan(0);
    for (const finding of vendorDependencies) {
      const dependency = finding.criticalVendorDependency;

      expect(finding.domain).toBe("architecture_dependency");
      expect(dependency).not.toBeNull();
      if (!dependency) continue;

      expect(dependency.vendor.length).toBeGreaterThan(2);
      expect(dependency.revenueCriticalWorkflow.length).toBeGreaterThan(10);
      expect(validReadiness).toContain(dependency.exitReadiness);
      const validTransferStatuses: VendorContractTransferStatus[] = [
        "not_reviewed",
        "consent_required",
        "transferable",
      ];

      expect(Number.isInteger(dependency.estimatedReplacementDays)).toBe(true);
      expect(dependency.estimatedReplacementDays).toBeGreaterThan(0);
      expect(validTransferStatuses).toContain(dependency.contractTransferStatus);
      expect(dependency.contractEvidenceArtifact.length).toBeGreaterThan(30);
    }
  });

  it("keeps unresolved vendor transfer terms in active investor review", () => {
    const unresolvedTransfers = demoDueDiligenceFindings.filter((finding) => {
      const dependency = finding.criticalVendorDependency;
      return (
        dependency !== null &&
        dependency.contractTransferStatus !== "transferable"
      );
    });

    expect(unresolvedTransfers.length).toBeGreaterThan(0);
    for (const finding of unresolvedTransfers) {
      const dependency = finding.criticalVendorDependency;
      expect(dependency).not.toBeNull();
      if (!dependency) continue;

      const proof =
        `${finding.recommendation} ${finding.evidenceArtifact} ${dependency.contractEvidenceArtifact}`.toLowerCase();

      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(proof).toMatch(/consent|change-of-control/);
    }
  });

  it("makes open-source license exposure evidence-backed", () => {
    const licenseReviews = demoDueDiligenceFindings.filter(
      (finding) => finding.openSourceLicenseReview !== null
    );
    const validStatuses: OpenSourceLicenseReviewStatus[] = [
      "clear",
      "review_required",
      "prohibited",
    ];

    expect(licenseReviews.length).toBeGreaterThan(0);
    for (const finding of licenseReviews) {
      const review = finding.openSourceLicenseReview;

      expect(finding.domain).toBe("security_supply_chain");
      expect(review).not.toBeNull();
      if (!review) continue;

      expect(Number.isNaN(Date.parse(review.dependencySnapshotDate))).toBe(false);
      expect(Number.isInteger(review.reviewedPackageCount)).toBe(true);
      expect(review.reviewedPackageCount).toBeGreaterThan(0);
      expect(Number.isInteger(review.copyleftPackageCount)).toBe(true);
      expect(review.copyleftPackageCount).toBeGreaterThanOrEqual(0);
      expect(review.copyleftPackageCount).toBeLessThanOrEqual(
        review.reviewedPackageCount
      );
      expect(validStatuses).toContain(review.status);
      expect(review.evidenceArtifact.toLowerCase()).toMatch(/license|sbom/);
    }
  });

  it("keeps unresolved license findings out of a ready dataroom", () => {
    const unresolvedReviews = demoDueDiligenceFindings.filter(
      (finding) =>
        finding.openSourceLicenseReview !== null &&
        finding.openSourceLicenseReview.status !== "clear"
    );

    expect(unresolvedReviews.length).toBeGreaterThan(0);
    for (const finding of unresolvedReviews) {
      const review = finding.openSourceLicenseReview;
      expect(review).not.toBeNull();
      if (!review) continue;

      expect(review.copyleftPackageCount).toBeGreaterThan(0);
      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(review.evidenceArtifact.toLowerCase()).toContain("disposition");
    }
  });

  it("keeps untested vendor exits in active investor review", () => {
    const vendorBlockers = demoDueDiligenceFindings.filter(
      (finding) =>
        finding.domain === "architecture_dependency" &&
        finding.investorMateriality === "blocking"
    );

    expect(vendorBlockers.length).toBeGreaterThan(0);
    for (const finding of vendorBlockers) {
      const dependency = finding.criticalVendorDependency;

      expect(dependency).not.toBeNull();
      if (!dependency || dependency.exitReadiness === "tested") continue;

      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(
        `${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase()
      ).toContain("fallback");
    }
  });

  it("makes critical-system key-person coverage explicit", () => {
    const keyPersonDependencies = demoDueDiligenceFindings.filter(
      (finding) => finding.keyPersonDependency !== null
    );
    const validReadiness: KeyPersonHandoverReadiness[] = [
      "missing",
      "in_progress",
      "verified",
    ];

    expect(keyPersonDependencies.length).toBeGreaterThan(0);
    for (const finding of keyPersonDependencies) {
      const dependency = finding.keyPersonDependency;

      expect(["architecture_dependency", "operational_resilience"]).toContain(
        finding.domain
      );
      expect(dependency).not.toBeNull();
      if (!dependency) continue;

      expect(dependency.criticalSystem.length).toBeGreaterThan(20);
      expect(dependency.primaryOwner.length).toBeGreaterThan(2);
      expect(validReadiness).toContain(dependency.handoverReadiness);
      if (dependency.backupOwner === null) {
        expect(dependency.handoverReadiness).not.toBe("verified");
      }
    }
  });

  it("keeps single-owner systems in active investor review until handover is verified", () => {
    const unresolvedCoverage = demoDueDiligenceFindings.filter((finding) => {
      const dependency = finding.keyPersonDependency;
      return (
        dependency !== null &&
        (dependency.backupOwner === null ||
          dependency.handoverReadiness !== "verified")
      );
    });

    expect(unresolvedCoverage.length).toBeGreaterThan(0);
    for (const finding of unresolvedCoverage) {
      const evidence =
        `${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase();

      expect(finding.investorMateriality).toBe("blocking");
      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(evidence).toContain("backup");
      expect(evidence).toContain("handover");
    }
  });

  it("makes recovery objectives and exercise evidence explicit", () => {
    const recoveryEvidence = demoDueDiligenceFindings.filter(
      (finding) => finding.recoveryExerciseEvidence !== null
    );
    const validOutcomes: RecoveryExerciseOutcome[] = [
      "not_run",
      "missed_objectives",
      "met_objectives",
    ];

    expect(recoveryEvidence.length).toBeGreaterThan(0);
    for (const finding of recoveryEvidence) {
      const evidence = finding.recoveryExerciseEvidence;

      expect(finding.domain).toBe("operational_resilience");
      expect(evidence).not.toBeNull();
      if (!evidence) continue;

      expect(evidence.criticalSystem.length).toBeGreaterThan(20);
      expect(Number.isInteger(evidence.targetRtoMinutes)).toBe(true);
      expect(Number.isInteger(evidence.targetRpoMinutes)).toBe(true);
      expect(evidence.targetRtoMinutes).toBeGreaterThan(0);
      expect(evidence.targetRpoMinutes).toBeGreaterThan(0);
      expect(validOutcomes).toContain(evidence.outcome);
      if (evidence.outcome === "not_run") {
        expect(evidence.lastExerciseDate).toBeNull();
        expect(evidence.actualRecoveryMinutes).toBeNull();
      }
    }
  });

  it("keeps untested recovery objectives in active investor review", () => {
    const unprovenRecovery = demoDueDiligenceFindings.filter((finding) => {
      const evidence = finding.recoveryExerciseEvidence;
      return evidence !== null && evidence.outcome !== "met_objectives";
    });

    expect(unprovenRecovery.length).toBeGreaterThan(0);
    for (const finding of unprovenRecovery) {
      const proof =
        `${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase();

      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(proof).toContain("recovery");
      expect(proof).toContain("rto");
      expect(proof).toContain("rpo");
      expect(proof).toContain("exercise");
    }
  });

  it("makes penetration-test evidence explicit and internally consistent", () => {
    const penTestRecords = demoDueDiligenceFindings.filter(
      (finding) => finding.penetrationTestEvidence !== null
    );
    const validStatuses: PenetrationTestStatus[] = [
      "not_run",
      "stale",
      "open_findings",
      "remediated",
    ];

    expect(penTestRecords.length).toBeGreaterThan(0);
    for (const finding of penTestRecords) {
      const evidence = finding.penetrationTestEvidence;

      expect(finding.domain).toBe("security_supply_chain");
      expect(evidence).not.toBeNull();
      if (!evidence) continue;

      expect(evidence.scope.length).toBeGreaterThan(20);
      expect(validStatuses).toContain(evidence.status);
      if (evidence.status === "not_run") {
        expect(evidence.testingFirm).toBeNull();
        expect(evidence.lastTestDate).toBeNull();
        expect(evidence.openHighCriticalFindings).toBeNull();
        expect(evidence.retestVerifiedDate).toBeNull();
      }
      if (evidence.status === "remediated") {
        expect(evidence.testingFirm).not.toBeNull();
        expect(evidence.lastTestDate).not.toBeNull();
        expect(evidence.openHighCriticalFindings).toBe(0);
        expect(evidence.retestVerifiedDate).not.toBeNull();
      }
      if (evidence.status === "open_findings") {
        expect(evidence.openHighCriticalFindings ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("keeps unproven penetration-test evidence in active investor review", () => {
    const unproven = demoDueDiligenceFindings.filter((finding) => {
      const evidence = finding.penetrationTestEvidence;
      return evidence !== null && evidence.status !== "remediated";
    });

    expect(unproven.length).toBeGreaterThan(0);
    for (const finding of unproven) {
      const proof =
        `${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase();

      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(proof).toMatch(/\bindependent\b/);
      expect(proof).toMatch(/\bpenetration test\b/);
    }
  });

  it("keeps active investor-blocking findings from looking dataroom-ready", () => {
    const blocking = demoDueDiligenceFindings.filter(
      (f) => f.investorMateriality === "blocking"
    );

    expect(blocking.length).toBeGreaterThan(0);
    for (const f of blocking) {
      expect(["critical", "high"]).toContain(f.severity);
      expect(["open", "mitigating"]).toContain(f.status);
      expect(f.dataroomStatus).not.toBe("ready");
    }
  });

  it("keeps all active findings out of ready dataroom status", () => {
    for (const f of demoDueDiligenceFindings) {
      const isActive = f.status === "open" || f.status === "mitigating";
      if (isActive) {
        expect(f.dataroomStatus).not.toBe("ready");
      }
    }
  });

  it("keeps 2026 investor scrutiny domains active until evidence is reviewed", () => {
    const highScrutinyDomains: DueDiligenceDomain[] = [
      "architecture_dependency",
      "security_supply_chain",
      "data_ai_governance",
    ];

    for (const domain of highScrutinyDomains) {
      const finding = demoDueDiligenceFindings.find(
        (f) =>
          f.domain === domain &&
          (f.status === "open" || f.status === "mitigating")
      );

      if (!finding) {
        throw new Error(`${domain} should have an active diligence item`);
      }

      expect(finding.investorQuestion.endsWith("?")).toBe(true);
      expect(finding.dataroomStatus).not.toBe("ready");
    }
  });

  it("requires human-review controls for unresolved customer-facing AI governance risk", () => {
    const finding = demoDueDiligenceFindings.find(
      (f) =>
        f.domain === "data_ai_governance" &&
        (f.status === "open" || f.status === "mitigating")
    );

    expect(finding).toBeDefined();
    if (!finding) return;

    const controlText = `${finding.finding} ${finding.impact} ${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase();

    expect(controlText).toContain("confidence");
    expect(controlText).toContain("human");
    expect(controlText).toContain("disclosure");
    expect(finding.dataroomStatus).not.toBe("ready");
  });

  it("preserves dataroom-ready examples without overstating unresolved risk", () => {
    const readyFindings = demoDueDiligenceFindings.filter(
      (f) => f.dataroomStatus === "ready"
    );

    expect(readyFindings.length).toBeGreaterThan(0);
    for (const f of readyFindings) {
      expect(["resolved", "accepted"]).toContain(f.status);
      expect(f.resolvedAt).toBeTruthy();
      expect(f.investorMateriality).not.toBe("blocking");
    }
  });

  it("resolved findings have a non-null resolvedAt date", () => {
    for (const f of demoDueDiligenceFindings) {
      if (f.status === "resolved" || f.status === "accepted") {
        expect(f.resolvedAt).toBeTruthy();
      }
    }
  });

  it("open and mitigating findings have no resolvedAt date", () => {
    for (const f of demoDueDiligenceFindings) {
      if (f.status === "open" || f.status === "mitigating") {
        expect(f.resolvedAt).toBeNull();
      }
    }
  });

  it("critical and high-severity findings include concrete recommendation text", () => {
    for (const f of demoDueDiligenceFindings) {
      if (f.severity === "critical" || f.severity === "high") {
        expect(f.recommendation.length).toBeGreaterThan(50);
      }
    }
  });

  it("keeps every finding tied to dataroom evidence and an owner", () => {
    for (const f of demoDueDiligenceFindings) {
      expect(f.executiveOwner.length).toBeGreaterThan(2);
      expect(f.evidenceArtifact.length).toBeGreaterThan(30);
      expect(Number.isNaN(Date.parse(f.targetRemediationDate))).toBe(false);
      expect(Date.parse(f.targetRemediationDate)).toBeGreaterThanOrEqual(
        Date.parse(f.discoveredAt)
      );
    }
  });

  it("costs every active diligence action for investor runway planning", () => {
    const activeFindings = demoDueDiligenceFindings.filter(
      (finding) => finding.status === "open" || finding.status === "mitigating"
    );
    const planCost = demoNinetyDayDiligencePlan.reduce(
      (total, finding) => total + finding.estimatedRemediationCostUsd,
      0
    );
    const activeCost = activeFindings.reduce(
      (total, finding) => total + finding.estimatedRemediationCostUsd,
      0
    );

    expect(activeFindings.length).toBeGreaterThan(0);
    expect(planCost).toBe(activeCost);
    expect(planCost).toBeGreaterThan(0);

    for (const finding of activeFindings) {
      expect(Number.isInteger(finding.estimatedRemediationCostUsd)).toBe(true);
      expect(finding.estimatedRemediationCostUsd).toBeGreaterThan(0);
    }
  });

  it("translates active diligence findings into annual revenue exposure", () => {
    const activeFindings = demoDueDiligenceFindings.filter(
      (finding) => finding.status === "open" || finding.status === "mitigating"
    );
    const reconciledRevenueRisk = activeFindings.reduce(
      (total, finding) => total + finding.estimatedAnnualRevenueAtRiskUsd,
      0
    );

    expect(activeFindings.length).toBeGreaterThan(0);
    expect(demoActiveAnnualRevenueAtRiskUsd).toBe(reconciledRevenueRisk);
    expect(demoActiveAnnualRevenueAtRiskUsd).toBeGreaterThan(0);

    for (const finding of activeFindings) {
      expect(Number.isInteger(finding.estimatedAnnualRevenueAtRiskUsd)).toBe(true);
      expect(finding.estimatedAnnualRevenueAtRiskUsd).toBeGreaterThan(0);
    }
  });

  it("gives active investor-blocking findings a near-term remediation target", () => {
    for (const f of demoDueDiligenceFindings) {
      const isActive = f.status === "open" || f.status === "mitigating";
      const isBlocking = f.severity === "critical" || f.severity === "high";

      if (isActive && isBlocking) {
        const days =
          (Date.parse(f.targetRemediationDate) - Date.parse(f.discoveredAt)) /
          (1000 * 60 * 60 * 24);

        expect(days).toBeLessThanOrEqual(30);
      }
    }
  });

  it("builds a date-sorted 90-day remediation plan for active findings", () => {
    expect(demoNinetyDayDiligencePlan.length).toBeGreaterThan(0);

    const activeIds = new Set(
      demoDueDiligenceFindings
        .filter((f) => f.status === "open" || f.status === "mitigating")
        .map((f) => f.id)
    );
    const targetDates = demoNinetyDayDiligencePlan.map((f) =>
      Date.parse(f.targetRemediationDate)
    );

    expect(targetDates).toEqual([...targetDates].sort((a, b) => a - b));

    for (const f of demoNinetyDayDiligencePlan) {
      const days = Math.ceil(
        (Date.parse(f.targetRemediationDate) - Date.parse(f.discoveredAt)) /
          (1000 * 60 * 60 * 24)
      );

      expect(activeIds.has(f.id)).toBe(true);
      expect(days).toBeLessThanOrEqual(90);
      expect(f.executiveOwner.length).toBeGreaterThan(2);
      expect(f.evidenceArtifact.length).toBeGreaterThan(30);
      expect(f.dataroomStatus).not.toBe("ready");
    }
  });

  it("shows tactical checkpoint specificity for investor-blocking findings", () => {
    const blockingFindings = demoDueDiligenceFindings.filter(
      (f) =>
        f.investorMateriality === "blocking" &&
        (f.status === "open" || f.status === "mitigating")
    );

    expect(blockingFindings.length).toBeGreaterThan(0);

    for (const finding of blockingFindings) {
      const fullText = `${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase();

      // Investor blocking findings must show concrete verification signals, not just
      // timelines. Examples: runbook titles, role assignments, test/drill records,
      // written consent tracking, external firm engagement, retest dates.
      const hasVerificationSignal =
        fullText.includes("runbook") ||
        fullText.includes("drill") ||
        fullText.includes("consent") ||
        fullText.includes("circuit") ||
        fullText.includes("handover") ||
        fullText.includes("retest") ||
        fullText.includes("acceptance") ||
        fullText.includes("evidence") ||
        fullText.includes("register") ||
        fullText.includes("template") ||
        fullText.includes("officer") ||
        fullText.includes("firm");

      expect(hasVerificationSignal).toBe(true);
    }
  });

  it("makes compliance certification evidence explicit and internally consistent", () => {
    const certificationRecords = demoDueDiligenceFindings.filter(
      (finding) => finding.complianceCertificationEvidence !== null
    );
    const validStatuses: ComplianceCertificationStatus[] = [
      "not_started",
      "in_progress",
      "certified",
      "expired",
    ];

    expect(certificationRecords.length).toBeGreaterThan(0);
    for (const finding of certificationRecords) {
      const evidence = finding.complianceCertificationEvidence;

      expect(["security_supply_chain", "data_ai_governance"]).toContain(
        finding.domain
      );
      expect(evidence).not.toBeNull();
      if (!evidence) continue;

      expect(evidence.framework.length).toBeGreaterThan(3);
      expect(evidence.scope.length).toBeGreaterThan(15);
      expect(validStatuses).toContain(evidence.status);
      expect(evidence.evidenceArtifact.toLowerCase()).toMatch(
        /register|assessment|report|letter|note|audit/
      );
      if (evidence.status === "certified") {
        expect(evidence.certificationDate).not.toBeNull();
      }
      if (evidence.status === "not_started") {
        expect(evidence.certificationDate).toBeNull();
      }
      if (evidence.status !== "certified" && evidence.expiryOrTargetDate !== null) {
        expect(Number.isNaN(Date.parse(evidence.expiryOrTargetDate))).toBe(false);
      }
    }
  });

  it("keeps uncertified compliance evidence in active investor review", () => {
    const uncertified = demoDueDiligenceFindings.filter((finding) => {
      const evidence = finding.complianceCertificationEvidence;
      return evidence !== null && evidence.status !== "certified";
    });

    expect(uncertified.length).toBeGreaterThan(0);
    for (const finding of uncertified) {
      const evidence = finding.complianceCertificationEvidence;
      const proof =
        `${finding.recommendation} ${finding.evidenceArtifact}`.toLowerCase();

      expect(evidence).not.toBeNull();
      if (!evidence) continue;

      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(proof).toMatch(
        /audit|certification|privacy|gdpr|soc 2|iso|readiness|ai act/
      );
      expect(`${evidence.evidenceArtifact} ${evidence.framework}`.toLowerCase()).toMatch(
        /soc 2|gdpr|ccpa|iso|ai act/
      );
    }
  });

  it("covers both security certification and privacy readiness frameworks", () => {
    const frameworks = demoDueDiligenceFindings
      .map((finding) => finding.complianceCertificationEvidence?.framework ?? "")
      .filter((framework) => framework.length > 0)
      .map((framework) => framework.toLowerCase());

    expect(frameworks.length).toBeGreaterThanOrEqual(2);
    expect(
      frameworks.some(
        (framework) => framework.includes("soc 2") || framework.includes("iso")
      )
    ).toBe(true);
    expect(
      frameworks.some(
        (framework) =>
          framework.includes("gdpr") ||
          framework.includes("ccpa") ||
          framework.includes("ai act")
      )
    ).toBe(true);
  });
  it("makes IP assignment coverage evidence-backed", () => {
    const ipEvidence = demoDueDiligenceFindings.filter(
      (finding) => finding.intellectualPropertyAssignmentEvidence !== null
    );
    const validStatuses: IpAssignmentCoverageStatus[] = [
      "missing",
      "partial",
      "verified",
    ];

    expect(ipEvidence.length).toBeGreaterThan(0);
    for (const finding of ipEvidence) {
      const evidence = finding.intellectualPropertyAssignmentEvidence;

      expect(finding.domain).toBe("intellectual_property");
      expect(evidence).not.toBeNull();
      if (!evidence) continue;

      expect(evidence.contributorClass.length).toBeGreaterThan(10);
      expect(Number.isInteger(evidence.totalContributors)).toBe(true);
      expect(Number.isInteger(evidence.signedAssignmentCount)).toBe(true);
      expect(evidence.totalContributors).toBeGreaterThan(0);
      expect(evidence.signedAssignmentCount).toBeGreaterThanOrEqual(0);
      expect(evidence.signedAssignmentCount).toBeLessThanOrEqual(
        evidence.totalContributors
      );
      expect(validStatuses).toContain(evidence.status);
      expect(evidence.evidenceArtifact.toLowerCase()).toMatch(
        /piia|assignment|register/
      );
    }
  });

  it("keeps unsigned-contributor IP gaps in active investor review", () => {
    const incompleteAssignments = demoDueDiligenceFindings.filter((finding) => {
      const evidence = finding.intellectualPropertyAssignmentEvidence;
      return (
        evidence !== null &&
        evidence.signedAssignmentCount < evidence.totalContributors
      );
    });

    expect(incompleteAssignments.length).toBeGreaterThan(0);
    for (const finding of incompleteAssignments) {
      const evidence = finding.intellectualPropertyAssignmentEvidence;
      expect(evidence).not.toBeNull();
      if (!evidence) continue;

      const proof =
        `${finding.recommendation} ${finding.evidenceArtifact} ${evidence.evidenceArtifact}`.toLowerCase();

      expect(finding.investorMateriality).toBe("blocking");
      expect(["open", "mitigating"]).toContain(finding.status);
      expect(finding.dataroomStatus).not.toBe("ready");
      expect(proof).toMatch(/assignment|piia|work-for-hire/);
    }
  });

});

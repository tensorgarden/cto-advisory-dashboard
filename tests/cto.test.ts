import { describe, it, expect } from "vitest";
import {
  demoADRs,
  demoTechAssessments,
  demoRoadmap,
  demoTeamHealth,
  demoEngineeringKPIs,
  demoDueDiligenceFindings,
} from "@/lib/demo-data";
import type {
  DataroomStatus,
  DueDiligenceDomain,
  InvestorMateriality,
  TechCategory,
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
  it("has exactly 6 findings covering every diligence domain", () => {
    expect(demoDueDiligenceFindings.length).toBe(6);
    const domains = new Set(demoDueDiligenceFindings.map((f) => f.domain));
    const expected: DueDiligenceDomain[] = [
      "delivery_health",
      "architecture_dependency",
      "security_supply_chain",
      "data_ai_governance",
      "operational_resilience",
      "leadership_accountability",
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
});

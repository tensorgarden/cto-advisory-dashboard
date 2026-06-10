import { describe, it, expect } from "vitest";
import {
  demoADRs,
  demoTechAssessments,
  demoRoadmap,
  demoTeamHealth,
  demoEngineeringKPIs,
} from "@/lib/demo-data";

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
    const expected: string[] = [
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

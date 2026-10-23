import { describe, expect, it } from "vitest";
import { OBERTOENE, abklingzeit, filterEnde, filterStart, gainVonProzent, huelle } from "./Klavier.ts";

describe("Klavierklang", () => {
  it("hat starke Grundtöne und leiser werdende Obertöne", () => {
    expect(OBERTOENE[0]).toBe(1);
    for (let i = 1; i < OBERTOENE.length; i++) expect(OBERTOENE[i]).toBeLessThan(OBERTOENE[i - 1] ?? 0);
  });

  it("klingt hoch schneller ab als tief, in festen Grenzen", () => {
    expect(abklingzeit(130)).toBeGreaterThan(abklingzeit(523));
    expect(abklingzeit(20)).toBeLessThanOrEqual(1.6);
    expect(abklingzeit(5000)).toBeGreaterThanOrEqual(0.25);
  });

  it("lässt den Pegel bis zum Loslassen abklingen, aber nie auf null", () => {
    const kurz = huelle(262, 0.2, 0.3);
    const lang = huelle(262, 2, 0.3);
    expect(kurz.spitze).toBeCloseTo(0.3, 6);
    expect(lang.beiLoslassen).toBeLessThan(kurz.beiLoslassen);
    expect(lang.beiLoslassen).toBeGreaterThan(0);
    expect(huelle(262, 100, 0.3).beiLoslassen).toBeGreaterThanOrEqual(0.0002);
  });

  it("macht den Ton nach dem Anschlag dumpfer", () => {
    for (const hz of [131, 262, 523, 1047]) expect(filterEnde(hz)).toBeLessThan(filterStart(hz));
  });

  it("rechnet Prozent in eine steigende Verstärkung um", () => {
    expect(gainVonProzent(0)).toBe(0);
    expect(gainVonProzent(100)).toBe(1);
    expect(gainVonProzent(50)).toBeCloseTo(0.25, 6);
    expect(gainVonProzent(-5)).toBe(0);
    expect(gainVonProzent(150)).toBe(1);
  });
});

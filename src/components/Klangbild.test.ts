import { describe, expect, it } from "vitest";
import {
  MAX_GAIN,
  MAX_HZ,
  MIN_HZ,
  beschreibung,
  gainVon,
  hzZuSlider,
  lautWort,
  perioden,
  sliderZuHz,
  tonText,
  welle,
} from "./Klangbild.ts";

describe("welle", () => {
  it("liefert die gewünschte Zahl Punkte", () => {
    expect(welle("sine", 4, 1, 100)).toHaveLength(100);
  });

  it("Sinus beginnt bei 0 und erreicht ±1", () => {
    const y = welle("sine", 4, 1, 401);
    expect(y[0]).toBeCloseTo(0);
    expect(Math.max(...y)).toBeCloseTo(1, 2);
    expect(Math.min(...y)).toBeCloseTo(-1, 2);
  });

  it("Rechteck hat nur die Werte +1 und −1", () => {
    for (const w of welle("square", 3, 1, 300)) expect(Math.abs(w)).toBe(1);
  });

  it("Dreieck und Sägezahn bleiben zwischen −1 und 1 und erreichen die Ränder", () => {
    for (const form of ["triangle", "sawtooth"] as const) {
      const y = welle(form, 5, 1, 1001);
      expect(Math.max(...y)).toBeCloseTo(1, 1);
      expect(Math.min(...y)).toBeCloseTo(-1, 1);
      for (const w of y) expect(Math.abs(w)).toBeLessThanOrEqual(1);
    }
  });

  it("Amplitude skaliert die Höhe; bei 0 ist die Welle flach", () => {
    expect(Math.max(...welle("sine", 3, 0.5, 301))).toBeCloseTo(0.5, 2);
    expect(welle("square", 3, 0, 50).every((w) => w === 0)).toBe(true);
  });

  it("mehr Perioden bedeuten mehr Nulldurchgänge", () => {
    const wechsel = (y: number[]) => y.slice(1).filter((w, i) => Math.sign(w) !== Math.sign(y[i] ?? 0)).length;
    expect(wechsel(welle("sine", 6, 1, 600))).toBeGreaterThan(wechsel(welle("sine", 3, 1, 600)));
  });
});

describe("Tonhöhe und Regler", () => {
  it("Enden des Reglers sind 130 und 1050 Hz", () => {
    expect(sliderZuHz(0)).toBeCloseTo(MIN_HZ);
    expect(sliderZuHz(1)).toBeCloseTo(MAX_HZ);
  });

  it("ist logarithmisch: Mitte ist das geometrische Mittel", () => {
    expect(sliderZuHz(0.5)).toBeCloseTo(Math.sqrt(MIN_HZ * MAX_HZ), 5);
  });

  it("Rundlauf Hz → Regler → Hz", () => {
    for (const hz of [130, 200, 262, 440, 700, 1050]) expect(sliderZuHz(hzZuSlider(hz))).toBeCloseTo(hz, 6);
    for (const p of [0, 0.25, 0.5, 0.9, 1]) expect(hzZuSlider(sliderZuHz(p))).toBeCloseTo(p, 6);
  });

  it("zeigt 3 bis 6 Perioden, mehr bei höherem Ton", () => {
    expect(perioden(130)).toBeCloseTo(3);
    expect(perioden(1050)).toBeCloseTo(6);
    expect(perioden(500)).toBeGreaterThan(perioden(262));
  });

  it("benennt die kleine Oktave ohne Hochzahl 0", () => {
    expect(tonText(-12, "c⁰")).toBe("c");
    expect(tonText(0, "c¹")).toBe("c¹");
  });
});

describe("Lautstärke", () => {
  it("Wörter", () => {
    expect(lautWort(0)).toBe("leise");
    expect(lautWort(30)).toBe("leise");
    expect(lautWort(50)).toBe("mittel");
    expect(lautWort(90)).toBe("laut");
    expect(lautWort(100)).toBe("laut");
  });

  it("Gain bleibt klein", () => {
    expect(gainVon(0)).toBe(0);
    expect(gainVon(100)).toBeCloseTo(MAX_GAIN);
    expect(gainVon(500)).toBeLessThanOrEqual(MAX_GAIN);
    expect(gainVon(30)).toBeCloseTo(0.09);
  });

  it("beschreibt die Welle", () => {
    expect(beschreibung(262, 50, "sine")).toBe("Welle: 262 Hz, mittel laut, Sinus");
    expect(beschreibung(440.4, 10, "sawtooth")).toBe("Welle: 440 Hz, leise, Sägezahn");
  });
});

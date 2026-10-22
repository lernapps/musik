import { describe, expect, it } from "vitest";
import {
  betonung,
  frequenz,
  gegenname,
  intervallName,
  istSchwarz,
  name,
  nameMitOktave,
  tonleiter,
  viertelDauer,
  zufall,
} from "./Musik.ts";

describe("Musik", () => {
  it("a¹ ist 440 Hz, c¹ etwa 261,6 Hz", () => {
    expect(frequenz(9)).toBeCloseTo(440, 6);
    expect(frequenz(0)).toBeCloseTo(261.63, 2);
    expect(frequenz(12)).toBeCloseTo(2 * frequenz(0), 6);
  });

  it("benennt Töne und schwarze Tasten", () => {
    expect(name(0)).toBe("C");
    expect(name(11)).toBe("H");
    expect(name(13)).toBe("Cis");
    expect(gegenname(13)).toBe("Des");
    expect(gegenname(10)).toBe("B");
    expect(gegenname(0)).toBe("");
    expect(istSchwarz(1)).toBe(true);
    expect(istSchwarz(4)).toBe(false);
    expect(nameMitOktave(0)).toBe("c¹");
    expect(nameMitOktave(14)).toBe("d²");
    expect(nameMitOktave(24)).toBe("c³");
  });

  it("baut Dur und Moll aus Ganz- und Halbtonschritten", () => {
    expect(tonleiter(0, "dur").map(name)).toEqual(["C", "D", "E", "F", "G", "A", "H", "C"]);
    expect(tonleiter(9, "moll").map(name)).toEqual(["A", "H", "C", "D", "E", "F", "G", "A"]);
    expect(tonleiter(7, "dur").map(name)).toEqual(["G", "A", "H", "C", "D", "E", "Fis", "G"]);
  });

  it("nennt Intervalle nach Halbtönen", () => {
    expect(intervallName(0)).toBe("Prime");
    expect(intervallName(4)).toBe("große Terz");
    expect(intervallName(7)).toBe("Quinte");
    expect(intervallName(12)).toBe("Oktave");
    expect(intervallName(6)).toBe("");
  });

  it("betont den ersten Schlag", () => {
    expect(betonung("4/4", 0)).toBe(2);
    expect(betonung("4/4", 2)).toBe(1);
    expect(betonung("3/4", 2)).toBe(0);
    expect(viertelDauer(120)).toBe(0.5);
  });

  it("zieht bei gleichem Samen gleiche Zahlen", () => {
    const a = zufall(7);
    const b = zufall(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(zufall(1)()).not.toBe(zufall(2)());
  });
});

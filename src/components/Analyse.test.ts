import { describe, expect, it } from "vitest";
import { cent, einsaetze, getroffen, naechsterTon, tonhoehe, vergleiche } from "./Analyse.ts";
import { frequenz, name } from "./Musik.ts";

const RATE = 44100;

function sinus(hz: number, sekunden = 0.1, laut = 0.5): Float32Array {
  const block = new Float32Array(Math.floor(RATE * sekunden));
  for (let i = 0; i < block.length; i++) block[i] = laut * Math.sin((2 * Math.PI * hz * i) / RATE);
  return block;
}

describe("tonhoehe", () => {
  it("findet Töne einer Kinder- und Erwachsenenstimme", () => {
    for (const hz of [196, 262, 330, 440, 523]) {
      expect(tonhoehe(sinus(hz), RATE)).toBeCloseTo(hz, 0);
    }
  });

  it("findet den Grundton eines Klangs mit Obertönen", () => {
    const klang = sinus(220);
    const ober = sinus(440, 0.1, 0.3);
    const drittel = sinus(660, 0.1, 0.2);
    for (let i = 0; i < klang.length; i++) klang[i] = (klang[i] ?? 0) + (ober[i] ?? 0) + (drittel[i] ?? 0);
    expect(Math.abs(cent(tonhoehe(klang, RATE), 220))).toBeLessThan(10);
  });

  it("meldet Stille und Rauschen als keinen Ton", () => {
    expect(tonhoehe(new Float32Array(4410), RATE)).toBe(0);
    let z = 12345;
    const rauschen = new Float32Array(4410).map(() => {
      z = (z * 1103515245 + 12345) & 0x7fffffff;
      return (z / 0x7fffffff - 0.5) * 0.6;
    });
    expect(tonhoehe(rauschen, RATE)).toBe(0);
  });
});

describe("Töne treffen", () => {
  it("rechnet Abweichungen in Cent", () => {
    expect(cent(440, 440)).toBe(0);
    expect(cent(880, 440)).toBeCloseTo(1200, 6);
    expect(cent(frequenz(1), frequenz(0))).toBeCloseTo(100, 6);
  });

  it("findet den nächsten Ton", () => {
    const { ton, cent: abw } = naechsterTon(330);
    expect(name(ton)).toBe("E");
    expect(Math.abs(abw)).toBeLessThan(20);
    expect(naechsterTon(frequenz(7) * 1.01).ton).toBe(7);
  });

  it("lässt einen halben Halbton Spielraum", () => {
    expect(getroffen(frequenz(4) * 1.01, frequenz(4))).toBe(true);
    expect(getroffen(frequenz(5), frequenz(4))).toBe(false);
    expect(getroffen(0, frequenz(4))).toBe(false);
  });
});

describe("Klatschen", () => {
  it("findet Einsätze als Sprünge der Lautstärke", () => {
    const l = Array.from({ length: 100 }, () => 0.01);
    for (const i of [10, 30, 50]) {
      l[i] = 0.6;
      l[i + 1] = 0.3;
    }
    expect(einsaetze(l, 0.01).map((z) => Math.round(z * 100))).toEqual([10, 30, 50]);
  });

  it("zählt einen Nachhall nicht doppelt", () => {
    const l = Array.from({ length: 60 }, () => 0.01);
    l[10] = 0.5;
    l[11] = 0.1;
    l[12] = 0.5;
    expect(einsaetze(l, 0.01)).toHaveLength(1);
  });

  it("vergleicht Klatschen mit dem Muster", () => {
    const soll = [0, 0.5, 1, 1.5];
    expect(vergleiche(soll, [0.02, 0.48, 1.05, 1.52])).toEqual({ getroffen: 4, verfehlt: 0, zuviel: 0 });
    expect(vergleiche(soll, [0, 0.5, 1.5, 1.8])).toEqual({ getroffen: 3, verfehlt: 1, zuviel: 1 });
    expect(vergleiche(soll, [])).toEqual({ getroffen: 0, verfehlt: 4, zuviel: 0 });
  });
});

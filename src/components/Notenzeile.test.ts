import { describe, expect, it } from "vitest";
import {
  anzahlHilfslinien,
  ansageNote,
  beschriftung,
  bricheZeilen,
  gesamtdauer,
  halsNachUnten,
  hatKreuz,
  hilfslinienLagen,
  lage,
  plane,
  startzeiten,
  taktstriche,
  type Zeichen,
} from "./Notenzeile.ts";

describe("Notenzeile: Lage auf dem System", () => {
  it("e¹ liegt auf der unteren Linie, g¹ auf der zweiten, f² auf der obersten", () => {
    expect(lage(4)).toBe(0);
    expect(lage(7)).toBe(2);
    expect(lage(17)).toBe(8);
  });
  it("f¹ liegt im ersten Zwischenraum, h¹ auf der mittleren Linie", () => {
    expect(lage(5)).toBe(1);
    expect(lage(11)).toBe(4);
  });
  it("c¹ braucht eine Hilfslinie, d¹ keine, a² oben braucht eine", () => {
    expect(anzahlHilfslinien(0)).toBe(1);
    expect(anzahlHilfslinien(2)).toBe(0);
    expect(anzahlHilfslinien(21)).toBe(1);
    expect(anzahlHilfslinien(19)).toBe(0);
    expect(anzahlHilfslinien(24)).toBe(2);
    expect(hilfslinienLagen(0)).toEqual([-2]);
    expect(hilfslinienLagen(21)).toEqual([10]);
    expect(hilfslinienLagen(7)).toEqual([]);
  });
  it("schwarze Tasten stehen auf der Stufe darunter mit ♯", () => {
    expect(hatKreuz(1)).toBe(true);
    expect(lage(1)).toBe(lage(0));
    expect(hatKreuz(2)).toBe(false);
    expect(lage(6)).toBe(lage(5));
  });
  it("der Hals zeigt ab h¹ nach unten", () => {
    expect(halsNachUnten(9)).toBe(false);
    expect(halsNachUnten(11)).toBe(true);
    expect(halsNachUnten(0)).toBe(false);
    expect(halsNachUnten(21)).toBe(true);
  });
});

const folge: Zeichen[] = [
  { ton: 0, wert: "viertel" },
  { ton: 2, wert: "halbe" },
  { ton: 4, wert: "achtel" },
  { ton: 5, wert: "achtel", pause: true },
];

describe("Notenzeile: Zeit", () => {
  it("berechnet Startzeiten bei Tempo 60", () => {
    expect(startzeiten(folge, 60)).toEqual([
      { start: 0, dauer: 1 },
      { start: 1, dauer: 2 },
      { start: 3, dauer: 0.5 },
      { start: 3.5, dauer: 0.5 },
    ]);
    expect(gesamtdauer(folge, 60)).toBe(4);
  });
  it("schneller bei höherem Tempo; Ganze dauert vier Viertel", () => {
    expect(startzeiten([{ ton: 0, wert: "ganze" }], 120)[0]?.dauer).toBe(2);
    expect(gesamtdauer([], 80)).toBe(0);
  });
});

describe("Notenzeile: Taktstriche", () => {
  const viertel = (n: number): Zeichen[] => Array.from({ length: n }, () => ({ ton: 4, wert: "viertel" }));
  it("setzt nach vollen Takten einen Strich", () => {
    expect(taktstriche(viertel(8), "4/4")).toEqual([3, 7]);
    expect(taktstriche(viertel(6), "3/4")).toEqual([2, 5]);
    expect(taktstriche(viertel(5), "2/4")).toEqual([1, 3]);
  });
  it("zählt Achtel und Halbe mit und lässt bei „ohne“ alles weg", () => {
    const z: Zeichen[] = [
      { ton: 4, wert: "halbe" },
      { ton: 4, wert: "achtel" },
      { ton: 4, wert: "achtel" },
      { ton: 4, wert: "viertel" },
    ];
    expect(taktstriche(z, "4/4")).toEqual([3]);
    expect(taktstriche(z, "ohne")).toEqual([]);
  });
});

describe("Notenzeile: Zeilenumbruch und Plan", () => {
  it("bricht nach Platz und nach höchstens maxProZeile Noten", () => {
    expect(bricheZeilen([50, 50, 50, 50], { erste: 120, andere: 120, maxProZeile: 12 })).toEqual([
      [0, 2],
      [2, 4],
    ]);
    expect(bricheZeilen([10, 10, 10, 10, 10], { erste: 1000, andere: 1000, maxProZeile: 2 })).toEqual([
      [0, 2],
      [2, 4],
      [4, 5],
    ]);
    expect(bricheZeilen([], { erste: 100, andere: 100, maxProZeile: 3 })).toEqual([]);
    expect(bricheZeilen([500], { erste: 100, andere: 100, maxProZeile: 3 })).toEqual([[0, 1]]);
  });
  it("legt viele Noten auf mehrere Zeilen, nie mehr als zwölf je Zeile", () => {
    const viele: Zeichen[] = Array.from({ length: 30 }, () => ({ ton: 4, wert: "achtel" }));
    const plan = plane(viele, "4/4");
    expect(plan.zeilen.length).toBeGreaterThan(1);
    for (const z of plan.zeilen) expect(z.plaetze.length).toBeLessThanOrEqual(12);
    expect(plan.zeilen.flatMap((z) => z.plaetze).map((p) => p.index)).toEqual(viele.map((_, i) => i));
    expect(plan.hoehe).toBeGreaterThan(plan.zeilen[0]?.hoehe ?? 0);
  });
  it("hält eine kurze Zeile bei 360 Einheiten Breite", () => {
    const plan = plane(folge, "4/4");
    expect(plan.breite).toBe(360);
    expect(plan.zeilen).toHaveLength(1);
    expect(plan.zeilen[0]?.taktangabe).toBe(true);
  });
  it("verbindet zwei benachbarte Achtel auf dem Schlag mit einem Balken", () => {
    const z: Zeichen[] = [
      { ton: 4, wert: "achtel" },
      { ton: 5, wert: "achtel" },
      { ton: 4, wert: "achtel" },
      { ton: 5, wert: "viertel" },
    ];
    const p = plane(z, "ohne").zeilen[0]?.plaetze ?? [];
    expect(p[0]?.balken).toBeDefined();
    expect(p[1]?.fahne).toBe(false);
    expect(p[2]?.fahne).toBe(true);
    expect(p[2]?.balken).toBeUndefined();
  });
  it("gibt Ganzen keinen Hals und Pausen weder Hals noch Hilfslinie", () => {
    const p = plane(
      [
        { ton: 0, wert: "ganze" },
        { ton: 0, wert: "viertel", pause: true },
        { ton: 0, wert: "viertel" },
      ],
      "ohne",
    ).zeilen[0]?.plaetze;
    expect(p?.[0]?.hals).toBeUndefined();
    expect(p?.[1]?.hals).toBeUndefined();
    expect(p?.[1]?.hilfslinien).toEqual([]);
    expect(p?.[2]?.hals).toBeDefined();
  });
  it("zeichnet eine leere Zeile ohne Fehler", () => {
    expect(plane([], "ohne").zeilen).toHaveLength(1);
  });
});

describe("Notenzeile: Texte", () => {
  it("beschriftet und sagt an", () => {
    expect(beschriftung({ ton: 4, wert: "viertel" })).toBe("Note e¹, Viertel");
    expect(ansageNote({ ton: 4, wert: "viertel" })).toBe("e¹ (E), Viertelnote");
    expect(ansageNote({ ton: 1, wert: "halbe" })).toBe("cis¹ (Cis), Halbe Note");
    expect(beschriftung({ ton: 0, wert: "halbe", pause: true })).toBe("Pause, Halbe");
  });
});

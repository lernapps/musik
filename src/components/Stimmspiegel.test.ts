import { describe, expect, it } from "vitest";
import { tonhoehe } from "./Analyse.ts";
import { frequenz, name } from "./Musik.ts";
import {
  HALTEZEIT,
  WEISSE_TOENE,
  auswahlName,
  eigeneAnzahl,
  melodie,
  standardMelodie,
  abbilden,
  centText,
  fortschritt,
  gehalten,
  glaettung,
  imBand,
  neuerLauf,
  rueckmeldung,
  verlaufKuerzen,
  weiter,
  zuordnen,
} from "./Stimmspiegel.ts";
import type { Lauf, Probe } from "./Stimmspiegel.ts";

const RATE = 44100;

function sinus(hz: number, sekunden = 0.1, laut = 0.5): Float32Array {
  const block = new Float32Array(Math.floor(RATE * sekunden));
  for (let i = 0; i < block.length; i++) block[i] = laut * Math.sin((2 * Math.PI * hz * i) / RATE);
  return block;
}

/** Läuft `sekunden` in Schritten von 0,05 s mit gleichbleibendem `treffer`. */
function lauf(start: Lauf, treffer: boolean, sekunden: number): Lauf {
  let l = start;
  for (let i = 0; i < Math.round(sekunden / 0.05); i++) l = weiter(l, treffer, 0.05);
  return l;
}

describe("Zuordnung Hz → Halbton und Cent", () => {
  it("erkennt einen gesungenen Sinuston und ordnet ihn zu", () => {
    const hz = tonhoehe(sinus(frequenz(4)), RATE);
    const z = zuordnen(hz, 4, false);
    expect(z.ton).toBe(4);
    expect(name(z.ton)).toBe("E");
    expect(Math.abs(z.abweichung)).toBeLessThan(5);
  });

  it("rechnet die Abweichung in Cent, positiv heißt zu hoch", () => {
    expect(zuordnen(frequenz(4) * 2 ** (20 / 1200), 4, false).abweichung).toBeCloseTo(20, 6);
    expect(zuordnen(frequenz(4) * 2 ** (-20 / 1200), 4, false).abweichung).toBeCloseTo(-20, 6);
    expect(zuordnen(frequenz(5), 4, false).abweichung).toBeCloseTo(100, 6);
  });

  it("ist mit ohneOktave von der Oktave unabhängig", () => {
    for (const oktave of [-12, 0, 12]) {
      const hz = tonhoehe(sinus(frequenz(4 + oktave)), RATE);
      const z = zuordnen(hz, 4, true);
      expect(Math.abs(z.abweichung)).toBeLessThan(5);
      expect(z.ziel).toBe(4 + oktave);
    }
  });

  it("zeigt das Ziel in der Oktave, die der Stimme am nächsten liegt, und rechnet modulo 12", () => {
    const tief = zuordnen(frequenz(4 - 12 + 0.3), 4, true);
    expect(tief.ziel).toBe(-8);
    expect(tief.abweichung).toBeCloseTo(30, 6);
    const hoch = zuordnen(frequenz(3 + 12 + 0.5), 4, true);
    expect(hoch.ziel).toBe(16);
    expect(hoch.abweichung).toBeCloseTo(-50, 6);
  });

  it("zählt ohne ohneOktave die Oktave mit", () => {
    expect(zuordnen(frequenz(16), 4, false).abweichung).toBeCloseTo(1200, 6);
    expect(imBand(zuordnen(frequenz(16), 4, false).abweichung)).toBe(false);
    expect(imBand(zuordnen(frequenz(16), 4, true).abweichung)).toBe(true);
  });

  it("zieht das Band bei ±50 Cent", () => {
    expect(imBand(50)).toBe(true);
    expect(imBand(-50)).toBe(true);
    expect(imBand(51)).toBe(false);
    expect(imBand(-80)).toBe(false);
  });
});

describe("Treffer-Zustandsautomat", () => {
  it("braucht 0,4 s am Stück im Band", () => {
    expect(lauf(neuerLauf(1), true, 0.35).fertig).toBe(false);
    const l = lauf(neuerLauf(1), true, HALTEZEIT);
    expect(l.fertig).toBe(true);
    expect(l.getroffen).toEqual([true]);
    expect(gehalten(l)).toBe(true);
  });

  it("beginnt von vorn, wenn die Stimme das Band verlässt oder still ist", () => {
    let l = lauf(neuerLauf(1), true, 0.35);
    l = weiter(l, false, 0.05);
    expect(l.imBand).toBe(0);
    l = lauf(l, true, 0.35);
    expect(l.fertig).toBe(false);
    expect(lauf(l, true, 0.1).fertig).toBe(true);
  });

  it("geht in der Folge nach einer Pause von 0,3 s zum nächsten Ton", () => {
    let l = lauf(neuerLauf(3), true, 0.4);
    expect(l.getroffen).toEqual([true, false, false]);
    expect(l.index).toBe(0);
    expect(l.pause).toBeGreaterThan(0);
    // In der Pause zählt nichts.
    l = lauf(l, true, 0.2);
    expect(l.index).toBe(0);
    l = lauf(l, true, 0.1);
    expect(l.index).toBe(1);
    expect(l.imBand).toBe(0);
    expect(fortschritt(l)).toBe("Ton 2 von 3");
  });

  it("ist nach dem letzten Treffer fertig und zählt dann nicht weiter", () => {
    let l = neuerLauf(2);
    for (let i = 0; i < 2; i++) {
      l = lauf(l, true, 0.4);
      l = lauf(l, true, 0.3);
    }
    expect(l.fertig).toBe(true);
    expect(l.getroffen).toEqual([true, true]);
    expect(weiter(l, false, 1)).toBe(l);
    expect(fortschritt(l)).toBe("Ton 2 von 2");
  });

  it("verändert den alten Zustand nicht", () => {
    const l = neuerLauf(2);
    weiter(l, true, 0.5);
    expect(l.getroffen).toEqual([false, false]);
  });
});

describe("Rückmeldung", () => {
  const hz = (cent: number, ton = 4): number => frequenz(ton) * 2 ** (cent / 1200);

  it("wählt die Wörter nach dem Abstand", () => {
    expect(rueckmeldung(hz(5), 4, true, false)).toBe("Du singst gerade: E, genau (+5 Cent)");
    expect(rueckmeldung(hz(-15), 4, true, false)).toBe("Du singst gerade: E, genau (−15 Cent)");
    expect(rueckmeldung(hz(-20), 4, true, false)).toBe("Du singst gerade: E, ein wenig zu tief (−20 Cent)");
    expect(rueckmeldung(hz(30), 4, true, false)).toBe("Du singst gerade: E, ein wenig zu hoch (+30 Cent)");
  });

  it("sagt „getroffen“, wenn der Ton gehalten wurde", () => {
    expect(rueckmeldung(hz(10), 4, true, true)).toBe("Du singst gerade: E, getroffen!");
  });

  it("nennt über 50 Cent den Nachbarton und das Ziel", () => {
    expect(rueckmeldung(hz(130), 4, true, true)).toBe("Du singst gerade: F, zu hoch (+130 Cent). Gesucht: E.");
    expect(rueckmeldung(hz(-120), 4, true, false)).toContain("Dis, zu tief (−120 Cent). Gesucht: E.");
  });

  it("meldet Stille", () => {
    expect(rueckmeldung(0, 4, true, false)).toBe("Kein Ton zu hören.");
  });

  it("nennt mit Oktave auch die Oktave", () => {
    expect(rueckmeldung(frequenz(16), 4, false, false)).toBe(
      "Du singst gerade: e², zu hoch (+1200 Cent). Gesucht: e¹.",
    );
  });

  it("schreibt Cent mit Vorzeichen", () => {
    expect(centText(0.2)).toBe("0");
    expect(centText(20.4)).toBe("+20");
    expect(centText(-19.6)).toBe("−20");
  });
});

describe("Verlauf", () => {
  const proben: Probe[] = [0, 1, 2, 3, 4, 5, 6, 7].map((t) => ({ t, halbton: 4 + t * 0.1 }));

  it("behält nur die letzten Sekunden", () => {
    expect(verlaufKuerzen(proben, 7, 6).map((p) => p.t)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("glättet mit dem Median der letzten halben Sekunde", () => {
    const p: Probe[] = [
      { t: 0, halbton: 10 },
      { t: 0.8, halbton: 4 },
      { t: 0.85, halbton: 4.2 },
      { t: 0.9, halbton: 9 },
    ];
    expect(glaettung(p, 1)).toBeCloseTo(frequenz(4.2 + 0), 6);
    expect(glaettung(p, 3)).toBe(0);
  });

  it("bildet Zeit nach rechts und Höhe nach oben ab, rechts ist jetzt", () => {
    const a = abbilden(
      [
        { t: 0, halbton: 2 },
        { t: 6, halbton: 6 },
      ],
      6,
      4,
      true,
    );
    const [erster, zweiter] = a.punkte;
    expect(erster?.x).toBeCloseTo(34, 0);
    expect(zweiter?.x).toBeCloseTo(350, 0);
    expect((erster?.y ?? 0) > (zweiter?.y ?? 0)).toBe(true);
  });

  it("hält die Stimme und das Zielband immer im Bild", () => {
    for (const halbtonWert of [-10, 4, 30]) {
      const a = abbilden([{ t: 1, halbton: halbtonWert }], 1, 4, true);
      const punkt = a.punkte[0];
      expect(punkt?.y ?? -1).toBeGreaterThanOrEqual(10);
      expect(punkt?.y ?? 999).toBeLessThanOrEqual(148);
      expect(a.band.y).toBeGreaterThanOrEqual(10);
      expect(a.band.y + a.band.hoehe).toBeLessThanOrEqual(148.1);
    }
  });

  it("legt das Zielband ±50 Cent um die Ziellinie", () => {
    const a = abbilden([], 0, 4, true);
    expect(a.band.y + a.band.hoehe / 2).toBeCloseTo(a.zielY, 0);
    const pro = (148 - 10) / (a.bis - a.von);
    expect(a.band.hoehe).toBeCloseTo(pro, 0);
  });

  it("unterbricht die Linie bei Pausen und beschriftet die Achse mit Tonnamen", () => {
    const a = abbilden(
      [
        { t: 1, halbton: 4 },
        { t: 1.05, halbton: 4 },
        { t: 3, halbton: 5 },
      ],
      3,
      4,
      true,
    );
    expect(a.linien).toHaveLength(2);
    expect(a.ticks.some((t) => t.text === "E")).toBe(true);
    expect(a.ticks.length).toBeLessThanOrEqual(10);
  });
});

describe("Eigene Melodie", () => {
  it("begrenzt die Anzahl auf 0 oder 2 bis 6", () => {
    expect([0, -1, 1, 2, 4, 6, 9].map(eigeneAnzahl)).toEqual([0, 0, 2, 2, 4, 6, 6]);
  });

  it("hat die Voreinstellung C D E G, gekürzt oder verlängert", () => {
    expect(
      standardMelodie(4)
        .map((t) => name(t))
        .join(" "),
    ).toBe("C D E G");
    expect(standardMelodie(2)).toEqual([0, 2]);
    expect(standardMelodie(6)).toHaveLength(6);
    expect(standardMelodie(0)).toEqual([]);
  });

  it("baut die Folge aus der Auswahl und füllt Lücken auf", () => {
    expect(melodie([7, 5, 4], 3)).toEqual([7, 5, 4]);
    expect(melodie([7], 4)).toEqual([7, 2, 4, 7]);
    expect(melodie([7, 5, 4, 2], 2)).toEqual([7, 5]);
    expect(melodie([3, 99], 2)).toEqual([0, 2]);
  });

  it("bietet die weißen Töne von c¹ bis c² an", () => {
    expect(WEISSE_TOENE.map((t) => name(t)).join("")).toBe("CDEFGAHC");
    expect(auswahlName(0)).toBe("C (c¹)");
    expect(auswahlName(12)).toBe("C (c²)");
  });

  it("setzt den Fortschritt bei neuer Auswahl mit neuem Lauf zurück", () => {
    const l = lauf(neuerLauf(4), true, 0.4);
    expect(l.getroffen[0]).toBe(true);
    expect(neuerLauf(melodie([0, 2, 4, 5], 4).length).getroffen).toEqual([false, false, false, false]);
  });
});

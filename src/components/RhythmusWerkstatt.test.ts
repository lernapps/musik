import { describe, expect, it } from "vitest";
import { einsaetze } from "./Analyse.ts";
import {
  aktiveFelder,
  durchgangEreignisse,
  durchgangNr,
  durchgangText,
  einzaehlZahl,
  feldImDurchgang,
  naechstesFeld,
  sollZeitenAlle,
  waehleDurchgaenge,
  effektivwert,
  einzaehlDauer,
  ergebnisText,
  feldName,
  felderProTakt,
  felderZahl,
  fuelleVerlauf,
  klemmeTakte,
  klemmeTempo,
  klickPlan,
  laufendesFeld,
  MESS_SCHRITT,
  nachbauText,
  notenwerteText,
  passeMusterAn,
  sollZeiten,
  unterschiede,
  wertAus,
  zaehlhilfe,
  zaehlhilfeText,
  zeitplan,
} from "./RhythmusWerkstatt.ts";

/** Künstliche Lautstärke-Folge: Stille mit kurzen Klatschern (je 30 ms laut) an den angegebenen Zeiten. */
function lautstaerke(klatscher: number[], dauer: number): number[] {
  const folge = Array.from({ length: Math.round(dauer / MESS_SCHRITT) }, () => 0.001);
  for (const z of klatscher) {
    const start = Math.round(z / MESS_SCHRITT);
    for (let i = start; i < start + 3 && i < folge.length; i++) folge[i] = 0.5;
  }
  return folge;
}

describe("Felder und Zählhilfe", () => {
  it("zählt die Felder je Takt und insgesamt", () => {
    expect(felderProTakt("2/4", "achtel")).toBe(4);
    expect(felderProTakt("3/4", "achtel")).toBe(6);
    expect(felderProTakt("4/4", "achtel")).toBe(8);
    expect(felderProTakt("4/4", "viertel")).toBe(4);
    expect(felderZahl("3/4", 2, "achtel")).toBe(12);
    expect(felderZahl("4/4", 9, "achtel")).toBe(32);
    expect(felderZahl("4/4", 0, "viertel")).toBe(4);
  });

  it("baut die Zählhilfe", () => {
    expect(zaehlhilfeText("4/4", "achtel")).toBe("1 + 2 + 3 + 4 +");
    expect(zaehlhilfeText("3/4", "achtel")).toBe("1 + 2 + 3 +");
    expect(zaehlhilfe("2/4", "viertel")).toEqual(["1", "2"]);
  });

  it("benennt Felder", () => {
    expect(feldName(0, "4/4", "achtel")).toBe("Takt 1, Zählzeit 1");
    expect(feldName(3, "4/4", "achtel")).toBe("Takt 1, Zählzeit 2 und");
    expect(feldName(8, "4/4", "achtel")).toBe("Takt 2, Zählzeit 1");
  });

  it("begrenzt Tempo und Takte und passt das Muster an", () => {
    expect(klemmeTempo(10)).toBe(40);
    expect(klemmeTempo(500)).toBe(160);
    expect(klemmeTempo(Number.NaN)).toBe(80);
    expect(klemmeTakte(7)).toBe(4);
    expect(passeMusterAn([true], 3)).toEqual([true, false, false]);
    expect(passeMusterAn([true, true, true, true], 2)).toEqual([true, true]);
    expect(passeMusterAn(undefined, 2)).toEqual([false, false]);
  });
});

describe("Notenwerte", () => {
  it("liest Achtelfelder als Notenwerte", () => {
    // Zählzeit 1: Schlag+leer, 2: Schlag+und, 3: beide leer, 4: leer+und
    const muster = [true, false, true, true, false, false, false, true];
    expect(notenwerteText(muster, "4/4", 1, "achtel")).toBe(
      "Viertel, Achtel, Achtel, Viertelpause, Achtelpause, Achtel",
    );
  });

  it("zeigt Beispiel aus dem Auftrag", () => {
    const muster = [true, false, true, true, false, false, false, false];
    expect(notenwerteText(muster, "4/4", 1, "achtel")).toBe("Viertel, Achtel, Achtel, Viertelpause, Viertelpause");
  });

  it("liest das Viertelraster und trennt Takte", () => {
    expect(notenwerteText([true, false, true], "3/4", 1, "viertel")).toBe("Viertel, Viertelpause, Viertel");
    const zwei = [true, true, false, false, false, false, true, false];
    expect(notenwerteText(zwei, "2/4", 2, "achtel")).toBe("Achtel, Achtel, Viertelpause | Viertelpause, Viertel");
  });
});

describe("Zeiten", () => {
  it("rechnet Soll-Zeiten aus Muster, Tempo und Raster", () => {
    // 120 BPM: Viertel 0,5 s, Achtel 0,25 s
    expect(sollZeiten([true, false, true, true], 120, "achtel")).toEqual([0, 0.5, 0.75]);
    expect(sollZeiten([true, false, true], 120, "viertel", 2)).toEqual([2, 3]);
    expect(aktiveFelder([true, false, true])).toEqual([0, 2]);
  });

  it("plant Metronom-Klicks mit Betonung auf der Eins", () => {
    const plan = klickPlan("3/4", 2, 120);
    expect(plan.map((k) => k.start)).toEqual([0, 0.5, 1, 1.5, 2, 2.5]);
    expect(plan.map((k) => k.betont)).toEqual([true, false, false, true, false, false]);
    expect(einzaehlDauer("4/4", 120)).toBe(2);
  });

  it("plant einen Durchlauf mit Einzählung im Voraus und sortiert", () => {
    const plan = zeitplan({
      muster: [true, false, false, false],
      taktart: "2/4",
      takte: 1,
      raster: "achtel",
      tempo: 120,
      ton: true,
      metronom: true,
      einzaehlen: true,
    });
    expect(plan.beginn).toBe(1);
    expect(plan.dauer).toBe(2);
    const starts = plan.ereignisse.map((e) => e.start);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
    expect(plan.ereignisse.filter((e) => e.art === "klick").map((e) => e.start)).toEqual([0, 0.5, 1, 1.5]);
    expect(plan.ereignisse.filter((e) => e.art === "ton").map((e) => e.start)).toEqual([1]);
  });

  it("findet das laufende Feld", () => {
    expect(laufendesFeld(-0.1, 120, "achtel", 4)).toBe(-1);
    expect(laufendesFeld(0.3, 120, "achtel", 4)).toBe(1);
    expect(laufendesFeld(1, 120, "achtel", 4)).toBe(-1);
  });
});

describe("Lautstärke", () => {
  it("misst den Effektivwert des Blockendes", () => {
    const block = new Float32Array([1, 1, 0, 0]);
    expect(effektivwert(block)).toBeCloseTo(Math.sqrt(0.5));
    expect(effektivwert(block, 2)).toBe(0);
  });

  it("füllt Lücken im Verlauf mit dem letzten Wert", () => {
    const verlauf: number[] = [];
    fuelleVerlauf(verlauf, 0.01, 0, 0.1);
    fuelleVerlauf(verlauf, 0.01, 0.035, 0.4);
    expect(verlauf).toEqual([0.1, 0.1, 0.1, 0.4]);
    fuelleVerlauf(verlauf, 0.01, -1, 9);
    expect(verlauf).toHaveLength(4);
  });
});

describe("Klatsch-Vergleich", () => {
  const muster = [true, false, true, true, false, false, true, false]; // 4 Schläge
  const tempo = 120;
  const beginn = einzaehlDauer("4/4", tempo); // 2 s
  const soll = sollZeiten(muster, tempo, "achtel", beginn);

  function lauf(klatscher: number[]) {
    const verlauf = lautstaerke(klatscher, beginn + 2.5);
    return wertAus(muster, einsaetze(verlauf, MESS_SCHRITT), tempo, "achtel", beginn);
  }

  it("zählt bei mehreren Durchgängen alle zusammen", () => {
    const dauer = 8 * 0.25; // ein Durchgang: 2 s
    const alle = sollZeitenAlle(muster, tempo, "achtel", beginn, 2);
    expect(alle).toHaveLength(8);
    expect(alle[4]).toBeCloseTo(beginn + dauer);
    const verlauf = lautstaerke(
      alle.filter((_, i) => i !== 5),
      beginn + 2 * dauer + 0.5,
    );
    const erg = wertAus(muster, einsaetze(verlauf, MESS_SCHRITT), tempo, "achtel", beginn, 2);
    expect(erg.getroffen).toBe(7);
    expect(erg.soll).toBe(8);
    expect(erg.felder.filter((f) => !f.getroffen)).toEqual([{ index: 2, durchgang: 2, getroffen: false }]);
    expect(ergebnisText(erg)).toBe("7 von 8 Schlägen getroffen");
  });

  it("trifft alle, wenn nah an den Sollzeiten geklatscht wird (± 0,05 s)", () => {
    const erg = lauf(soll.map((z, i) => z + (i % 2 === 0 ? 0.05 : -0.05)));
    expect(erg.getroffen).toBe(4);
    expect(erg.zuviel).toBe(0);
    expect(erg.felder.every((f) => f.getroffen)).toBe(true);
    expect(ergebnisText(erg)).toBe("4 von 4 Schlägen getroffen");
  });

  it("meldet einen Klatscher zu viel", () => {
    const erg = lauf([...soll, beginn + 0.25 * 4 + 0.13]);
    expect(erg.getroffen).toBe(4);
    expect(erg.zuviel).toBe(1);
    expect(ergebnisText(erg)).toBe("4 von 4 Schlägen getroffen, 1 zu viel");
  });

  it("meldet einen verpassten Schlag mit dem Feld", () => {
    const erg = lauf(soll.filter((_, i) => i !== 2));
    expect(erg.getroffen).toBe(3);
    expect(erg.zuviel).toBe(0);
    expect(erg.felder.filter((f) => !f.getroffen).map((f) => f.index)).toEqual([3]);
    expect(ergebnisText(erg)).toBe("3 von 4 Schlägen getroffen");
  });

  it("zählt die Klicks der Einzählung nicht als Klatschen", () => {
    const erg = lauf([0, 0.5, 1, 1.5, ...soll]);
    expect(erg.getroffen).toBe(4);
    expect(erg.zuviel).toBe(0);
  });

  it("sagt etwas Freundliches bei leerem Muster", () => {
    const erg = wertAus([false, false], [], 100, "viertel", 0);
    expect(ergebnisText(erg)).toContain("kein Schlag");
  });
});

describe("Nachbauen", () => {
  it("zählt Unterschiede zum Vorbild", () => {
    expect(unterschiede([true, false], [true, false])).toBe(0);
    expect(unterschiede([true, false, true], [false, false, false])).toBe(2);
    expect(nachbauText(0)).toContain("Genau");
    expect(nachbauText(1)).toBe("Noch 1 Feld ist anders als beim Vorbild. Hör es dir noch einmal an.");
  });
});

describe("Durchgänge und Einzählen", () => {
  const basis = {
    muster: [true, false, true, false],
    taktart: "2/4" as const,
    takte: 1,
    raster: "achtel" as const,
    tempo: 120, // Achtel 0,25 s, Durchgang 1 s
    ton: true,
    metronom: true,
  };

  it("plant mehrere Durchgänge ohne Lücke", () => {
    const plan = zeitplan({ ...basis, einzaehlen: true, durchgaenge: 3 });
    expect(plan.beginn).toBe(1);
    expect(plan.dauer).toBe(4);
    const toene = plan.ereignisse.filter((e) => e.art === "ton").map((e) => e.start);
    expect(toene).toEqual([1, 1.5, 2, 2.5, 3, 3.5]);
    const klicks = plan.ereignisse.filter((e) => e.art === "klick").map((e) => e.start);
    expect(klicks).toEqual([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]);
    expect(plan.ereignisse.filter((e) => e.betont).map((e) => e.start)).toEqual([0, 1, 2, 3]);
  });

  it("plant einzelne Durchgänge für dauerhaftes Spielen", () => {
    const d = durchgangEreignisse(basis, 5, 0);
    expect(d.filter((e) => e.art === "ton").map((e) => e.start)).toEqual([5, 5.5]);
    expect(zeitplan({ ...basis, einzaehlen: false }).dauer).toBe(1);
  });

  it("wählt die nächste Auswahl und beschreibt den Durchgang", () => {
    expect([1, 2, 3, 5, 8, 20, Number.NaN].map(waehleDurchgaenge)).toEqual([1, 2, 4, 4, 8, 8, 1]);
    expect(durchgangText(2, 4, false)).toBe("Durchgang 2 von 4");
    expect(durchgangText(3, 1, true)).toBe("Durchgang 3 (dauerhaft)");
    expect(durchgangNr(-1, 1)).toBe(0);
    expect(durchgangNr(1.2, 1)).toBe(2);
    expect(durchgangNr(9, 1, 4)).toBe(4);
    expect(feldImDurchgang(1.3, 1, 120, "achtel", 4)).toBe(1);
  });

  it("zeigt beim Einzählen die Zahl des Schlags", () => {
    expect([0, 0.4, 0.5, 0.99, 1, -0.1].map((t) => einzaehlZahl(t, "2/4", 120))).toEqual([1, 1, 2, 2, 0, 0]);
  });

  it("findet das nächste Feld zum Klatschen", () => {
    const m = [true, false, true, true];
    expect(naechstesFeld(m, -0.5, 120, "achtel", false)).toBe(0);
    expect(naechstesFeld(m, 0.1, 120, "achtel", false)).toBe(0);
    expect(naechstesFeld(m, 0.2, 120, "achtel", false)).toBe(2);
    expect(naechstesFeld(m, 0.9, 120, "achtel", false)).toBe(-1);
    expect(naechstesFeld(m, 0.9, 120, "achtel", true)).toBe(0);
  });
});

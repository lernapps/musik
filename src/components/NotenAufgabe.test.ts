import { describe as gruppe, expect, it } from "vitest";
import {
  NAMEN,
  about,
  bildText,
  check,
  describe,
  generate,
  hoerDauer,
  mistakes,
  params,
  position,
  reason,
  show,
  solution,
  template,
  toene,
  wrong,
  type Bereich,
} from "./NotenAufgabe.ts";
import { name, nameMitOktave } from "./Musik.ts";

const samen = Array.from({ length: 50 }, (_, i) => i + 1);
const bereiche: Bereich[] = ["linien", "zwischenraeume", "alle"];

gruppe("NotenAufgabe: Aufgaben", () => {
  it("gibt für denselben Samen dieselbe Aufgabe", () => {
    for (const s of samen) expect(generate(s, {})).toEqual(generate(s, {}));
  });
  it("zeigt in den Samen 1 bis 50 mindestens acht verschiedene Töne (alle)", () => {
    expect(new Set(samen.map((s) => generate(s, {}).ton)).size).toBeGreaterThanOrEqual(8);
  });
  it("bleibt im gewählten Bereich und nutzt ihn ganz", () => {
    for (const bereich of bereiche) {
      const gezogen = new Set(samen.map((s) => generate(s, { bereich }).ton));
      for (const t of gezogen) expect(toene(bereich)).toContain(t);
      if (bereich !== "alle") expect(gezogen.size).toBe(toene(bereich).length);
    }
  });
  it("kennt Linien, Zwischenräume und weiße Tasten", () => {
    expect(
      toene("linien")
        .map((t) => name(t))
        .join(""),
    ).toBe("EGHDF");
    expect(
      toene("zwischenraeume")
        .map((t) => name(t))
        .join(""),
    ).toBe("FACE");
    expect(toene("alle").every((t) => name(t).length === 1)).toBe(true);
    expect(Math.min(...toene("alle"))).toBe(0);
    expect(Math.max(...toene("alle"))).toBe(21);
  });
});

gruppe("NotenAufgabe: Prüfung", () => {
  it("nimmt die Lösung und lehnt wrong ab, in jedem Bereich", () => {
    for (const bereich of bereiche)
      for (const s of samen) {
        const t = generate(s, { bereich });
        expect(check(t, solution(t))).toBe(true);
        expect(check(t, wrong(t))).toBe(false);
        expect(NAMEN).toContain(solution(t));
      }
  });
  it("nimmt Klein- und Großschreibung, Leerzeichen und Oktavzahl, nichts anderes", () => {
    const t = { ton: 7, wert: "viertel" } as const;
    expect(check(t, "G")).toBe(true);
    expect(check(t, "g")).toBe(true);
    expect(check(t, " g¹ ")).toBe(true);
    expect(check(t, "F")).toBe(false);
    expect(check(t, "")).toBe(false);
    expect(check(t, "Gis")).toBe(false);
    expect(check(t, 7)).toBe(false);
    expect(check(t, undefined)).toBe(false);
  });
  it("kennt h und keinen Buchstaben B", () => {
    const t = { ton: 11, wert: "halbe" } as const;
    expect(check(t, "H")).toBe(true);
    expect(check(t, "B")).toBe(false);
  });
});

gruppe("NotenAufgabe: Rückmeldung", () => {
  it("nennt bei Nachbarton die Verwechslung von Linie und Zwischenraum", () => {
    const linie = { ton: 7, wert: "viertel" } as const;
    expect(reason(linie, "F")).toContain("Linie und Zwischenraum");
    expect(reason(linie, "F")).toContain("auf einer Linie");
    const raum = { ton: 5, wert: "viertel" } as const;
    expect(reason(raum, "G")).toContain("Zwischenraum");
  });
  it("erinnert bei Hilfslinien an die Hilfslinie", () => {
    expect(reason({ ton: 0, wert: "viertel" }, "D")).toContain("Hilfslinie");
    expect(reason({ ton: 21, wert: "viertel" }, "H")).toContain("Hilfslinie");
  });
  it("rät sonst, von der untersten Linie e¹ zu zählen", () => {
    expect(reason({ ton: 14, wert: "viertel" }, "A")).toContain("e¹");
  });
  it("ist bei richtig leer und bei Unsinn freundlich", () => {
    expect(reason({ ton: 7, wert: "viertel" }, "G")).toBeUndefined();
    expect(reason({ ton: 7, wert: "viertel" }, "x")).toContain("Wähle");
  });
  it("gibt für jede wrong-Antwort einen Grund", () => {
    for (const s of samen) {
      const t = generate(s, {});
      expect(reason(t, wrong(t))?.length).toBeGreaterThan(10);
    }
  });
  it("nennt in keiner Meldung den Namen der Note", () => {
    for (const ton of toene("alle"))
      for (const antwort of NAMEN.filter((n) => n !== name(ton))) {
        const text = reason({ ton, wert: "viertel" }, antwort) ?? "";
        expect(text).not.toMatch(new RegExp(`\\b${name(ton)}\\b`, "u"));
        expect(text).not.toContain("heißt");
        expect(text).not.toContain(nameMitOktave(ton));
      }
  });
});

gruppe("NotenAufgabe: Beschreibung", () => {
  it("beschreibt die Aufgabe, ohne den Namen zu verraten", () => {
    const t = { ton: 7, wert: "viertel" } as const;
    expect(position(7)).toBe("auf der zweiten Linie von unten");
    expect(bildText(t)).toBe("Eine Viertelnote auf der zweiten Linie von unten im Violinschlüssel");
    expect(bildText(t)).not.toMatch(/\bg\b|G\b|g¹/u);
    expect(describe(t, {}, "de").task).toContain("Wie heißt der Ton?");
    expect(describe(t, {}, "de").solution).toContain("G (g¹)");
  });
  it("beschreibt Zwischenräume und Hilfslinien", () => {
    expect(position(5)).toBe("im Zwischenraum zwischen der ersten und der zweiten Linie von unten");
    expect(position(0)).toBe("auf einer Hilfslinie unter dem System");
    expect(position(21)).toBe("auf einer Hilfslinie über dem System");
    expect(position(2)).toContain("direkt unter");
  });
  it("hat Text für jede Aufgabe und das Beschreibungsgerüst", () => {
    for (const s of samen) {
      const d = describe(generate(s, {}), {}, "de");
      expect(d.task.trim()).not.toBe("");
      expect(d.solution.trim()).not.toBe("");
    }
    expect(about.mistakes.length).toBeGreaterThanOrEqual(3);
  });
});

gruppe("NotenAufgabe: Tabelle für den Tutor", () => {
  it("Vorlage mit Werten ist die Aufgabe; jeder Fehlwert wird abgelehnt", () => {
    for (const bereich of bereiche)
      for (const s of samen) {
        const t = generate(s, { bereich });
        let text = template({ bereich }, "de");
        for (const [n, wert] of Object.entries(params(t, { bereich }, "de"))) text = text.replace(`{${n}}`, wert);
        expect(text).toBe(describe(t, { bereich }, "de").task);
        const fehler = mistakes(t);
        expect(fehler).toHaveLength(about.mistakes.length);
        for (const antwort of fehler) if (antwort !== undefined) expect(check(t, antwort)).toBe(false);
      }
  });
  it("Nachbartöne mit Sprung von H zu C; auf der Hilfslinie d¹ und g²", () => {
    expect(mistakes({ ton: 11, wert: "viertel" })).toEqual(["C", "A", undefined, undefined]);
    expect(mistakes({ ton: 0, wert: "viertel" })).toEqual([undefined, undefined, "D", undefined]);
    expect(mistakes({ ton: 21, wert: "viertel" })).toEqual([undefined, undefined, "G", undefined]);
  });
  it("zeigt eine Antwort als Buchstaben", () => {
    expect(show(" g ")).toBe("G");
    expect(show("H")).toBe("H");
  });
});

gruppe("NotenAufgabe: Ton hören", () => {
  it("spielt Viertel und Halbe bei Tempo 80 mit ihrer Dauer", () => {
    expect(hoerDauer({ ton: 4, wert: "viertel" })).toBeCloseTo(0.75);
    expect(hoerDauer({ ton: 4, wert: "halbe" })).toBeCloseTo(1.5);
  });
});

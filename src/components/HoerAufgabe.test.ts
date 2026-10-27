import { describe as beschreibe, expect, it } from "vitest";
import { INTERVALLE, tonleiter } from "./Musik.ts";
import {
  about,
  check,
  describe,
  generate,
  klicks,
  mistakes,
  params,
  reason,
  show,
  solution,
  template,
  wiedergabe,
  wrong,
  type Art,
} from "./HoerAufgabe.ts";

const ARTEN: Art[] = ["hoeher", "lauter", "intervall", "dur-moll", "takt"];

beschreibe("HoerAufgabe", () => {
  for (const art of ARTEN) {
    it(`erfüllt den Aufgabenvertrag für ${art} (Samen 1 bis 200)`, () => {
      const alle = new Set<string>();
      for (let seed = 1; seed <= 200; seed++) {
        const task = generate(seed, { art });
        expect(JSON.stringify(generate(seed, { art }))).toBe(JSON.stringify(task));
        expect(check(task, solution(task))).toBe(true);
        expect(check(task, wrong(task))).toBe(false);
        expect(check(task, "Unsinn")).toBe(false);
        const d = describe(task, { art }, "de");
        expect(d.task.trim()).not.toBe("");
        expect(d.solution.trim()).not.toBe("");
        expect(reason(task, solution(task))).toBeUndefined();
        expect(reason(task, wrong(task))?.length).toBeGreaterThan(10);
        alle.add(JSON.stringify(task));
      }
      expect(alle.size).toBeGreaterThanOrEqual(20);
      const erste50 = new Set(Array.from({ length: 50 }, (_, i) => JSON.stringify(generate(i + 1, { art }))));
      expect(erste50.size).toBeGreaterThanOrEqual(20);
    });
  }

  it("hoeher: mindestens 2 Halbtöne Abstand, Töne in c¹ bis c³", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const [a = 0, b = 0] = generate(seed, { art: "hoeher" }).toene;
      expect(Math.abs(a - b)).toBeGreaterThanOrEqual(2);
      expect(Math.min(a, b)).toBeGreaterThanOrEqual(0);
      expect(Math.max(a, b)).toBeLessThanOrEqual(24);
    }
  });

  it("lauter: gleiche Höhe, Verhältnis mindestens 3:1", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const t = generate(seed, { art: "lauter" });
      expect(t.toene[0]).toBe(t.toene[1]);
      const [x = 1, y = 1] = t.laut;
      expect(Math.max(x, y) / Math.min(x, y)).toBeGreaterThanOrEqual(3);
    }
  });

  it("intervall: Halbtöne passen zum Namen, vier verschiedene Knöpfe", () => {
    const name = (h: number) => INTERVALLE.find((i) => i.halbtoene === h)?.name;
    expect(name(3)).toBe("kleine Terz");
    expect(name(4)).toBe("große Terz");
    expect(name(5)).toBe("Quarte");
    expect(name(7)).toBe("Quinte");
    expect(name(12)).toBe("Oktave");
    for (let seed = 1; seed <= 200; seed++) {
      const t = generate(seed, { art: "intervall" });
      const [a = 0, b = 0] = t.toene;
      expect(name(b - a)).toBe(t.loesung);
      expect(new Set(t.optionen).size).toBe(4);
      expect(t.optionen).toContain(t.loesung);
    }
  });

  it("intervall: nennt Halbtöne und den Fehler um einen Halbton", () => {
    const t = generate(1, { art: "intervall" });
    const nah = INTERVALLE.find((i) => Math.abs(i.halbtoene - (t.toene[1] ?? 0) + (t.toene[0] ?? 0)) === 1);
    const text = reason(t, nah?.name ?? "Prime");
    expect(text).toContain("Knapp daneben");
    expect(text).toContain("Halbton");
  });

  for (const art of ARTEN) {
    it(`${art}: die Meldung zu jeder falschen Antwort nennt nie die Lösung`, () => {
      for (let seed = 1; seed <= 200; seed++) {
        const t = generate(seed, { art });
        for (const option of t.optionen.filter((o) => o !== solution(t))) {
          const text = reason(t, option) ?? "";
          expect(text.length).toBeGreaterThan(10);
          expect(text).not.toContain("Richtig ist");
          // Dur und Moll nennt die Regel beide; sonst steht die Lösung nie in der Meldung
          if (art !== "dur-moll") expect(text).not.toContain(solution(t));
        }
      }
    });

    it(`${art}: Tabelle für den Tutor: Vorlage mit Werten ist die Aufgabe, jeder Fehlwert wird abgelehnt`, () => {
      const names = Object.keys(params(generate(1, { art })));
      for (let seed = 1; seed <= 200; seed++) {
        const t = generate(seed, { art });
        const werte = params(t);
        expect(Object.keys(werte)).toEqual(names);
        let text = template({ art }, "de");
        for (const [name, wert] of Object.entries(werte)) text = text.replace(`{${name}}`, String(wert));
        expect(text).toBe(describe(t, { art }, "de").task);
        const fehler = mistakes(t);
        expect(fehler).toHaveLength(about.mistakes.length);
        for (const antwort of fehler) {
          if (antwort === undefined) continue;
          expect(check(t, antwort)).toBe(false);
          expect(t.optionen).toContain(antwort);
        }
        expect(show(solution(t))).toBe(solution(t));
      }
    });
  }

  it("hoeher: wer den lauteren, tieferen Ton wählt, hört vom Unterschied zwischen laut und hoch", () => {
    let gesehen = 0;
    for (let seed = 1; seed <= 200; seed++) {
      const t = generate(seed, { art: "hoeher" });
      const [lautUndTief] = mistakes(t);
      if (lautUndTief === undefined) continue;
      gesehen++;
      expect(reason(t, lautUndTief)).toContain("Lauter heißt aber nicht höher");
    }
    expect(gesehen).toBeGreaterThan(20);
  });

  it("feste Fehlwerte: Terzen beim Intervall, das andere Tongeschlecht bei Dur und Moll, keiner beim Takt", () => {
    const terz = Array.from({ length: 200 }, (_, i) => generate(i + 1, { art: "intervall" })).find(
      (t) => (t.toene[1] ?? 0) - (t.toene[0] ?? 0) === 3 && t.optionen.includes("große Terz"),
    );
    expect(terz && mistakes(terz)[1]).toBe("große Terz");
    const tonart = generate(1, { art: "dur-moll" });
    expect(mistakes(tonart)[2]).toBe(wrong(tonart));
    expect(mistakes(generate(1, { art: "takt" }))).toEqual([undefined, undefined, undefined, undefined]);
  });

  it("dur-moll: Tonleitern haben die richtige Terz", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const t = generate(seed, { art: "dur-moll" });
      expect(t.toene).toHaveLength(8);
      const grund = t.toene[0] ?? 0;
      expect(grund).toBeLessThanOrEqual(7);
      expect(t.toene).toEqual(tonleiter(grund, t.loesung === "Dur" ? "dur" : "moll"));
      expect((t.toene[2] ?? 0) - grund).toBe(t.loesung === "Dur" ? 4 : 3);
    }
  });

  it("takt: erster Schlag jedes Takts betont, drei Takte", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const t = generate(seed, { art: "takt" });
      const n = Number(t.loesung.charAt(0));
      const k = klicks(t);
      expect(k).toHaveLength(n * 3);
      k.forEach((klick, i) => expect(klick.betont).toBe(i % n === 0));
      expect(t.optionen.slice().sort()).toEqual(["2/4", "3/4", "4/4"]);
    }
  });

  it("spielt Töne mit Klavier-Standard und gut hörbarer Dauer", () => {
    for (const art of ARTEN.filter((a) => a !== "takt")) {
      const t = generate(1, { art });
      for (const ton of wiedergabe(t, "alle")) {
        expect("form" in ton).toBe(false);
        expect(ton.dauer).toBeGreaterThanOrEqual(0.45);
      }
    }
  });

  it("about hat alle Felder", () => {
    expect(about.task).not.toBe("");
    expect(about.answer).not.toBe("");
    expect(about.correct).not.toBe("");
    expect(about.mistakes.length).toBeGreaterThan(0);
  });
});

beschreibe("die Töne in Worten", () => {
  it("nennen den Namen, nie die Frequenz: sonst lösen sie die Aufgabe ohne Hören", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const task = generate(seed, { art: "hoeher" });
      for (const wert of Object.values(params(task, { art: "hoeher" }, "de"))) expect(String(wert)).not.toMatch(/Hz/);
      expect(describe(task, { art: "hoeher" }, "de").task).not.toMatch(/Hz/);
    }
  });
});

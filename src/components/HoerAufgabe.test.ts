import { describe as beschreibe, expect, it } from "vitest";
import { INTERVALLE, tonleiter } from "./Musik.ts";
import {
  about,
  check,
  describe,
  generate,
  klicks,
  reason,
  solution,
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
        expect(reason(task, solution(task)).correct).toBe(true);
        expect(reason(task, wrong(task)).correct).toBe(false);
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
    const text = reason(t, nah?.name ?? "Prime").reason;
    expect(text).toContain("Halbton");
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

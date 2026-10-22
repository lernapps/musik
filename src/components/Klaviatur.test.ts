import { describe, expect, it } from "vitest";
import { frequenz, gegenname, istSchwarz, name, nameMitOktave } from "./Musik.ts";

// Die Logik der Klaviatur liegt in Musik.ts; hier prüfen wir, was die Oktavenansichten brauchen.
describe("Klaviatur", () => {
  it("zeigt in jeder Oktave sieben weiße Tasten plus das obere C und fünf schwarze", () => {
    for (const start of [0, 12]) {
      const toene = Array.from({ length: 13 }, (_, i) => start + i);
      expect(toene.filter((t) => !istSchwarz(t))).toHaveLength(8);
      expect(toene.filter((t) => istSchwarz(t))).toHaveLength(5);
      expect(name(start)).toBe("C");
      expect(name(start + 12)).toBe("C");
    }
  });

  it("benennt die Tasten für Screenreader", () => {
    expect(nameMitOktave(4)).toBe("e¹");
    expect(`${name(1)} oder ${gegenname(1)}`).toBe("Cis oder Des");
  });

  it("spielt die Töne mit den richtigen Frequenzen", () => {
    expect(Math.round(frequenz(4))).toBe(330);
    expect(Math.round(frequenz(12))).toBe(523);
  });
});

import { describe, expect, it } from "vitest";
import { lautstaerkeAnsage, lautstaerkeWort } from "./Lautstaerke.ts";

describe("Lautstärke", () => {
  it("nennt das Wort zum Prozentwert", () => {
    expect(lautstaerkeWort(0)).toBe("stumm");
    expect(lautstaerkeWort(20)).toBe("leise");
    expect(lautstaerkeWort(50)).toBe("mittel");
    expect(lautstaerkeWort(90)).toBe("laut");
  });

  it("sagt Wort und Prozent an", () => {
    expect(lautstaerkeAnsage(50)).toBe("Lautstärke: mittel, 50 Prozent");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Attrappen für den Browser: Der Zustand des Kontexts und die Aufrufe werden mitgezählt.
interface Zustand {
  kontexte: number;
  fortsetzen: number;
  abgespielt: number;
  start: string;
}

function attrappen(zustand: Zustand): void {
  class AudioContext {
    state = zustand.start;
    currentTime = 0;
    constructor() {
      zustand.kontexte++;
    }
    resume(): Promise<void> {
      zustand.fortsetzen++;
      this.state = "running";
      return Promise.resolve();
    }
    createOscillator() {
      return {
        type: "",
        frequency: { value: 0 },
        connect: () => ({ connect: () => undefined }),
        start: () => undefined,
        stop: () => undefined,
      };
    }
    createGain() {
      const param = { setValueAtTime: () => undefined, exponentialRampToValueAtTime: () => undefined };
      return { gain: param, connect: () => ({ connect: () => undefined }) };
    }
    destination = {};
  }
  class Audio {
    src: string;
    constructor(src: string) {
      this.src = src;
    }
    play(): Promise<void> {
      zustand.abgespielt++;
      return Promise.resolve();
    }
  }
  vi.stubGlobal("AudioContext", AudioContext);
  vi.stubGlobal("Audio", Audio);
}

describe("Klang auf dem iPhone", () => {
  let zustand: Zustand;

  beforeEach(() => {
    vi.resetModules();
    zustand = { kontexte: 0, fortsetzen: 0, abgespielt: 0, start: "suspended" };
    attrappen(zustand);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("nimmt einen angehaltenen Kontext wieder auf", async () => {
    const { holeKontext } = await import("./Klang.ts");
    holeKontext();
    expect(zustand.kontexte).toBe(1);
    expect(zustand.fortsetzen).toBe(1);
  });

  it("nimmt auch einen unterbrochenen Kontext wieder auf", async () => {
    zustand.start = "interrupted";
    const { holeKontext } = await import("./Klang.ts");
    holeKontext();
    expect(zustand.fortsetzen).toBe(1);
  });

  it("legt nur einen Kontext an und setzt einen laufenden nicht fort", async () => {
    zustand.start = "running";
    const { holeKontext } = await import("./Klang.ts");
    holeKontext();
    holeKontext();
    expect(zustand.kontexte).toBe(1);
    expect(zustand.fortsetzen).toBe(0);
  });

  it("stellt die Audio-Sitzung auf Wiedergabe", async () => {
    const { holeKontext, merkeSitzung } = await import("./Klang.ts");
    const sitzung = { type: "auto" };
    merkeSitzung(sitzung);
    holeKontext();
    expect(sitzung.type).toBe("playback");
  });

  it("spielt die Stille nur einmal ab", async () => {
    const { holeKontext } = await import("./Klang.ts");
    holeKontext();
    holeKontext();
    expect(zustand.abgespielt).toBe(1);
  });

  it("läuft auch ohne Audio-Sitzung und ohne Audio-Element", async () => {
    vi.stubGlobal("Audio", undefined);
    const { holeKontext, merkeSitzung, spiele } = await import("./Klang.ts");
    merkeSitzung(undefined);
    expect(() => holeKontext()).not.toThrow();
    expect(() => spiele([{ hz: 440, start: 0, dauer: 0.1 }])).not.toThrow();
  });
});

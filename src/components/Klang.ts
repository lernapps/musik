// Klang im Browser: Töne erzeugen (Web Audio) und das Mikrofon öffnen. Alles läuft lokal; nichts wird gespeichert
// oder gesendet. Die Funktionen werden erst nach einem Klick aufgerufen.

export type Wellenform = "sine" | "triangle" | "square" | "sawtooth";

let kontext: AudioContext | undefined;

function holeKontext(): AudioContext {
  kontext ??= new AudioContext();
  if (kontext.state === "suspended") void kontext.resume();
  return kontext;
}

export interface Ton {
  hz: number;
  /** Beginn in Sekunden ab jetzt. */
  start: number;
  dauer: number;
  laut?: number;
  form?: Wellenform;
}

/** Spielt Töne; gibt die Gesamtdauer in Sekunden zurück. */
export function spiele(toene: Ton[]): number {
  const ctx = holeKontext();
  const jetzt = ctx.currentTime + 0.05;
  let ende = 0;
  for (const ton of toene) {
    const osc = ctx.createOscillator();
    const huelle = ctx.createGain();
    osc.type = ton.form ?? "triangle";
    osc.frequency.value = ton.hz;
    const laut = Math.min(Math.max(ton.laut ?? 0.3, 0), 1);
    const an = jetzt + ton.start;
    const aus = an + ton.dauer;
    huelle.gain.setValueAtTime(0.0001, an);
    huelle.gain.exponentialRampToValueAtTime(Math.max(laut, 0.0002), an + 0.02);
    huelle.gain.setValueAtTime(Math.max(laut, 0.0002), Math.max(an + 0.02, aus - 0.06));
    huelle.gain.exponentialRampToValueAtTime(0.0001, aus);
    osc.connect(huelle).connect(ctx.destination);
    osc.start(an);
    osc.stop(aus + 0.02);
    ende = Math.max(ende, ton.start + ton.dauer);
  }
  return ende;
}

/** Ein kurzer Klick für das Metronom; betont ist höher und lauter. */
export function klick(start: number, betont: boolean): void {
  spiele([{ hz: betont ? 1500 : 1000, start, dauer: 0.06, laut: betont ? 0.4 : 0.25, form: "square" }]);
}

export interface Mikrofon {
  /** Liest den neuesten Block Abtastwerte. */
  lesen(): Float32Array;
  abtastrate: number;
  stoppen(): void;
}

/**
 * Öffnet das Mikrofon nach der Erlaubnis des Browsers. `geraete` ist `navigator.mediaDevices`, das die Komponente in
 * `onMounted` holt. Schlägt fehl (Ablehnung, kein Gerät): wirft einen Fehler.
 */
export async function oeffneMikrofon(geraete: MediaDevices | undefined, blockgroesse = 4096): Promise<Mikrofon> {
  if (!geraete?.getUserMedia) throw new Error("kein Mikrofon-Zugriff in diesem Browser");
  const strom = await geraete.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const ctx = holeKontext();
  const quelle = ctx.createMediaStreamSource(strom);
  const analyse = ctx.createAnalyser();
  analyse.fftSize = blockgroesse;
  quelle.connect(analyse);
  const puffer = new Float32Array(analyse.fftSize);
  return {
    abtastrate: ctx.sampleRate,
    lesen() {
      analyse.getFloatTimeDomainData(puffer);
      return puffer;
    },
    stoppen() {
      quelle.disconnect();
      for (const spur of strom.getTracks()) spur.stop();
    },
  };
}

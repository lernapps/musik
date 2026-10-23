// Klang im Browser: Töne erzeugen (Web Audio) und das Mikrofon öffnen. Alles läuft lokal; nichts wird gespeichert
// oder gesendet. Die Funktionen werden erst nach einem Klick aufgerufen.

import { ref } from "vue";
import { OBERTOENE, filterEnde, filterStart, gainVonProzent, huelle } from "./Klavier.ts";

export type Wellenform = "klavier" | "sine" | "triangle" | "square" | "sawtooth";

let kontext: AudioContext | undefined;

/** Eine kurze Stille (0,1 s, WAV) als Daten-URI, ohne Netzwerk. */
const STILLE =
  "data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

interface Sitzung {
  type: string;
}
let sitzung: Sitzung | undefined;
let entsperrt = false;

/**
 * Merkt sich `navigator.audioSession`, das die Komponente in `onMounted` holt (nur dort ist `navigator` erlaubt).
 * Auf dem iPhone verstummt Web Audio sonst bei eingeschaltetem Stummschalter.
 */
export function merkeSitzung(s: Sitzung | undefined): void {
  sitzung = s;
}

/**
 * Schaltet den Ton auf dem iPhone frei: Die Audio-Sitzung wird zur Wiedergabe (iOS 17 und neuer), und ein kurzes stilles
 * Audio-Element, das iOS auch bei Stummschalter spielt, stellt Web Audio auf die Wiedergabe-Lautstärke um (ältere iOS).
 * Muss in einer Bedienung (Klick) laufen.
 */
function entsperre(): void {
  try {
    if (sitzung) sitzung.type = "playback";
  } catch {
    // Der Browser kennt die Audio-Sitzung nicht oder lehnt den Wert ab: dann bleibt es beim Standard.
  }
  if (entsperrt || typeof Audio === "undefined") return;
  entsperrt = true;
  try {
    const stille = new Audio(STILLE);
    void stille.play().catch(() => {
      entsperrt = false;
    });
  } catch {
    entsperrt = false;
  }
}

/** Der gemeinsame Audiokontext; wird in einer Bedienung gestartet und, wenn iOS ihn anhält, wieder aufgenommen. */
export function holeKontext(): AudioContext {
  entsperre();
  kontext ??= new AudioContext();
  if (kontext.state !== "running") void kontext.resume();
  return kontext;
}

/** Die Lautstärke der App in Prozent, für alle Komponenten gleich, bis die Seite neu geladen wird. */
export const lautstaerke = ref(80);

let master: GainNode | undefined;
let klavierWelle: PeriodicWave | undefined;

/** Der gemeinsame Ausgang: alle Töne laufen über ihn, damit ein Regler für alle gilt. */
export function ausgang(): AudioNode {
  const ctx = holeKontext();
  if (!master) {
    master = ctx.createGain();
    master.gain.value = gainVonProzent(lautstaerke.value);
    master.connect(ctx.destination);
  }
  return master;
}

/** Setzt die Lautstärke (0 bis 100 Prozent); ein laufender Ton folgt sofort. */
export function setzeLautstaerke(prozent: number): void {
  lautstaerke.value = Math.min(Math.max(Math.round(prozent), 0), 100);
  if (master && kontext) master.gain.setTargetAtTime(gainVonProzent(lautstaerke.value), kontext.currentTime, 0.02);
}

function welle(ctx: AudioContext): PeriodicWave {
  klavierWelle ??= ctx.createPeriodicWave(
    new Float32Array([0, ...OBERTOENE.map(() => 0)]),
    new Float32Array([0, ...OBERTOENE]),
  );
  return klavierWelle;
}

export interface Ton {
  hz: number;
  /** Beginn in Sekunden ab jetzt. */
  start: number;
  dauer: number;
  laut?: number;
  form?: Wellenform;
}

/** Spielt einen Ton wie ein Klavier: leicht verstimmte Saiten, Anschlag, Abklingen, dumpfer werdender Klang. */
function klavierton(ctx: AudioContext, ziel: AudioNode, ton: Ton, an: number, laut: number): void {
  const aus = an + ton.dauer;
  const h = huelle(ton.hz, ton.dauer, laut);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.5;
  filter.frequency.setValueAtTime(filterStart(ton.hz), an);
  filter.frequency.exponentialRampToValueAtTime(filterEnde(ton.hz), Math.max(aus, an + 0.05));
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, an);
  gain.gain.exponentialRampToValueAtTime(h.spitze, an + 0.006);
  gain.gain.exponentialRampToValueAtTime(h.beiLoslassen, Math.max(aus, an + 0.01));
  gain.gain.exponentialRampToValueAtTime(0.0001, Math.max(aus, an + 0.01) + h.ausklang);
  filter.connect(gain).connect(ziel);
  for (const verstimmung of [-3, 3]) {
    const osc = ctx.createOscillator();
    osc.setPeriodicWave(welle(ctx));
    osc.frequency.value = ton.hz;
    osc.detune.value = verstimmung;
    const halb = ctx.createGain();
    halb.gain.value = 0.5;
    osc.connect(halb).connect(filter);
    osc.start(an);
    osc.stop(Math.max(aus, an + 0.01) + h.ausklang + 0.02);
  }
}

/** Spielt Töne, standardmäßig wie ein Klavier; gibt die Gesamtdauer in Sekunden zurück. */
export function spiele(toene: Ton[]): number {
  const ctx = holeKontext();
  const ziel = ausgang();
  const jetzt = ctx.currentTime + 0.05;
  let ende = 0;
  for (const ton of toene) {
    const laut = Math.min(Math.max(ton.laut ?? 0.3, 0), 1);
    const an = jetzt + ton.start;
    if ((ton.form ?? "klavier") === "klavier") {
      klavierton(ctx, ziel, ton, an, laut);
    } else {
      const osc = ctx.createOscillator();
      const huellkurve = ctx.createGain();
      osc.type = ton.form as OscillatorType;
      osc.frequency.value = ton.hz;
      const aus = an + ton.dauer;
      huellkurve.gain.setValueAtTime(0.0001, an);
      huellkurve.gain.exponentialRampToValueAtTime(Math.max(laut, 0.0002), an + 0.02);
      huellkurve.gain.setValueAtTime(Math.max(laut, 0.0002), Math.max(an + 0.02, aus - 0.06));
      huellkurve.gain.exponentialRampToValueAtTime(0.0001, aus);
      osc.connect(huellkurve).connect(ziel);
      osc.start(an);
      osc.stop(aus + 0.02);
    }
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

// Logik des Klangbilds: Wellenformen, Regler-Umrechnung und Wörter. Rein und ohne Browser.

export type Form = "sine" | "triangle" | "square" | "sawtooth";

export const MIN_HZ = 130;
export const MAX_HZ = 1050;
/** Größter Gain im Audio; so bleibt der Ton auch ganz „laut“ angenehm. */
export const MAX_GAIN = 0.3;

export const FORMEN: { form: Form; name: string }[] = [
  { form: "sine", name: "Sinus" },
  { form: "triangle", name: "Dreieck" },
  { form: "square", name: "Rechteck" },
  { form: "sawtooth", name: "Sägezahn" },
];

export function formName(form: Form): string {
  return FORMEN.find((f) => f.form === form)?.name ?? "Sinus";
}

/** Ein Wert der Welle (−1 bis 1) an der Stelle `t` (in Perioden). Alle Formen beginnen wie im Web Audio bei 0 bzw. +1. */
function wert(form: Form, t: number): number {
  const phase = t - Math.floor(t);
  switch (form) {
    case "sine":
      return Math.sin(2 * Math.PI * phase);
    case "triangle":
      return (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * phase));
    case "square":
      return phase < 0.5 ? 1 : -1;
    case "sawtooth":
      return 2 * ((phase + 0.5) % 1) - 1;
  }
}

/** y-Werte (−1 bis 1) von `punkte` gleichmäßig verteilten Stellen über `perioden` Perioden, mal `amplitude` (0 bis 1). */
export function welle(form: Form, perioden: number, amplitude: number, punkte: number): number[] {
  const a = Math.min(Math.max(amplitude, 0), 1);
  const n = Math.max(Math.floor(punkte), 2);
  return Array.from({ length: n }, (_, i) => a * wert(form, (i / (n - 1)) * perioden) || 0);
}

/** Reglerstellung 0 bis 1 → Frequenz (logarithmisch, 130 bis 1050 Hz). */
export function sliderZuHz(pos: number): number {
  const p = Math.min(Math.max(pos, 0), 1);
  return MIN_HZ * (MAX_HZ / MIN_HZ) ** p;
}

/** Frequenz → Reglerstellung 0 bis 1. */
export function hzZuSlider(hz: number): number {
  const h = Math.min(Math.max(hz, MIN_HZ), MAX_HZ);
  return Math.log(h / MIN_HZ) / Math.log(MAX_HZ / MIN_HZ);
}

/** Wie viele Perioden im Bild zu sehen sind: 3 bei tiefstem, 6 beim höchsten Ton. */
export function perioden(hz: number): number {
  return 3 + 3 * hzZuSlider(hz);
}

/** Lautstärke in Prozent → Wort. */
export function lautWort(prozent: number): "leise" | "mittel" | "laut" {
  if (prozent < 34) return "leise";
  if (prozent < 67) return "mittel";
  return "laut";
}

/** Prozent → Gain für den Oszillator (0 bis 0,3). */
export function gainVon(prozent: number): number {
  return (Math.min(Math.max(prozent, 0), 100) / 100) * MAX_GAIN;
}

/** Ton in Halbtönen ab c¹ → Name mit Oktave; die kleine Oktave heißt einfach „c“ (nicht „c⁰“). */
export function tonText(ton: number, mitOktave: string): string {
  return ton >= -12 && ton < 0 ? mitOktave.replace("⁰", "") : mitOktave;
}

/** Kurzbeschreibung für das Bild, z. B. „Welle: 262 Hz, mittel laut, Sinus“. */
export function beschreibung(hz: number, laut: number, form: Form): string {
  const wort = lautWort(laut);
  return `Welle: ${Math.round(hz)} Hz, ${wort === "mittel" ? "mittel laut" : wort}, ${formName(form)}`;
}

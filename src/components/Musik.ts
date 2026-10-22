// Musiktheorie der App: Töne, Frequenzen, Tonleitern, Intervalle, Notenwerte. Reine Funktionen, ohne Browser.

/** Töne zählen in Halbtönen ab c¹ (Mittel-C); 0 ist c¹, 12 ist c², 24 ist c³. */
export const TIEF = 0;
export const HOCH = 24;

const STAMM = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "Ais", "H"] as const;
const SCHWARZ = new Set([1, 3, 6, 8, 10]);
const GEGENNAME: Record<string, string> = { Cis: "Des", Dis: "Es", Fis: "Ges", Gis: "As", Ais: "B" };

/** Frequenz in Hz; a¹ = 440 Hz (Kammerton), gleichstufig. */
export function frequenz(ton: number): number {
  return 440 * 2 ** ((ton - 9) / 12);
}

export function istSchwarz(ton: number): boolean {
  return SCHWARZ.has(((ton % 12) + 12) % 12);
}

/** Name ohne Oktave: "C", "Cis", "H". */
export function name(ton: number): string {
  return STAMM[((ton % 12) + 12) % 12] ?? "C";
}

/** Zweiter Name einer schwarzen Taste ("Cis" → "Des"), sonst leer. */
export function gegenname(ton: number): string {
  return GEGENNAME[name(ton)] ?? "";
}

/** Name mit Oktave in der deutschen Schreibweise: c¹, d¹ … h¹, c², c³. */
export function nameMitOktave(ton: number): string {
  const oktave = Math.floor(ton / 12) + 1;
  const n = name(ton);
  const klein = n.charAt(0).toLowerCase() + n.slice(1);
  return `${klein}${hochzahl(oktave)}`;
}

function hochzahl(zahl: number): string {
  const ziffern = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
  return String(zahl)
    .split("")
    .map((z) => ziffern[Number(z)] ?? z)
    .join("");
}

export type Tonart = "dur" | "moll";

/** Halbtonabstände der Stufen: Dur (ganz, ganz, halb, ganz, ganz, ganz, halb) und natürliches Moll. */
export const SCHRITTE: Record<Tonart, number[]> = {
  dur: [2, 2, 1, 2, 2, 2, 1],
  moll: [2, 1, 2, 2, 1, 2, 2],
};

/** Die acht Töne einer Tonleiter ab `grundton`. */
export function tonleiter(grundton: number, art: Tonart): number[] {
  const töne = [grundton];
  for (const schritt of SCHRITTE[art]) töne.push((töne[töne.length - 1] ?? grundton) + schritt);
  return töne;
}

export interface Intervall {
  name: string;
  halbtoene: number;
}

/** Intervalle bis zur Oktave. Quelle: de.wikipedia.org/wiki/Intervall_(Musik). */
export const INTERVALLE: Intervall[] = [
  { name: "Prime", halbtoene: 0 },
  { name: "kleine Sekunde", halbtoene: 1 },
  { name: "große Sekunde", halbtoene: 2 },
  { name: "kleine Terz", halbtoene: 3 },
  { name: "große Terz", halbtoene: 4 },
  { name: "Quarte", halbtoene: 5 },
  { name: "Quinte", halbtoene: 7 },
  { name: "kleine Sexte", halbtoene: 8 },
  { name: "große Sexte", halbtoene: 9 },
  { name: "kleine Septime", halbtoene: 10 },
  { name: "große Septime", halbtoene: 11 },
  { name: "Oktave", halbtoene: 12 },
];

export function intervallName(halbtoene: number): string {
  return INTERVALLE.find((i) => i.halbtoene === halbtoene)?.name ?? "";
}

/** Notenwerte in Sechzehnteln: Ganze 16, Halbe 8, Viertel 4, Achtel 2. */
export const NOTENWERTE = [
  { name: "Ganze", sechzehntel: 16 },
  { name: "Halbe", sechzehntel: 8 },
  { name: "Viertel", sechzehntel: 4 },
  { name: "Achtel", sechzehntel: 2 },
] as const;

export type Taktart = "2/4" | "3/4" | "4/4";

/** Anzahl der Grundschläge (Viertel) im Takt. */
export function schlaege(takt: Taktart): number {
  return Number(takt.charAt(0));
}

/** Betonung eines Schlags (0-basiert): 2 = schwer, 1 = halbschwer, 0 = leicht. */
export function betonung(takt: Taktart, schlag: number): 0 | 1 | 2 {
  if (schlag === 0) return 2;
  if (takt === "4/4" && schlag === 2) return 1;
  return 0;
}

/** Dauer eines Viertels in Sekunden bei `bpm` Schlägen pro Minute. */
export function viertelDauer(bpm: number): number {
  return 60 / bpm;
}

/** Ein Zufallsgenerator mit festem Samen (Mulberry32): gleiche Zahl, gleiche Folge. */
export function zufall(samen: number): () => number {
  let z = samen >>> 0;
  return () => {
    z = (z + 0x6d2b79f5) >>> 0;
    let t = z;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

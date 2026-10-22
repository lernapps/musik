// Logik der Notenzeile: Lage der Noten im Violinschlüssel, Hilfslinien, Halsrichtung, Startzeiten, Taktstriche und
// Zeilenumbruch. Rein und ohne Browser.
import { istSchwarz, name, nameMitOktave } from "./Musik.ts";

export type Wert = "ganze" | "halbe" | "viertel" | "achtel";
export type Takt = "2/4" | "3/4" | "4/4" | "ohne";

export interface Zeichen {
  /** Halbtöne ab c¹; bei einer Pause ohne Bedeutung. */
  ton: number;
  wert: Wert;
  pause?: boolean;
}

/** Stufe der weißen Taste im Ton (0 = c … 6 = h); schwarze Tasten stehen als Erhöhung auf der Stufe darunter. */
const STUFE = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

/** Dauer in Vierteln: Ganze 4, Halbe 2, Viertel 1, Achtel 0,5. */
export function viertelAnzahl(wert: Wert): number {
  return { ganze: 4, halbe: 2, viertel: 1, achtel: 0.5 }[wert];
}

/**
 * Lage auf dem System in halben Linienabständen: 0 = unterste Linie (e¹), 1 = erster Zwischenraum (f¹), 2 = zweite
 * Linie (g¹) … 8 = oberste Linie (f²); -2 = c¹ (Hilfslinie darunter), 10 = a² (Hilfslinie darüber).
 */
export function lage(ton: number): number {
  const oktave = Math.floor(ton / 12);
  const klasse = ((ton % 12) + 12) % 12;
  return oktave * 7 + (STUFE[klasse] ?? 0) - 2;
}

/** Ob ein ♯ vor die Note gehört (schwarze Taste). */
export function hatKreuz(ton: number): boolean {
  return istSchwarz(ton);
}

/** Lagen der Hilfslinien, die zu einer Note gehören (leer innerhalb des Systems). */
export function hilfslinienLagen(ton: number): number[] {
  const l = lage(ton);
  const lagen: number[] = [];
  const gerade = Math.abs(l % 2) === 0;
  for (let h = -2; h >= (gerade ? l : l + 1); h -= 2) lagen.push(h);
  for (let h = 10; h <= l; h += 2) lagen.push(h);
  return lagen;
}

/** Anzahl der Hilfslinien: c¹ braucht eine, d¹ (im Raum unter dem System) keine, a² eine, c³ drei. */
export function anzahlHilfslinien(ton: number): number {
  const l = lage(ton);
  if (l <= -2) return Math.floor(-l / 2);
  if (l >= 10) return Math.floor((l - 8) / 2);
  return 0;
}

/** Hals nach unten, wenn die Note auf oder über der mittleren Linie steht (ab h¹). */
export function halsNachUnten(ton: number): boolean {
  return lage(ton) >= 4;
}

const TEXT_WERT: Record<Wert, string> = {
  ganze: "Ganze",
  halbe: "Halbe",
  viertel: "Viertel",
  achtel: "Achtel",
};

/** Anzeigename des Werts für aria-label: "Viertel". */
export function wertName(wert: Wert): string {
  return TEXT_WERT[wert];
}

/** Ansage nach dem Antippen: "e¹ (E), Viertelnote". */
export function ansageNote(zeichen: Zeichen): string {
  if (zeichen.pause === true) return `${pauseName(zeichen.wert)}`;
  return `${nameMitOktave(zeichen.ton)} (${name(zeichen.ton)}), ${notenName(zeichen.wert)}`;
}

export function notenName(wert: Wert): string {
  return { ganze: "Ganze Note", halbe: "Halbe Note", viertel: "Viertelnote", achtel: "Achtelnote" }[wert];
}

export function pauseName(wert: Wert): string {
  return { ganze: "Ganze Pause", halbe: "Halbe Pause", viertel: "Viertelpause", achtel: "Achtelpause" }[wert];
}

/** Beschriftung für Screenreader: "Note e¹, Viertel" oder "Pause, Viertel". */
export function beschriftung(zeichen: Zeichen): string {
  return zeichen.pause === true
    ? `Pause, ${wertName(zeichen.wert)}`
    : `Note ${nameMitOktave(zeichen.ton)}, ${wertName(zeichen.wert)}`;
}

export interface Zeit {
  /** Beginn in Sekunden. */
  start: number;
  dauer: number;
}

/** Startzeiten und Dauern in Sekunden bei `tempo` Vierteln pro Minute (Viertel = 60 / tempo). */
export function startzeiten(noten: readonly Zeichen[], tempo: number): Zeit[] {
  const viertel = 60 / (tempo > 0 ? tempo : 80);
  let t = 0;
  return noten.map((n) => {
    const dauer = viertelAnzahl(n.wert) * viertel;
    const zeit = { start: t, dauer };
    t += dauer;
    return zeit;
  });
}

/** Gesamtdauer in Sekunden. */
export function gesamtdauer(noten: readonly Zeichen[], tempo: number): number {
  const z = startzeiten(noten, tempo).at(-1);
  return z === undefined ? 0 : z.start + z.dauer;
}

/** Anzahl der Viertel pro Takt; 0 bei "ohne". */
export function viertelProTakt(takt: Takt): number {
  return takt === "ohne" ? 0 : Number(takt.charAt(0));
}

/** Nummern der Noten, nach denen ein Taktstrich steht (nur wenn der Takt genau voll wird). */
export function taktstriche(noten: readonly Zeichen[], takt: Takt): number[] {
  const laenge = viertelProTakt(takt);
  if (laenge === 0) return [];
  const striche: number[] = [];
  let summe = 0;
  noten.forEach((n, i) => {
    summe += viertelAnzahl(n.wert);
    if (Math.abs(summe % laenge) < 1e-9 || Math.abs((summe % laenge) - laenge) < 1e-9) striche.push(i);
  });
  return striche;
}

/** Breite einer Note (inklusive Abstand) in Einheiten der viewBox: wächst mit der Dauer, aber nur in Maßen. */
export function breiteVon(wert: Wert): number {
  return { ganze: 64, halbe: 54, viertel: 48, achtel: 46 }[wert];
}

export interface UmbruchOptionen {
  /** Platz für Noten in der ersten Zeile (nach Schlüssel und Taktangabe). */
  erste: number;
  /** Platz für Noten in den weiteren Zeilen. */
  andere: number;
  maxProZeile: number;
}

/** Zeilenumbruch: Start- und Endnummer (ohne Ende) der Noten jeder Zeile. Jede Zeile enthält mindestens eine Note. */
export function bricheZeilen(breiten: readonly number[], opt: UmbruchOptionen): [number, number][] {
  const zeilen: [number, number][] = [];
  let anfang = 0;
  let summe = 0;
  breiten.forEach((b, i) => {
    const platz = zeilen.length === 0 ? opt.erste : opt.andere;
    if (i > anfang && (summe + b > platz || i - anfang >= opt.maxProZeile)) {
      zeilen.push([anfang, i]);
      anfang = i;
      summe = 0;
    }
    summe += b;
  });
  if (breiten.length > 0) zeilen.push([anfang, breiten.length]);
  return zeilen;
}

// ---- Zeichenfläche (Einheiten der viewBox; ein Linienabstand ist 10) ----

export const ABSTAND = 10;
export const HALB = ABSTAND / 2;
const LINKS = 8;
const RECHTS = 10;
const SCHLUESSEL = 36;
const TAKTANGABE = 24;
const VORLAUF = 8;
export const MIN_BREITE = 360;
const HALS = 33;

export interface Platz {
  index: number;
  zeichen: Zeichen;
  /** Mitte in x und Höhe der Notenmitte in y (absolut). */
  x: number;
  y: number;
  /** Breite des Platzes. */
  w: number;
  lage: number;
  kreuz: boolean;
  unten: boolean;
  hilfslinien: number[];
  /** Hals-x und Hals-Ende-y (nur Noten mit Hals). */
  hals?: { x: number; y1: number; y2: number };
  fahne: boolean;
  /** Balken zum nächsten Platz (am ersten Platz des Paares). */
  balken?: { x1: number; y1: number; x2: number; y2: number };
}

export interface Zeile {
  /** y der untersten Linie. */
  unten: number;
  /** Höhe der Zeile. */
  hoehe: number;
  plaetze: Platz[];
  striche: number[];
  taktangabe: boolean;
  /** y für die Notennamen. */
  namenY: number;
}

export interface Plan {
  breite: number;
  hoehe: number;
  zeilen: Zeile[];
  schluesselX: number;
}

export interface PlanOptionen {
  namen?: boolean;
  maxBreite?: number;
  maxProZeile?: number;
}

/** Berechnet die Zeichnung: Zeilen, Platz jeder Note, Hilfslinien, Hälse, Balken und Taktstriche. */
export function plane(noten: readonly Zeichen[], takt: Takt, opt: PlanOptionen = {}): Plan {
  const maxBreite = opt.maxBreite ?? MIN_BREITE;
  const maxProZeile = opt.maxProZeile ?? 12;
  const beginn = LINKS + SCHLUESSEL + VORLAUF;
  const breiten = noten.map((n) => breiteVon(n.wert));
  const mitAngabe = takt !== "ohne";
  const umbruch = bricheZeilen(breiten, {
    erste: maxBreite - RECHTS - beginn - (mitAngabe ? TAKTANGABE : 0),
    andere: maxBreite - RECHTS - beginn,
    maxProZeile,
  });
  const bereiche: [number, number][] = umbruch.length > 0 ? umbruch : [[0, 0]];
  const lagen = noten.filter((n) => n.pause !== true).map((n) => lage(n.ton));
  const hoechste = lagen.length > 0 ? Math.max(...lagen) : 8;
  const tiefste = lagen.length > 0 ? Math.min(...lagen) : 0;
  const ueber = Math.max(54, hoechste * HALB + 14);
  const unterOhneNamen = 30 + Math.max(0, -tiefste - 2) * HALB;
  const unter = unterOhneNamen + (opt.namen === true ? 18 : 0);
  const hoehe = ueber + 4 * ABSTAND + unter;
  const strichNach = new Set(taktstriche(noten, takt));
  const zeilen: Zeile[] = [];
  let breite = maxBreite;
  const starts = startzeiten(noten, 60).map((z) => z.start);
  bereiche.forEach(([von, bis], z) => {
    const unten = z * hoehe + ueber + 4 * ABSTAND;
    let cursor = beginn + (z === 0 && mitAngabe ? TAKTANGABE : 0);
    const plaetze: Platz[] = [];
    const striche: number[] = [];
    for (let i = von; i < bis; i++) {
      const zeichen = noten[i] as Zeichen;
      const w = breiten[i] ?? 0;
      const l = lage(zeichen.ton);
      const pause = zeichen.pause === true;
      const x = cursor + w / 2;
      cursor += w;
      const platz: Platz = {
        index: i,
        zeichen,
        x,
        y: pause ? unten - 2 * ABSTAND : unten - l * HALB,
        w,
        lage: l,
        kreuz: !pause && hatKreuz(zeichen.ton),
        unten: !pause && halsNachUnten(zeichen.ton),
        hilfslinien: pause ? [] : hilfslinienLagen(zeichen.ton).map((h) => unten - h * HALB),
        fahne: !pause && zeichen.wert === "achtel",
      };
      plaetze.push(platz);
      if (strichNach.has(i)) striche.push(cursor);
    }
    // Balken: zwei Achtel, das erste auf einem Schlag, beide in dieser Zeile.
    for (let k = 0; k + 1 < plaetze.length; k++) {
      const a = plaetze[k] as Platz;
      const b = plaetze[k + 1] as Platz;
      const beginntAufSchlag = Math.abs((starts[a.index] ?? 0) % 1) < 1e-9;
      if (a.fahne && b.fahne && beginntAufSchlag) {
        const unterHals = (a.lage + b.lage) / 2 >= 4;
        a.unten = unterHals;
        b.unten = unterHals;
        a.fahne = false;
        b.fahne = false;
        const sx = (p: Platz) => p.x + (unterHals ? -6.4 : 6.4);
        const sy = (p: Platz) => p.y + (unterHals ? HALS : -HALS);
        a.balken = { x1: sx(a), y1: sy(a), x2: sx(b), y2: sy(b) };
        k++;
      }
    }
    for (const p of plaetze) {
      if (p.zeichen.pause === true || p.zeichen.wert === "ganze") continue;
      const sx = p.x + (p.unten ? -6.4 : 6.4);
      p.hals = { x: sx, y1: p.y, y2: p.y + (p.unten ? HALS : -HALS) };
    }
    breite = Math.max(breite, cursor + RECHTS);
    zeilen.push({
      unten,
      hoehe,
      plaetze,
      striche,
      taktangabe: z === 0 && mitAngabe,
      namenY: unten + unter - 6,
    });
  });
  const anzahl = Math.max(1, zeilen.length);
  return { breite, hoehe: anzahl * hoehe, zeilen, schluesselX: LINKS };
}

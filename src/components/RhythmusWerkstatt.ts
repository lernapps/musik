// Rechnen für die Rhythmus-Werkstatt: Felder, Zählhilfe, Notenwerte, Zeitpläne und der Klatsch-Vergleich.
// Reine Funktionen ohne Browser, darum mit künstlichen Daten prüfbar.
import { schlaege, viertelDauer } from "./Musik.ts";
import type { Taktart } from "./Musik.ts";
import { vergleiche } from "./Analyse.ts";

export type Raster = "viertel" | "achtel";

export const TEMPO_MIN = 40;
export const TEMPO_MAX = 160;
export const TEMPO_SCHRITT = 5;
export const TOLERANZ = 0.15;
/** Abstand der Lautstärke-Messwerte in Sekunden. */
export const MESS_SCHRITT = 0.01;

/** Felder pro Zählzeit: 2 beim Achtelraster, 1 beim Viertelraster. */
export function felderProSchlag(raster: Raster): number {
  return raster === "achtel" ? 2 : 1;
}

/** Felder in einem Takt: Achtelraster `schlaege * 2`, Viertelraster `schlaege`. */
export function felderProTakt(taktart: Taktart, raster: Raster): number {
  return schlaege(taktart) * felderProSchlag(raster);
}

/** Anzahl der Takte, auf 1 bis 4 begrenzt (ganze Zahl). */
export function klemmeTakte(takte: number): number {
  if (!Number.isFinite(takte)) return 1;
  return Math.min(4, Math.max(1, Math.round(takte)));
}

/** Tempo in BPM, auf 40 bis 160 begrenzt (ganze Zahl). */
export function klemmeTempo(tempo: number): number {
  if (!Number.isFinite(tempo)) return 80;
  return Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, Math.round(tempo)));
}

/** Felder insgesamt. */
export function felderZahl(taktart: Taktart, takte: number, raster: Raster): number {
  return felderProTakt(taktart, raster) * klemmeTakte(takte);
}

/** Bringt ein Muster auf genau `anzahl` Felder: fehlende sind aus, überzählige fallen weg. */
export function passeMusterAn(muster: boolean[] | undefined, anzahl: number): boolean[] {
  return Array.from({ length: anzahl }, (_, i) => muster?.[i] === true);
}

/** Zählhilfe für einen Takt: Achtel „1 + 2 + 3 + 4 +“, Viertel „1 2 3 4“. */
export function zaehlhilfe(taktart: Taktart, raster: Raster): string[] {
  const liste: string[] = [];
  for (let s = 1; s <= schlaege(taktart); s++) {
    liste.push(String(s));
    if (raster === "achtel") liste.push("+");
  }
  return liste;
}

/** Die Zählhilfe als Text, zum Beispiel „1 + 2 + 3 + 4 +“. */
export function zaehlhilfeText(taktart: Taktart, raster: Raster): string {
  return zaehlhilfe(taktart, raster).join(" ");
}

/** Ist das Feld ein Schlag (Zahl) und kein „und“? */
export function aufSchlag(index: number, raster: Raster): boolean {
  return index % felderProSchlag(raster) === 0;
}

/** Name eines Feldes (0-basiert), zum Beispiel „Takt 1, Zählzeit 2 und“. */
export function feldName(index: number, taktart: Taktart, raster: Raster): string {
  const proTakt = felderProTakt(taktart, raster);
  const takt = Math.floor(index / proTakt) + 1;
  const imTakt = index % proTakt;
  const zahl = Math.floor(imTakt / felderProSchlag(raster)) + 1;
  return `Takt ${takt}, Zählzeit ${zahl}${aufSchlag(imTakt, raster) ? "" : " und"}`;
}

/** Notenwerte eines Takts als Folge, zum Beispiel ["Viertel", "Achtel", "Achtel", "Viertelpause"]. */
function notenwerteImTakt(felder: boolean[], raster: Raster): string[] {
  const folge: string[] = [];
  if (raster === "viertel") {
    for (const an of felder) folge.push(an ? "Viertel" : "Viertelpause");
    return folge;
  }
  for (let i = 0; i < felder.length; i += 2) {
    const schlag = felder[i] === true;
    const und = felder[i + 1] === true;
    if (schlag && und) folge.push("Achtel", "Achtel");
    else if (schlag) folge.push("Viertel");
    else if (und) folge.push("Achtelpause", "Achtel");
    else folge.push("Viertelpause");
  }
  return folge;
}

/** Notenwerte je Takt. */
export function notenwerteProTakt(muster: boolean[], taktart: Taktart, takte: number, raster: Raster): string[][] {
  const proTakt = felderProTakt(taktart, raster);
  const n = klemmeTakte(takte);
  const felder = passeMusterAn(muster, proTakt * n);
  return Array.from({ length: n }, (_, t) => notenwerteImTakt(felder.slice(t * proTakt, (t + 1) * proTakt), raster));
}

/** Notenwerte als Text; Takte durch „ | “ getrennt. */
export function notenwerteText(muster: boolean[], taktart: Taktart, takte: number, raster: Raster): string {
  return notenwerteProTakt(muster, taktart, takte, raster)
    .map((takt) => takt.join(", "))
    .join(" | ");
}

/** Dauer eines Feldes in Sekunden. */
export function feldDauer(tempo: number, raster: Raster): number {
  return viertelDauer(klemmeTempo(tempo)) / felderProSchlag(raster);
}

/** Dauer des ganzen Rasters in Sekunden. */
export function gesamtDauer(taktart: Taktart, takte: number, raster: Raster, tempo: number): number {
  return felderZahl(taktart, takte, raster) * feldDauer(tempo, raster);
}

/** Soll-Zeiten (Sekunden) der aktiven Felder; `beginn` ist der Start des Musters, etwa nach der Einzählung. */
export function sollZeiten(muster: boolean[], tempo: number, raster: Raster, beginn = 0): number[] {
  const dauer = feldDauer(tempo, raster);
  const zeiten: number[] = [];
  muster.forEach((an, i) => {
    if (an) zeiten.push(beginn + i * dauer);
  });
  return zeiten;
}

/** Indizes der aktiven Felder, in derselben Reihenfolge wie `sollZeiten`. */
export function aktiveFelder(muster: boolean[]): number[] {
  const liste: number[] = [];
  muster.forEach((an, i) => {
    if (an) liste.push(i);
  });
  return liste;
}

export interface KlickPlan {
  /** Beginn in Sekunden. */
  start: number;
  betont: boolean;
}

/** Metronom-Klicks: einer pro Schlag, der erste im Takt betont. */
export function klickPlan(taktart: Taktart, takte: number, tempo: number, beginn = 0): KlickPlan[] {
  const proTakt = schlaege(taktart);
  const viertel = viertelDauer(klemmeTempo(tempo));
  const plan: KlickPlan[] = [];
  for (let i = 0; i < proTakt * klemmeTakte(takte); i++) {
    plan.push({ start: beginn + i * viertel, betont: i % proTakt === 0 });
  }
  return plan;
}

/** Dauer der Einzählung: ein Takt. */
export function einzaehlDauer(taktart: Taktart, tempo: number): number {
  return schlaege(taktart) * viertelDauer(klemmeTempo(tempo));
}

/** Ein geplantes Ereignis: ein Klopfton oder ein Klick. */
export interface Ereignis {
  start: number;
  art: "ton" | "klick";
  betont: boolean;
}

/** Auswahl im Feld „Wie oft?“. */
export const DURCHGANG_WAHL = [1, 2, 4, 8] as const;

/** Die Auswahl, die zu einer Zahl von Durchgängen (1 bis 8) am besten passt. */
export function waehleDurchgaenge(n: number): number {
  const zahl = Number.isFinite(n) ? Math.min(8, Math.max(1, Math.round(n))) : 1;
  let beste: number = DURCHGANG_WAHL[0];
  for (const w of DURCHGANG_WAHL) if (Math.abs(w - zahl) <= Math.abs(beste - zahl)) beste = w;
  return beste;
}

/** Dauer eines Durchgangs in Sekunden (alle Takte). */
export function durchgangDauer(taktart: Taktart, takte: number, raster: Raster, tempo: number): number {
  return gesamtDauer(taktart, takte, raster, tempo);
}

export interface PlanOptionen {
  muster: boolean[];
  taktart: Taktart;
  takte: number;
  raster: Raster;
  tempo: number;
  ton: boolean;
  metronom: boolean;
}

/** Klicks der Einzählung: ein Takt, ab Zeit 0. */
export function einzaehlEreignisse(taktart: Taktart, tempo: number): Ereignis[] {
  return klickPlan(taktart, 1, tempo).map((k) => ({ start: k.start, art: "klick", betont: k.betont }));
}

/**
 * Ereignisse des Durchgangs `nr` (0-basiert). Der Durchgang beginnt bei `beginn + nr * Durchgangsdauer`;
 * die Durchgänge schließen darum ohne Lücke aneinander an.
 */
export function durchgangEreignisse(opts: PlanOptionen, nr: number, beginn: number): Ereignis[] {
  const start = beginn + nr * durchgangDauer(opts.taktart, opts.takte, opts.raster, opts.tempo);
  const liste: Ereignis[] = [];
  if (opts.metronom) {
    for (const k of klickPlan(opts.taktart, opts.takte, opts.tempo, start)) {
      liste.push({ start: k.start, art: "klick", betont: k.betont });
    }
  }
  if (opts.ton) {
    for (const zeit of sollZeiten(opts.muster, opts.tempo, opts.raster, start)) {
      liste.push({ start: zeit, art: "ton", betont: false });
    }
  }
  return liste.sort((a, b) => a.start - b.start);
}

/**
 * Der ganze Zeitplan über `durchgaenge` Durchgänge, nach Beginn sortiert. `einzaehlen`: ein Takt Klick vorweg,
 * nur einmal am Anfang; das Muster beginnt dann nach der Einzählung.
 */
export function zeitplan(opts: PlanOptionen & { einzaehlen: boolean; durchgaenge?: number }): {
  ereignisse: Ereignis[];
  beginn: number;
  dauer: number;
} {
  const beginn = opts.einzaehlen ? einzaehlDauer(opts.taktart, opts.tempo) : 0;
  const anzahl = Math.min(8, Math.max(1, Math.round(opts.durchgaenge ?? 1)));
  const ereignisse: Ereignis[] = opts.einzaehlen ? einzaehlEreignisse(opts.taktart, opts.tempo) : [];
  for (let nr = 0; nr < anzahl; nr++) ereignisse.push(...durchgangEreignisse(opts, nr, beginn));
  ereignisse.sort((a, b) => a.start - b.start);
  return {
    ereignisse,
    beginn,
    dauer: beginn + anzahl * durchgangDauer(opts.taktart, opts.takte, opts.raster, opts.tempo),
  };
}

/** Welches Feld klingt zur Zeit `t` (ab Beginn des Musters, innerhalb eines Durchgangs)? -1 vor dem Start oder nach dem Ende. */
export function laufendesFeld(t: number, tempo: number, raster: Raster, anzahl: number): number {
  if (t < 0) return -1;
  const i = Math.floor(t / feldDauer(tempo, raster));
  return i >= anzahl ? -1 : i;
}

/** Nummer des Durchgangs (1-basiert) zur Zeit `t` ab Beginn des Musters; 0 davor. `maximal`: letzter Durchgang. */
export function durchgangNr(t: number, dauer: number, maximal = Infinity): number {
  if (t < 0 || dauer <= 0) return 0;
  return Math.min(maximal, Math.floor(t / dauer) + 1);
}

/** Feld im aktuellen Durchgang zur Zeit `t` (ab Beginn des Musters), über Durchgangsgrenzen hinweg. */
export function feldImDurchgang(t: number, dauer: number, tempo: number, raster: Raster, anzahl: number): number {
  if (t < 0 || dauer <= 0) return -1;
  return laufendesFeld(t % dauer, tempo, raster, anzahl);
}

/** Zahl des Schlags beim Einzählen (1-basiert) zur Zeit `t` ab Start; 0 außerhalb der Einzählung. */
export function einzaehlZahl(t: number, taktart: Taktart, tempo: number): number {
  if (t < 0 || t >= einzaehlDauer(taktart, tempo)) return 0;
  return Math.floor(t / viertelDauer(klemmeTempo(tempo))) + 1;
}

/** Das nächste Feld, das geklatscht werden soll (aktives Feld), zur Zeit `t` ab Beginn des Musters im Durchgang. */
export function naechstesFeld(muster: boolean[], t: number, tempo: number, raster: Raster, weitere: boolean): number {
  const dauer = feldDauer(tempo, raster);
  const aktive = aktiveFelder(muster);
  const zeit = t % (dauer * muster.length);
  const naechste = aktive.find((i) => i * dauer >= (t < 0 ? 0 : zeit) - dauer / 2);
  if (naechste !== undefined) return naechste;
  return weitere ? (aktive[0] ?? -1) : -1;
}

/** Text zur Anzeige des Durchgangs: „Durchgang 2 von 4“ oder „Durchgang 3 (dauerhaft)“. */
export function durchgangText(nr: number, von: number, dauerhaft: boolean): string {
  return dauerhaft ? `Durchgang ${nr} (dauerhaft)` : `Durchgang ${nr} von ${von}`;
}

/** Effektivwert (Lautstärke) der letzten `n` Abtastwerte eines Blocks; ohne `n` des ganzen Blocks. */
export function effektivwert(block: Float32Array, n?: number): number {
  const anzahl = Math.min(block.length, n ?? block.length);
  if (anzahl <= 0) return 0;
  let summe = 0;
  for (let i = block.length - anzahl; i < block.length; i++) summe += (block[i] ?? 0) ** 2;
  return Math.sqrt(summe / anzahl);
}

/**
 * Trägt einen Messwert in den Lautstärke-Verlauf ein (ein Wert je `schritt` Sekunden). Wurde zwischendurch nicht
 * gemessen, gilt der letzte Wert weiter. Zeiten vor 0 werden ignoriert.
 */
export function fuelleVerlauf(verlauf: number[], schritt: number, zeit: number, wert: number): void {
  if (zeit < 0) return;
  const bis = Math.floor(zeit / schritt);
  const letzter = verlauf[verlauf.length - 1] ?? wert;
  while (verlauf.length < bis) verlauf.push(letzter);
  if (verlauf.length === bis) verlauf.push(wert);
}

export interface Klatschergebnis {
  /** Welche aktiven Felder in welchem Durchgang (1-basiert) getroffen wurden. */
  felder: { index: number; durchgang: number; getroffen: boolean }[];
  getroffen: number;
  soll: number;
  zuviel: number;
}

/** Soll-Zeiten über mehrere Durchgänge hintereinander. */
export function sollZeitenAlle(
  muster: boolean[],
  tempo: number,
  raster: Raster,
  beginn: number,
  durchgaenge: number,
): number[] {
  const dauer = muster.length * feldDauer(tempo, raster);
  const zeiten: number[] = [];
  for (let nr = 0; nr < durchgaenge; nr++) zeiten.push(...sollZeiten(muster, tempo, raster, beginn + nr * dauer));
  return zeiten;
}

/**
 * Vergleicht geklatschte Zeiten (ab Start der Aufnahme) mit dem Muster über alle Durchgänge zusammen. Klicks der
 * Einzählung (vor `beginn`) zählen nicht als Klatschen.
 */
export function wertAus(
  muster: boolean[],
  ist: number[],
  tempo: number,
  raster: Raster,
  beginn: number,
  durchgaenge = 1,
  toleranz = TOLERANZ,
): Klatschergebnis {
  const soll = sollZeitenAlle(muster, tempo, raster, beginn, durchgaenge);
  const indizes = aktiveFelder(muster);
  const nutzbar = ist.filter((z) => z >= beginn - 0.1);
  const frei = [...nutzbar];
  const treffer = soll.map((zeit) => {
    let beste = -1;
    let abstand = Infinity;
    frei.forEach((k, i) => {
      const d = Math.abs(k - zeit);
      if (d < abstand) {
        abstand = d;
        beste = i;
      }
    });
    if (beste >= 0 && abstand <= toleranz) {
      frei.splice(beste, 1);
      return true;
    }
    return false;
  });
  const gesamt = vergleiche(soll, nutzbar, toleranz);
  return {
    felder: soll.map((_, i) => ({
      index: indizes[i % Math.max(1, indizes.length)] ?? 0,
      durchgang: Math.floor(i / Math.max(1, indizes.length)) + 1,
      getroffen: treffer[i] === true,
    })),
    getroffen: gesamt.getroffen,
    soll: soll.length,
    zuviel: gesamt.zuviel,
  };
}

/** Ergebnis als Satz, zum Beispiel „5 von 6 Schlägen getroffen, 1 zu viel“. */
export function ergebnisText(erg: Klatschergebnis): string {
  if (erg.soll === 0) return "Im Muster ist kein Schlag. Tippe erst ein paar Felder an.";
  const zuviel = erg.zuviel === 0 ? "" : `, ${erg.zuviel} zu viel`;
  return `${erg.getroffen} von ${erg.soll} ${erg.soll === 1 ? "Schlag" : "Schlägen"} getroffen${zuviel}`;
}

/** Vergleicht zwei Muster (Nachbauen): Anzahl der Felder, die sich unterscheiden. */
export function unterschiede(muster: boolean[], vorbild: boolean[]): number {
  const n = Math.max(muster.length, vorbild.length);
  let anzahl = 0;
  for (let i = 0; i < n; i++) if ((muster[i] === true) !== (vorbild[i] === true)) anzahl++;
  return anzahl;
}

/** Rückmeldung zum Nachbauen, ohne das Vorbild zu verraten. */
export function nachbauText(anzahl: number): string {
  if (anzahl === 0) return "Genau! Dein Muster klingt wie das Vorbild.";
  return `Noch ${anzahl} ${anzahl === 1 ? "Feld ist" : "Felder sind"} anders als beim Vorbild. Hör es dir noch einmal an.`;
}

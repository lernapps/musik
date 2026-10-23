// Logik des Stimmspiegels: Stimme einem Ton zuordnen, Treffer zählen, Rückmeldung formulieren und den Verlauf auf
// SVG-Koordinaten abbilden. Reine Funktionen, ohne Browser, darum mit künstlichen Testtönen prüfbar.
import { frequenz, name, nameMitOktave } from "./Musik.ts";

/** Wie lange der Ton am Stück im Zielband liegen muss (Sekunden). */
export const HALTEZEIT = 0.4;
/** Kurze Pause nach einem Treffer in einer Folge (Sekunden). */
export const PAUSE = 0.3;
/** Das Zielband reicht 50 Cent (einen halben Halbton) nach oben und unten. */
export const TOLERANZ = 50;

/** Halbtöne ab c¹, auch mit Nachkommastellen (zwischen den Tönen). */
export function halbton(hz: number): number {
  return 12 * Math.log2(hz / frequenz(0));
}

export interface Zuordnung {
  /** Gesungene Höhe in Halbtönen ab c¹ (mit Nachkommastellen). */
  halbton: number;
  /** Der Ton, der der Stimme am nächsten liegt (ganze Halbtöne ab c¹). */
  ton: number;
  /** Das Ziel in der Oktave, die verglichen wird (bei `ohneOktave`: die der Stimme nächste). */
  ziel: number;
  /** Abweichung der Stimme vom Ziel in Cent; positiv heißt zu hoch. */
  abweichung: number;
}

/** Ordnet eine Frequenz (Hz) dem Ziel zu. Mit `ohneOktave` zählt nur der Tonname, die Oktave ist egal. */
export function zuordnen(hz: number, ziel: number, ohneOktave: boolean): Zuordnung {
  const h = halbton(hz);
  const zielDort = ohneOktave ? ziel + 12 * Math.round((h - ziel) / 12) : ziel;
  return { halbton: h, ton: Math.round(h), ziel: zielDort, abweichung: (h - zielDort) * 100 };
}

/** Liegt die Stimme im Zielband (±50 Cent)? */
export function imBand(abweichung: number): boolean {
  return Math.abs(abweichung) <= TOLERANZ + 1e-9;
}

/** Zeichnet "+20", "−20" (mit echtem Minuszeichen) oder "0". */
export function centText(cent: number): string {
  const r = Math.round(cent);
  if (r > 0) return `+${r}`;
  if (r < 0) return `−${-r}`;
  return "0";
}

function tonName(ton: number, ohneOktave: boolean): string {
  return ohneOktave ? name(ton) : nameMitOktave(ton);
}

/**
 * Der Satz unter dem Diagramm. `gehalten`: der Ton wurde lange genug im Zielband gehalten („getroffen“).
 * `hz` ≤ 0 heißt: kein Ton zu hören.
 */
export function rueckmeldung(hz: number, ziel: number, ohneOktave: boolean, gehalten: boolean): string {
  if (!(hz > 0)) return "Kein Ton zu hören.";
  const z = zuordnen(hz, ziel, ohneOktave);
  const gesungen = tonName(z.ton, ohneOktave);
  const r = Math.round(z.abweichung);
  const vorn = `Du singst gerade: ${gesungen}`;
  if (imBand(z.abweichung) && gehalten) return `${vorn}, getroffen!`;
  const richtung = r > 0 ? "hoch" : "tief";
  if (Math.abs(r) <= 15) return `${vorn}, genau (${centText(r)} Cent)`;
  if (Math.abs(r) <= TOLERANZ) return `${vorn}, ein wenig zu ${richtung} (${centText(r)} Cent)`;
  return `${vorn}, zu ${richtung} (${centText(r)} Cent). Gesucht: ${tonName(z.ziel, ohneOktave)}.`;
}

/* ---------- Treffer-Zustandsautomat ---------- */

export interface Lauf {
  /** Welcher Ton der Folge gerade dran ist (0-basiert). */
  index: number;
  anzahl: number;
  /** Wie lange der Ton schon am Stück im Zielband liegt (Sekunden). */
  imBand: number;
  /** Restliche Pause nach einem Treffer (Sekunden). */
  pause: number;
  fertig: boolean;
  getroffen: boolean[];
}

export function neuerLauf(anzahl: number): Lauf {
  const n = Math.max(1, anzahl);
  return { index: 0, anzahl: n, imBand: 0, pause: 0, fertig: false, getroffen: Array.from({ length: n }, () => false) };
}

/**
 * Ein Schritt von `dt` Sekunden. `treffer`: die Stimme liegt in diesem Schritt im Zielband. Verlässt sie das Band
 * (oder ist still), beginnt die Zeit von vorn. Nach einem Treffer wartet die Folge kurz und geht dann weiter.
 */
export function weiter(lauf: Lauf, treffer: boolean, dt: number): Lauf {
  if (lauf.fertig) return lauf;
  if (lauf.pause > 0) {
    const rest = lauf.pause - dt;
    if (rest > 1e-9) return { ...lauf, pause: rest };
    return { ...lauf, pause: 0, imBand: 0, index: lauf.index + 1 };
  }
  if (!treffer) return lauf.imBand === 0 ? lauf : { ...lauf, imBand: 0 };
  const zeit = lauf.imBand + dt;
  if (zeit + 1e-9 < HALTEZEIT) return { ...lauf, imBand: zeit };
  const getroffen = lauf.getroffen.slice();
  getroffen[lauf.index] = true;
  if (lauf.index >= lauf.anzahl - 1) return { ...lauf, imBand: HALTEZEIT, getroffen, fertig: true };
  return { ...lauf, imBand: HALTEZEIT, getroffen, pause: PAUSE };
}

/** Wurde der aktuelle Ton gerade lange genug gehalten? */
export function gehalten(lauf: Lauf): boolean {
  return lauf.fertig || lauf.pause > 0 || lauf.imBand + 1e-9 >= HALTEZEIT;
}

/** „Ton 2 von 4“. */
export function fortschritt(lauf: Lauf): string {
  return `Ton ${Math.min(lauf.index + 1, lauf.anzahl)} von ${lauf.anzahl}`;
}

/* ---------- Verlauf ---------- */

export interface Probe {
  /** Zeit in Sekunden seit dem Start des Mikrofons. */
  t: number;
  halbton: number;
}

/** Behält nur die Proben der letzten `fenster` Sekunden. */
export function verlaufKuerzen(proben: Probe[], jetzt: number, fenster = 6): Probe[] {
  return proben.filter((p) => p.t >= jetzt - fenster);
}

/** Mittlere Tonhöhe (Median) der letzten `fenster` Sekunden in Hz; 0, wenn nichts zu hören war. */
export function glaettung(proben: Probe[], jetzt: number, fenster = 0.5): number {
  const werte = proben
    .filter((p) => p.t >= jetzt - fenster)
    .map((p) => p.halbton)
    .sort((a, b) => a - b);
  if (werte.length === 0) return 0;
  const mitte = Math.floor(werte.length / 2);
  const h = werte.length % 2 === 1 ? (werte[mitte] ?? 0) : ((werte[mitte - 1] ?? 0) + (werte[mitte] ?? 0)) / 2;
  return frequenz(h);
}

export interface Rahmen {
  breite: number;
  hoehe: number;
  links: number;
  rechts: number;
  oben: number;
  unten: number;
}

export const RAHMEN: Rahmen = { breite: 360, hoehe: 170, links: 34, rechts: 10, oben: 10, unten: 22 };

export interface Punkt {
  x: number;
  y: number;
}

export interface Abbildung {
  /** Sichtbarer Bereich in Halbtönen. */
  von: number;
  bis: number;
  punkte: Punkt[];
  /** Zusammenhängende Stücke der Linie als `points`-Texte (bei Pausen wird die Linie unterbrochen). */
  linien: string[];
  /** Zielband ±50 Cent. */
  band: { y: number; hoehe: number };
  zielY: number;
  ticks: { y: number; text: string }[];
}

function runde(zahl: number): number {
  return Math.round(zahl * 10) / 10;
}

/**
 * Bildet den Verlauf auf SVG-Koordinaten ab. Die Zeit läuft nach rechts (rechts ist „jetzt“), die Höhe nach oben.
 * Der Bereich folgt der Stimme und enthält immer das Zielband.
 */
export function abbilden(
  proben: Probe[],
  jetzt: number,
  zielAnzeige: number,
  ohneOktave: boolean,
  fenster = 6,
  rahmen: Rahmen = RAHMEN,
  mindestens = 6,
): Abbildung {
  const sichtbar = verlaufKuerzen(proben, jetzt, fenster);
  let tief = zielAnzeige - 1;
  let hoch = zielAnzeige + 1;
  for (const p of sichtbar) {
    tief = Math.min(tief, p.halbton);
    hoch = Math.max(hoch, p.halbton);
  }
  tief -= 0.5;
  hoch += 0.5;
  if (hoch - tief < mindestens) {
    const mitte = (hoch + tief) / 2;
    tief = mitte - mindestens / 2;
    hoch = mitte + mindestens / 2;
  }
  const breite = rahmen.breite - rahmen.links - rahmen.rechts;
  const hoehe = rahmen.hoehe - rahmen.oben - rahmen.unten;
  const xVon = (t: number): number => runde(rahmen.links + ((t - (jetzt - fenster)) / fenster) * breite);
  const yVon = (h: number): number => runde(rahmen.oben + ((hoch - h) / (hoch - tief)) * hoehe);

  const punkte = sichtbar.map((p) => ({ x: xVon(p.t), y: yVon(p.halbton) }));
  const linien: string[] = [];
  let stueck: string[] = [];
  let davor: number | undefined;
  sichtbar.forEach((p, i) => {
    const punkt = punkte[i];
    if (!punkt) return;
    if (davor !== undefined && p.t - davor > 0.2 && stueck.length > 0) {
      linien.push(stueck.join(" "));
      stueck = [];
    }
    stueck.push(`${punkt.x},${punkt.y}`);
    davor = p.t;
  });
  if (stueck.length > 0) linien.push(stueck.join(" "));

  const schritt = Math.max(1, Math.ceil((hoch - tief) / 9));
  const ticks: { y: number; text: string }[] = [];
  for (let t = Math.ceil(tief / schritt) * schritt; t <= hoch; t += schritt) {
    ticks.push({ y: yVon(t), text: tonName(t, ohneOktave) });
  }
  const oben = yVon(zielAnzeige + TOLERANZ / 100);
  const unten = yVon(zielAnzeige - TOLERANZ / 100);
  return {
    von: tief,
    bis: hoch,
    punkte,
    linien,
    band: { y: oben, hoehe: runde(unten - oben) },
    zielY: yVon(zielAnzeige),
    ticks,
  };
}

/* ---------- Eigene Melodie ---------- */

/** Die weißen Töne von c¹ bis c², die zur Auswahl stehen (Halbtöne ab c¹). */
export const WEISSE_TOENE = [0, 2, 4, 5, 7, 9, 11, 12];

const VORGABE = [0, 2, 4, 7, 9, 12];

/** Anzahl der Auswahlfelder: 0 (aus) oder 2 bis 6. */
export function eigeneAnzahl(eigene: number): number {
  if (!(eigene > 0)) return 0;
  return Math.min(6, Math.max(2, Math.round(eigene)));
}

/** Voreinstellung: C D E G A c². */
export function standardMelodie(anzahl: number): number[] {
  return VORGABE.slice(0, eigeneAnzahl(anzahl));
}

/** Beschriftung im Auswahlfeld, z. B. „C (c¹)“. */
export function auswahlName(ton: number): string {
  return `${name(ton)} (${nameMitOktave(ton)})`;
}

/** Baut die Folge aus der Auswahl: genau `anzahl` Töne; Fehlendes oder Ungültiges wird durch die Voreinstellung ersetzt. */
export function melodie(auswahl: number[], anzahl: number): number[] {
  return Array.from({ length: eigeneAnzahl(anzahl) }, (_, i) => {
    const ton = auswahl[i];
    return ton !== undefined && WEISSE_TOENE.includes(ton) ? ton : (VORGABE[i] ?? 0);
  });
}

/** Wie lange das Mikrofon nach `dauer` Sekunden Abspielen taub bleibt: Vorlauf 0,05 s, Ausklang des Klaviers 0,14 s, Nachhall 0,4 s. */
export function sperrzeit(dauer: number): number {
  return dauer + 0.05 + 0.14 + 0.4;
}

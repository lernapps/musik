// Logik der Hör-Aufgabe: Aufgaben aus einem Samen erzeugen, Antworten prüfen, erklären. Rein und ohne Browser.
import {
  frequenz,
  INTERVALLE,
  intervallName,
  nameMitOktave,
  schlaege,
  tonleiter,
  zufall,
  type Taktart,
  type Tonart,
} from "./Musik.ts";

export type Art = "hoeher" | "lauter" | "intervall" | "dur-moll" | "takt";

export interface Aufgabe {
  art: Art;
  /** Töne in Halbtönen ab c¹ (leer bei „takt“). */
  toene: number[];
  /** Lautstärke je Ton (0 bis 1). */
  laut: number[];
  /** Antwortknöpfe in der gezeigten Reihenfolge. */
  optionen: string[];
  /** Die richtige Antwort. */
  loesung: string;
  taktart?: Taktart;
  bpm?: number;
}

export interface Klick {
  start: number;
  betont: boolean;
}

const ARTEN: Art[] = ["hoeher", "lauter", "intervall", "dur-moll", "takt"];
const TAKTARTEN: Taktart[] = ["2/4", "3/4", "4/4"];
const INTERVALL_MENGE = [3, 4, 5, 7, 12];
const TAKTE = 3;
const TON_DAUER = 0.8;
const PAUSE = 0.3;
const SKALA_DAUER = 0.5;

export const HOEHER_1 = "Ton 1 ist höher";
export const HOEHER_2 = "Ton 2 ist höher";
export const LAUTER_1 = "Ton 1 ist lauter";
export const LAUTER_2 = "Ton 2 ist lauter";

function artVon(props: { art?: string }): Art {
  return ARTEN.find((a) => a === props.art) ?? "hoeher";
}

function ganz(rnd: () => number, von: number, bis: number): number {
  return von + Math.floor(rnd() * (bis - von + 1));
}

function mische<T>(liste: T[], rnd: () => number): T[] {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = ganz(rnd, 0, i);
    const tmp = kopie[i] as T;
    kopie[i] = kopie[j] as T;
    kopie[j] = tmp;
  }
  return kopie;
}

/** Erzeugt die Aufgabe Nummer `seed`: gleiche Zahl, gleiche Aufgabe. */
export function generate(seed: number, props: { art?: string }): Aufgabe {
  const art = artVon(props);
  const rnd = zufall(Math.floor(seed) * 40503 + ARTEN.indexOf(art) * 977 + 1);
  rnd();
  rnd();
  if (art === "hoeher") {
    const a = ganz(rnd, 0, 24);
    let b = ganz(rnd, 0, 24);
    while (Math.abs(a - b) < 2) b = ganz(rnd, 0, 24);
    // Die Hälfte der Aufgaben spielt den höheren Ton leiser: Lautstärke ist nicht Höhe.
    let laut = [0.25, 0.25];
    if (rnd() < 0.5) laut = a > b === rnd() < 0.5 ? [0.12, 0.25] : [0.25, 0.12];
    return {
      art,
      toene: [a, b],
      laut,
      optionen: [HOEHER_1, HOEHER_2],
      loesung: a > b ? HOEHER_1 : HOEHER_2,
    };
  }
  if (art === "lauter") {
    const ton = ganz(rnd, 0, 24);
    const leise = [0.06, 0.08][ganz(rnd, 0, 1)] ?? 0.08;
    const laut = [0.25, 0.3][ganz(rnd, 0, 1)] ?? 0.25;
    const ersterLauter = rnd() < 0.5;
    return {
      art,
      toene: [ton, ton],
      laut: ersterLauter ? [laut, leise] : [leise, laut],
      optionen: [LAUTER_1, LAUTER_2],
      loesung: ersterLauter ? LAUTER_1 : LAUTER_2,
    };
  }
  if (art === "intervall") {
    const start = ganz(rnd, 0, 12);
    const halbtoene = INTERVALL_MENGE[ganz(rnd, 0, INTERVALL_MENGE.length - 1)] ?? 7;
    const loesung = intervallName(halbtoene);
    const andere = mische(
      INTERVALL_MENGE.filter((h) => h !== halbtoene),
      rnd,
    ).slice(0, 3);
    const optionen = mische([halbtoene, ...andere], rnd).map(intervallName);
    return { art, toene: [start, start + halbtoene], laut: [0.25, 0.25], optionen, loesung };
  }
  if (art === "dur-moll") {
    const grund = ganz(rnd, 0, 7);
    const tonart: Tonart = rnd() < 0.5 ? "dur" : "moll";
    return {
      art,
      toene: tonleiter(grund, tonart),
      laut: Array.from({ length: 8 }, () => 0.25),
      optionen: mische(["Dur", "Moll"], rnd),
      loesung: tonart === "dur" ? "Dur" : "Moll",
    };
  }
  const taktart = TAKTARTEN[ganz(rnd, 0, 2)] ?? "4/4";
  const bpm = [72, 80, 88, 96, 104, 112][ganz(rnd, 0, 5)] ?? 88;
  return { art, toene: [], laut: [], optionen: mische(TAKTARTEN, rnd), loesung: taktart, taktart, bpm };
}

/** Die richtige Antwort, aus den Tönen berechnet (nicht aus dem gespeicherten Text). */
function richtig(task: Aufgabe): string {
  const [a = 0, b = 0] = task.toene;
  const [la = 0, lb = 0] = task.laut;
  switch (task.art) {
    case "hoeher":
      return a > b ? HOEHER_1 : HOEHER_2;
    case "lauter":
      return la > lb ? LAUTER_1 : LAUTER_2;
    case "intervall":
      return intervallName(Math.abs(b - a));
    case "dur-moll":
      return (task.toene[2] ?? 0) - (task.toene[0] ?? 0) === 4 ? "Dur" : "Moll";
    case "takt":
      return task.taktart ?? "4/4";
  }
}

export function check(task: Aufgabe, answer: unknown): boolean {
  return typeof answer === "string" && answer === richtig(task);
}

export function solution(task: Aufgabe): string {
  return richtig(task);
}

/** Eine falsche Antwort, die zu den Knöpfen der Aufgabe gehört. */
export function wrong(task: Aufgabe): string {
  const richtigeAntwort = richtig(task);
  return task.optionen.find((o) => o !== richtigeAntwort) ?? "";
}

function hz(ton: number): string {
  return `${nameMitOktave(ton)} (${Math.round(frequenz(ton))} Hz)`;
}

function lautWort(task: Aufgabe, i: number): string {
  const [la = 0, lb = 0] = task.laut;
  if (la === lb) return "";
  return (task.laut[i] ?? 0) > Math.min(la, lb) ? " (laut gespielt)" : " (leise gespielt)";
}

/** Die Töne in Worten, mit Platzhaltern für `params`: so ist die Aufgabe auch ohne Hören lösbar. */
function tonVorlage(art: Art): string {
  if (art === "takt") return `${TAKTE} Takte, {Tempo} Schläge pro Minute. Jeder Takt: {Takt}.`;
  if (art === "dur-moll") return "Acht Töne aufwärts: {Töne}.";
  return "Ton 1: {Ton1}, Ton 2: {Ton2}.";
}

/** Die Werte, die eine Aufgabe festlegen; für jede Aufgabe einer Art dieselben Namen. */
export function params(task: Aufgabe, _props?: unknown, _lang?: string): Record<string, string | number> {
  const antworten = task.optionen.join(", ");
  if (task.art === "takt") {
    const n = schlaege(task.taktart ?? "4/4");
    const takt = Array.from({ length: n }, (_, i) => (i === 0 ? "BETONT" : "leicht")).join(", ");
    return { Tempo: task.bpm ?? 90, Takt: takt, Antworten: antworten };
  }
  if (task.art === "dur-moll") return { Töne: task.toene.map(nameMitOktave).join(", "), Antworten: antworten };
  const [a = 0, b = 0] = task.toene;
  return { Ton1: `${hz(a)}${lautWort(task, 0)}`, Ton2: `${hz(b)}${lautWort(task, 1)}`, Antworten: antworten };
}

/** Füllt die Platzhalter `{Name}` eines Texts mit den Werten aus `params`. */
function fuelle(text: string, werte: Record<string, string | number>): string {
  return text.replace(/\{([^{}\s]+)\}/gu, (treffer, name: string) => {
    const wert = werte[name];
    return wert === undefined ? treffer : String(wert);
  });
}

/** Die Töne in Worten und Tonnamen; so ist die Aufgabe auch ohne Hören lösbar. */
export function tonText(task: Aufgabe): string {
  return fuelle(tonVorlage(task.art), params(task));
}

/** Was die Aufgabe fragt. */
export function frage(art: Art): string {
  switch (art) {
    case "hoeher":
      return "Welcher Ton ist höher?";
    case "lauter":
      return "Welcher Ton ist lauter?";
    case "intervall":
      return "Welches Intervall hörst du?";
    case "dur-moll":
      return "Klingt die Tonleiter nach Dur oder nach Moll?";
    case "takt":
      return "Welche Taktart hörst du?";
  }
}

/** Die Erklärung der Lösung mit den Tönen. */
export function erklaerung(task: Aufgabe): string {
  const toene = tonText(task);
  const [a = 0, b = 0] = task.toene;
  switch (task.art) {
    case "hoeher": {
      const hoeher = a > b ? 1 : 2;
      return `${toene} Ton ${hoeher} ist höher: Er schwingt schneller. Höher heißt: schneller schwingen, nicht lauter.`;
    }
    case "lauter": {
      const lauter = (task.laut[0] ?? 0) > (task.laut[1] ?? 0) ? 1 : 2;
      return `${toene} Beide Töne sind gleich hoch. Ton ${lauter} ist lauter: Er schwingt stärker, aber nicht schneller.`;
    }
    case "intervall": {
      const h = Math.abs(b - a);
      return `${toene} Die Töne sind ${h} Halbtöne auseinander: ${intervallName(h)}.`;
    }
    case "dur-moll": {
      const dur = richtig(task) === "Dur";
      return dur
        ? `${toene} Das ist Dur: Die Tonleiter beginnt mit Ganzton, Ganzton, Halbton, also mit einer großen Terz (4 Halbtöne).`
        : `${toene} Das ist Moll: Die Tonleiter beginnt mit Ganzton, Halbton, Ganzton, also mit einer kleinen Terz (3 Halbtöne).`;
    }
    case "takt":
      return `${toene} Der betonte Schlag kommt nach jeweils ${schlaege(task.taktart ?? "4/4")} Schlägen, also ist es ein ${task.taktart}-Takt. Zähle bis zum nächsten betonten Schlag.`;
  }
}

/** Halbtöne eines Intervalls aus seinem Namen; undefined für einen anderen Text. */
const halbtoeneVon = (name: string) => INTERVALLE.find((i) => i.name === name)?.halbtoene;

/**
 * Die Antwort jedes typischen Fehlers aus `about.mistakes`, in derselben Reihenfolge; undefined, wo die Aufgabe
 * keinen festen Fehlwert hat. 1: der lautere, tiefere Ton (nur bei „hoeher“, wenn der höhere leiser klingt);
 * 2: Terz statt Terz oder Quarte statt großer Terz, wenn dieser Knopf da ist; 3: das andere Tongeschlecht;
 * 4: Raten umfasst jede andere Taktart, darum keiner.
 */
export function mistakes(task: Aufgabe, _props?: unknown): (string | undefined)[] {
  const [a = 0, b = 0] = task.toene;
  const [la = 0, lb = 0] = task.laut;
  const lautUndTief = task.art === "hoeher" && la !== lb && a > b === la < lb ? wrong(task) : undefined;
  let halbtonDaneben: string | undefined;
  if (task.art === "intervall") {
    const nah = { 3: 4, 4: 3, 5: 4 }[Math.abs(b - a)];
    const name = nah === undefined ? undefined : intervallName(nah);
    halbtonDaneben = name !== undefined && task.optionen.includes(name) ? name : undefined;
  }
  const geschlecht = task.art === "dur-moll" ? wrong(task) : undefined;
  return [lautUndTief, halbtonDaneben, geschlecht, undefined];
}

/**
 * Die Meldung der App zu einer falschen Antwort: was nicht passt und wie man es findet, nie die Lösung selbst.
 * undefined für eine richtige Antwort.
 */
export function reason(task: Aufgabe, answer: unknown, _props?: unknown, _lang?: string): string | undefined {
  if (check(task, answer) || typeof answer !== "string") return undefined;
  const [a = 0, b = 0] = task.toene;
  switch (task.art) {
    case "hoeher":
      return answer === mistakes(task)[0]
        ? "Der Ton, den du gewählt hast, klingt lauter. Lauter heißt aber nicht höher. Hör beide Töne noch einmal einzeln und achte nur darauf, welcher heller klingt."
        : "Hör beide Töne noch einmal einzeln. Ein höherer Ton klingt heller, er schwingt schneller. Summe beide Töne nach: Bei welchem geht deine Stimme nach oben?";
    case "lauter":
      return "Beide Töne sind gleich hoch. Hör sie noch einmal einzeln und achte nur darauf, welcher stärker klingt.";
    case "intervall": {
      const gewaehlt = halbtoeneVon(answer);
      if (gewaehlt === undefined) return "Wähle eines der Intervalle auf den Knöpfen.";
      const echt = Math.abs(b - a);
      return Math.abs(gewaehlt - echt) === 1
        ? `Knapp daneben: Das Intervall, das du hörst, ist nur einen Halbton größer oder kleiner als ${answer} (${gewaehlt} Halbtöne). Hör beide Töne noch einmal und zähle die Halbtöne auf der Klaviatur.`
        : `${answer} hat ${gewaehlt} Halbtöne. Das passt nicht zum Abstand der beiden Töne. Hör noch einmal: Ist der Abstand größer oder kleiner? Zähle die Halbtöne auf der Klaviatur.`;
    }
    case "dur-moll":
      return "Fröhlich oder traurig stimmt oft, aber nicht immer. Verlass dich auf die Terz: Hör auf den dritten Ton. Liegt er 4 Halbtöne über dem Grundton, ist es Dur, bei 3 Halbtönen Moll.";
    case "takt": {
      const n = TAKTARTEN.includes(answer as Taktart) ? schlaege(answer as Taktart) : undefined;
      const bei = n === undefined ? "" : ` Bei ${answer} käme nach ${n} Schlägen wieder ein betonter.`;
      return `Zähle von einem betonten Schlag bis zum nächsten: So viele Schläge hat ein Takt.${bei}`;
    }
  }
}

/** Eine Antwort als Text, wie das Kind sie gibt: der Text des Knopfs. */
export function show(answer: unknown, _task?: Aufgabe, _props?: unknown, _lang?: string): string {
  return typeof answer === "string" ? answer : "";
}

/** Töne für Ton 1, Ton 2 oder alle zusammen (für `spiele`). */
export function wiedergabe(
  task: Aufgabe,
  welche: "1" | "2" | "alle",
): { hz: number; start: number; dauer: number; laut: number }[] {
  if (task.art === "dur-moll") {
    return task.toene.map((t, i) => ({
      hz: frequenz(t),
      start: i * SKALA_DAUER,
      dauer: SKALA_DAUER - 0.02,
      laut: 0.25,
    }));
  }
  const alle = task.toene.map((t, i) => ({
    hz: frequenz(t),
    start: i * (TON_DAUER + PAUSE),
    dauer: TON_DAUER,
    laut: task.laut[i] ?? 0.25,
  }));
  if (welche === "alle") return alle;
  const ton = alle[welche === "1" ? 0 : 1];
  return ton ? [{ ...ton, start: 0 }] : [];
}

/** Klicks des Takt-Musters: drei Takte, der erste Schlag jedes Takts ist betont. */
export function klicks(task: Aufgabe): Klick[] {
  const n = schlaege(task.taktart ?? "4/4");
  const abstand = 60 / (task.bpm ?? 90);
  return Array.from({ length: n * TAKTE }, (_, i) => ({ start: i * abstand, betont: i % n === 0 }));
}

const BESCHREIBUNG: Record<Art, string> = {
  hoeher: "Du hörst zwei Töne nacheinander, je 0,8 Sekunden lang.",
  lauter: "Du hörst zwei gleich hohe Töne nacheinander, je 0,8 Sekunden lang.",
  intervall: "Du hörst zwei Töne nacheinander, der zweite ist höher.",
  "dur-moll": "Du hörst eine Tonleiter aufwärts, acht Töne.",
  takt: "Du hörst ein Muster aus Klicks, drei Takte lang. Der erste Schlag jedes Takts ist lauter und höher.",
};

/** Die Aufgabe, wie das Kind sie liest, mit `{Name}` für jeden Wert aus `params`. */
export function template(props: { art?: string }, _lang?: string): string {
  const art = artVon(props);
  return `Hörübung. ${BESCHREIBUNG[art]} In Worten: ${tonVorlage(art)} ${frage(art)} Antworten: {Antworten}.`;
}

/** Aufgabe und Lösung als Text, so wie die Aufgabe gezeigt wird (für den Tutor und ohne JavaScript). */
export function describe(task: Aufgabe, _props: unknown, _lang: string): { task: string; solution: string } {
  return { task: fuelle(template({ art: task.art }), params(task)), solution: `${richtig(task)}. ${erklaerung(task)}` };
}

export const about = {
  task: "Du hörst Töne oder Klicks (zwei Töne, eine Tonleiter oder ein Taktmuster) und beantwortest eine Frage dazu. Wer nicht hören kann, liest die Töne als Text.",
  answer:
    "Das Kind hört die Töne mit „▶ Ton 1“, „▶ Ton 2“ (beim Intervall auch „▶ Beide“) oder „▶ Anhören“, so oft es will; „Töne als Text zeigen“ zeigt sie in Worten. Dann tippt es auf einen Antwortknopf, zum Beispiel „Ton 2 ist höher“, „Quinte“, „Dur“ oder „3/4“, und drückt „Prüfen“ unter der Aufgabe. Die Wahl lässt sich vor dem Prüfen ändern.",
  correct:
    "Richtig ist die Antwort, die zu den gespielten Tönen passt: der höhere oder lautere Ton, das Intervall mit der passenden Zahl Halbtöne, Dur bei großer Terz, Moll bei kleiner Terz, die Taktart nach der Zahl der Schläge zwischen zwei betonten Schlägen.",
  mistakes: [
    "Lautstärke und Tonhöhe verwechseln: den lauteren, aber tieferen Ton für höher halten. Höher heißt schneller schwingen, nicht lauter.",
    "Ein Intervall um einen Halbton verfehlen: große statt kleine Terz, kleine statt große Terz oder große Terz (4 Halbtöne) statt Quarte (5).",
    "Dur und Moll nach Gefühl (fröhlich oder traurig) statt nach der Terz entscheiden.",
    "Die Taktart raten, statt bis zum nächsten betonten Schlag zu zählen.",
  ],
};

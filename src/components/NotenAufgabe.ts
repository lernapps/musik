// Logik der Übung „Note benennen“: Aufgabe aus dem Samen, Prüfung, Rückmeldung mit dem typischen Fehler. Rein.
import { name, nameMitOktave, zufall } from "./Musik.ts";
import { anzahlHilfslinien, lage, tonDauer } from "./Notenzeile.ts";

export type Bereich = "linien" | "zwischenraeume" | "alle";

export interface AufgabenProps {
  bereich?: Bereich | undefined;
}

export interface Aufgabe {
  /** Halbtöne ab c¹ (nur weiße Tasten). */
  ton: number;
  wert: "viertel" | "halbe";
}

/** Die Namen der Knöpfe. */
export const NAMEN = ["C", "D", "E", "F", "G", "A", "H"] as const;

/** Linien: e¹ g¹ h¹ d² f²; Zwischenräume: f¹ a¹ c² e²; alle: c¹ bis a² (weiße Tasten). */
const LINIEN = [4, 7, 11, 14, 17];
const RAEUME = [5, 9, 12, 16];
const ALLE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21];

export function toene(bereich: Bereich | undefined): number[] {
  if (bereich === "linien") return LINIEN;
  if (bereich === "zwischenraeume") return RAEUME;
  return ALLE;
}

export function generate(seed: number, props: AufgabenProps = {}): Aufgabe {
  const r = zufall(seed * 7919 + 13);
  const vorrat = toene(props.bereich);
  const ton = vorrat[Math.floor(r() * vorrat.length)] ?? 4;
  const wert = r() < 0.7 ? "viertel" : "halbe";
  return { ton, wert };
}

const ORDNUNG = ["ersten", "zweiten", "dritten", "vierten", "fünften"];

/** Die Position der Note als Text, ohne den Namen zu verraten: "auf der zweiten Linie von unten". */
export function position(ton: number): string {
  const l = lage(ton);
  if (l <= -2) return anzahlHilfslinien(ton) === 1 ? "auf einer Hilfslinie unter dem System" : "weit unter dem System";
  if (l === -1) return "unter dem System, direkt unter der untersten Linie";
  if (l >= 10) return anzahlHilfslinien(ton) === 1 ? "auf einer Hilfslinie über dem System" : "weit über dem System";
  if (l === 9) return "über dem System, direkt über der obersten Linie";
  const nr = Math.floor(l / 2);
  if (l % 2 === 0) return `auf der ${ORDNUNG[nr]} Linie von unten`;
  return `im Zwischenraum zwischen der ${ORDNUNG[nr]} und der ${ORDNUNG[nr + 1]} Linie von unten`;
}

export function istLinie(ton: number): boolean {
  const l = lage(ton);
  return l >= 0 && l <= 8 && l % 2 === 0;
}

function wertText(wert: Aufgabe["wert"]): string {
  return wert === "viertel" ? "Eine Viertelnote" : "Eine halbe Note";
}

/** Beschreibung des Bildes für aria-label (verrät den Namen nicht). */
export function bildText(task: Aufgabe): string {
  return `${wertText(task.wert)} ${position(task.ton)} im Violinschlüssel`;
}

/** Tempo, in dem „Ton hören“ die Note spielt (Viertel 0,75 s, Halbe 1,5 s). */
export const HOER_TEMPO = 80;

/** Klingende Dauer der Note in Sekunden. */
export function hoerDauer(task: Aufgabe): number {
  return tonDauer(task.wert, HOER_TEMPO);
}

/** Der richtige Name: "G". */
export function solution(task: Aufgabe): string {
  return name(task.ton);
}

/** Ein falscher Name: der nächste Buchstabe (Nachbarton). */
export function wrong(task: Aufgabe): string {
  const i = NAMEN.indexOf(name(task.ton) as (typeof NAMEN)[number]);
  return NAMEN[(i + 1) % NAMEN.length] ?? "C";
}

/** Bringt eine Antwort auf einen Buchstaben: "g", " G ", "g¹" → "G"; sonst leer. */
export function normalisiere(answer: unknown): string {
  if (typeof answer !== "string") return "";
  const t = answer.trim().replace(/[\d¹²³]+$/u, "");
  return t.length === 1 && /[A-Ha-h]/u.test(t) ? t.toUpperCase() : "";
}

export function check(task: Aufgabe, answer: unknown): boolean {
  return normalisiere(answer) === name(task.ton);
}

const EZEL =
  "Linien von unten: E G H D F, „Eine Gans hüpft durch Felder“. Zwischenräume von unten: F A C E, wie das Wort „face“.";

/** Der Buchstabe `schritte` Stufen über (negativ: unter) dem Namen der Note, mit Sprung von H zu C. */
function nachbar(task: Aufgabe, schritte: number): string {
  const i = NAMEN.indexOf(name(task.ton) as (typeof NAMEN)[number]);
  return NAMEN[(i + schritte + NAMEN.length) % NAMEN.length] ?? "C";
}

/**
 * Die Antwort jedes typischen Fehlers aus `about.mistakes`, in derselben Reihenfolge; undefined, wo die Aufgabe keinen
 * festen Fehlwert hat. Auf einer Hilfslinie ist der Nachbarton der Fehler „Hilfslinie nicht beachtet“: der Ton direkt
 * unter (d¹) oder über (g²) dem System. Von einer anderen Linie aus zählen gibt viele Antworten, darum keine.
 */
export function mistakes(task: Aufgabe, _props?: AufgabenProps): (string | undefined)[] {
  const hilfslinie = anzahlHilfslinien(task.ton) > 0;
  if (hilfslinie) return [undefined, undefined, nachbar(task, lage(task.ton) < 0 ? 1 : -1), undefined];
  return [nachbar(task, 1), nachbar(task, -1), undefined, undefined];
}

/**
 * Die Meldung der App zu einer falschen Antwort: was nicht passt und wie man den Namen findet, nie der Name selbst.
 * undefined für eine richtige Antwort.
 */
export function reason(task: Aufgabe, answer: unknown, _props?: AufgabenProps, _lang?: string): string | undefined {
  if (check(task, answer)) return undefined;
  const gegeben = normalisiere(answer);
  if (gegeben === "") return "Wähle einen der Namen C, D, E, F, G, A oder H.";
  // Steht die Note selbst auf e¹, verriete „von e¹ aus zählen“ ihren Namen: dann nur die Eselsbrücke
  const vonUnten =
    name(task.ton) === "E" && lage(task.ton) === 0
      ? "Zähle von der untersten Linie aus. Die Namen der Linien von unten sagt dir die Eselsbrücke „Eine Gans hüpft durch Felder“."
      : "Zähle von der untersten Linie e¹ aus.";
  if (anzahlHilfslinien(task.ton) > 0) {
    const richtung = lage(task.ton) < 0 ? "nach unten" : "nach oben";
    return `Die Hilfslinie zählt mit: Die Note steht ${position(task.ton)}. Zähle von der untersten Linie e¹ aus Schritt für Schritt ${richtung}, Linie, Zwischenraum, Linie …, bis zur Hilfslinie.`;
  }
  const [hoeher, tiefer] = mistakes(task);
  if (gegeben === hoeher || gegeben === tiefer) {
    return istLinie(task.ton)
      ? `Du hast Linie und Zwischenraum verwechselt: Diese Note sitzt auf einer Linie, nicht im Zwischenraum. ${vonUnten}`
      : `Du hast Linie und Zwischenraum verwechselt: Diese Note sitzt nicht auf einer Linie, sondern dazwischen. ${vonUnten}`;
  }
  return `Du hast von einer anderen Linie aus gezählt. ${vonUnten} Jede Linie und jeder Zwischenraum ist einen Ton weiter.`;
}

/** Die Aufgabe, wie das Kind sie liest, mit `{Note}` und `{Lage}` für die Werte aus `params`. */
export function template(_props?: AufgabenProps, _lang?: string): string {
  return "{Note} {Lage} im Violinschlüssel. Wie heißt der Ton? Zur Wahl stehen C, D, E, F, G, A und H.";
}

/** Was eine Aufgabe festlegt: der Notenwert und die Lage der Note im System. */
export function params(task: Aufgabe, _props?: AufgabenProps, _lang?: string): Record<string, string> {
  return { Note: wertText(task.wert), Lage: position(task.ton) };
}

/** Eine Antwort, wie das Kind sie gibt: der Buchstabe. */
export function show(answer: unknown, _task?: Aufgabe, _props?: AufgabenProps, _lang?: string): string {
  return normalisiere(answer) || (typeof answer === "string" ? answer : "");
}

/** Text für Tutor und Screenreader: die Aufgabe wie gezeigt und die Lösung. */
export function describe(task: Aufgabe, props: AufgabenProps, lang: string): { task: string; solution: string } {
  const werte = params(task, props, lang);
  return {
    task: template(props, lang)
      .replace("{Note}", werte["Note"] ?? "")
      .replace("{Lage}", werte["Lage"] ?? ""),
    solution: `${name(task.ton)} (${nameMitOktave(task.ton)}). Die Note steht ${position(task.ton)}. Eselsbrücke: ${EZEL}`,
  };
}

export const about = {
  task: "Das Kind sieht eine Note im Violinschlüssel (auch mit Hilfslinie) und wählt ihren Namen.",
  answer:
    "Das Kind tippt auf einen der Knöpfe C, D, E, F, G, A oder H und drückt „Prüfen“ unter der Aufgabe; die Wahl lässt sich vorher ändern. Nach dem Prüfen spielt „▶ Ton hören“ die Note.",
  correct: "Die Antwort ist richtig, wenn der Buchstabe dem Namen der gezeigten Note entspricht.",
  mistakes: [
    "Linie und Zwischenraum verwechselt: den Nachbarton eine Stufe höher gewählt.",
    "Linie und Zwischenraum verwechselt: den Nachbarton eine Stufe tiefer gewählt.",
    "Die Hilfslinie nicht beachtet (bei c¹ und a²): die Note für den Ton direkt unter dem System (d¹) oder direkt darüber (g²) gehalten.",
    "Nicht von der untersten Linie e¹ aus gezählt, sondern von einer anderen Linie.",
  ],
};

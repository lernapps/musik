// Logik der Übung „Note benennen“: Aufgabe aus dem Samen, Prüfung, Rückmeldung mit dem typischen Fehler. Rein.
import { name, nameMitOktave, zufall } from "./Musik.ts";
import { anzahlHilfslinien, lage } from "./Notenzeile.ts";

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

/** Rückmeldung zu einer Antwort: leer bei richtig, sonst der typische Fehler. */
export function reason(task: Aufgabe, answer: unknown): string {
  if (check(task, answer)) return "";
  const gegeben = normalisiere(answer);
  if (gegeben === "") return "Wähle einen der Namen C, D, E, F, G, A oder H.";
  const ziel = NAMEN.indexOf(name(task.ton) as (typeof NAMEN)[number]);
  const wahl = NAMEN.indexOf(gegeben as (typeof NAMEN)[number]);
  const abstand = (wahl - ziel + NAMEN.length) % NAMEN.length;
  if (anzahlHilfslinien(task.ton) > 0) {
    return `Die Hilfslinie zählt mit: Die Note steht ${position(task.ton)}. Zähle von der untersten Linie e¹ aus weiter.`;
  }
  if (abstand === 1 || abstand === NAMEN.length - 1) {
    return istLinie(task.ton)
      ? "Du hast Linie und Zwischenraum verwechselt: Diese Note sitzt auf einer Linie, nicht im Zwischenraum. Zähle von der untersten Linie e¹ aus."
      : "Du hast Linie und Zwischenraum verwechselt: Diese Note sitzt in einem Zwischenraum, nicht auf einer Linie. Zähle von der untersten Linie e¹ aus.";
  }
  return "Zähle von der untersten Linie e¹ aus: e¹ g¹ h¹ d² f² sitzen auf den Linien, f¹ a¹ c² e² in den Zwischenräumen.";
}

/** Text für Tutor und Screenreader: die Aufgabe wie gezeigt und die Lösung. */
export function describe(task: Aufgabe, _props: AufgabenProps, _lang: string): { task: string; solution: string } {
  return {
    task: `${bildText(task)}. Wie heißt der Ton? Zur Wahl stehen C, D, E, F, G, A und H.`,
    solution: `${name(task.ton)} (${nameMitOktave(task.ton)}). Die Note steht ${position(task.ton)}. Eselsbrücke: ${EZEL}`,
  };
}

export const about = {
  task: "Das Kind sieht eine Note im Violinschlüssel (auch mit Hilfslinie) und wählt ihren Namen.",
  answer: "Der Notenname als ein Buchstabe: C, D, E, F, G, A oder H (Groß- oder Kleinschreibung ist egal).",
  correct: "Die Antwort ist richtig, wenn der Buchstabe dem Namen der gezeigten Note entspricht.",
  mistakes: [
    "Linie und Zwischenraum verwechselt: der Nachbarton wird gewählt.",
    "Die Hilfslinie nicht beachtet (bei c¹ und a²).",
    "Nicht von der untersten Linie e¹ aus gezählt, sondern von einer anderen Linie.",
  ],
};

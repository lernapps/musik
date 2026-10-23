// Klavierähnlicher Klang und Lautstärke: reine Berechnungen, ohne Browser, darum testbar.

/** Anteil der Obertöne (Sinus-Anteile 1, 2, 3 …) eines angeschlagenen Klaviertons, grob nachempfunden. */
export const OBERTOENE = [1, 0.52, 0.34, 0.2, 0.14, 0.09, 0.06, 0.045, 0.03, 0.02];

/** Zeitkonstante des Abklingens in Sekunden: hohe Töne klingen schneller ab als tiefe. */
export function abklingzeit(hz: number): number {
  const tau = 0.9 * (261.63 / Math.max(hz, 60)) ** 0.45;
  return Math.min(Math.max(tau, 0.25), 1.6);
}

export interface Huelle {
  /** Höchster Pegel nach dem Anschlag. */
  spitze: number;
  /** Pegel, wenn die Taste nach `dauer` Sekunden losgelassen wird. */
  beiLoslassen: number;
  /** Dauer des Loslassens in Sekunden. */
  ausklang: number;
}

/** Pegelverlauf eines Klaviertons: schneller Anschlag, Abklingen wie e^(−t/τ), kurzes Loslassen. */
export function huelle(hz: number, dauer: number, laut: number): Huelle {
  const spitze = Math.max(laut, 0.0004);
  const tau = abklingzeit(hz);
  const rest = spitze * Math.exp(-Math.max(dauer - 0.006, 0) / tau);
  return { spitze, beiLoslassen: Math.max(rest, 0.0002), ausklang: 0.14 };
}

/** Offene Weite des Tiefpasses (Hz): am Anfang hell, später dumpfer wie bei einer Saite. */
export function filterStart(hz: number): number {
  return Math.min(Math.max(hz * 12, 1500), 9000);
}
export function filterEnde(hz: number): number {
  return Math.min(Math.max(hz * 3, 700), 4000);
}

/** Lautstärke in Prozent (0 bis 100) als Verstärkung: quadratisch, weil das Ohr Lautstärke nicht linear hört. */
export function gainVonProzent(prozent: number): number {
  const p = Math.min(Math.max(prozent, 0), 100) / 100;
  return p * p;
}

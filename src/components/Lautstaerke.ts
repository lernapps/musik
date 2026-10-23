// Beschriftung des Lautstärkereglers.

/** „stumm“, „leise“, „mittel“ oder „laut“ zu einem Prozentwert. */
export function lautstaerkeWort(prozent: number): string {
  if (prozent <= 0) return "stumm";
  if (prozent < 34) return "leise";
  if (prozent < 67) return "mittel";
  return "laut";
}

/** Text für Screenreader, zum Beispiel „Lautstärke: mittel, 50 Prozent“. */
export function lautstaerkeAnsage(prozent: number): string {
  return `Lautstärke: ${lautstaerkeWort(prozent)}, ${prozent} Prozent`;
}

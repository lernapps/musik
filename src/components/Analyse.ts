// Auswertung von Mikrofon-Signalen: Tonhöhe der Stimme und Klatschen. Reine Funktionen, ohne Browser,
// darum mit künstlichen Testtönen prüfbar.
import { frequenz } from "./Musik.ts";

/** Tonhöhe in Hz aus einem Block Abtastwerte; 0, wenn kein klarer Ton zu hören ist. */
export function tonhoehe(block: Float32Array, abtastrate: number): number {
  const n = block.length;
  let energie = 0;
  for (let i = 0; i < n; i++) energie += (block[i] ?? 0) ** 2;
  if (Math.sqrt(energie / n) < 0.01) return 0;
  const kleinstes = Math.floor(abtastrate / 1100);
  const groesstes = Math.min(Math.floor(abtastrate / 70), n - 1);
  const diff = new Float32Array(groesstes + 1);
  // Mittlere quadrierte Differenz (Verfahren YIN): kleine Werte bedeuten, dass sich das Signal wiederholt.
  for (let lag = 1; lag <= groesstes; lag++) {
    let summe = 0;
    for (let i = 0; i < n - groesstes; i++) {
      const d = (block[i] ?? 0) - (block[i + lag] ?? 0);
      summe += d * d;
    }
    diff[lag] = summe;
  }
  const norm = new Float32Array(groesstes + 1);
  norm[0] = 1;
  let lauf = 0;
  for (let lag = 1; lag <= groesstes; lag++) {
    lauf += diff[lag] ?? 0;
    norm[lag] = lauf === 0 ? 1 : ((diff[lag] ?? 0) * lag) / lauf;
  }
  let lag = kleinstes;
  while (lag < groesstes) {
    if ((norm[lag] ?? 1) < 0.15) {
      while (lag + 1 < groesstes && (norm[lag + 1] ?? 1) < (norm[lag] ?? 1)) lag++;
      const a = norm[lag - 1] ?? 1;
      const b = norm[lag] ?? 1;
      const c = norm[lag + 1] ?? 1;
      const nenner = a - 2 * b + c;
      const versatz = nenner === 0 ? 0 : (a - c) / (2 * nenner);
      return abtastrate / (lag + versatz);
    }
    lag++;
  }
  return 0;
}

/** Abstand zweier Frequenzen in Cent (100 Cent = ein Halbton); positiv: `hz` ist höher als `ziel`. */
export function cent(hz: number, ziel: number): number {
  return 1200 * Math.log2(hz / ziel);
}

/** Der Ton (in Halbtönen ab c¹), der `hz` am nächsten liegt, und die Abweichung in Cent. */
export function naechsterTon(hz: number): { ton: number; cent: number } {
  const ton = Math.round(12 * Math.log2(hz / frequenz(0)));
  return { ton, cent: cent(hz, frequenz(ton)) };
}

/** Ein Ton liegt „getroffen“, wenn er höchstens 50 Cent (einen halben Halbton) vom Ziel entfernt ist. */
export function getroffen(hz: number, ziel: number, toleranz = 50): boolean {
  return hz > 0 && Math.abs(cent(hz, ziel)) <= toleranz;
}

/** Zeitpunkte (in Sekunden) von Klatschern in einer Folge von Lautstärken (je `schritt` Sekunden). */
export function einsaetze(lautstaerke: number[], schritt: number, sperre = 0.15): number[] {
  const zeiten: number[] = [];
  let letzte = -Infinity;
  for (let i = 1; i < lautstaerke.length; i++) {
    const jetzt = lautstaerke[i] ?? 0;
    const davor = lautstaerke[i - 1] ?? 0;
    const zeit = i * schritt;
    if (jetzt > 0.08 && jetzt > davor * 2 && zeit - letzte >= sperre) {
      zeiten.push(zeit);
      letzte = zeit;
    }
  }
  return zeiten;
}

/** Wie genau passen geklatschte Zeiten zu den Sollzeiten? Jeder Soll-Schlag braucht einen Klatscher in `toleranz` Sekunden. */
export function vergleiche(
  soll: number[],
  ist: number[],
  toleranz = 0.15,
): { getroffen: number; verfehlt: number; zuviel: number } {
  const frei = [...ist];
  let treffer = 0;
  for (const zeit of soll) {
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
      treffer++;
      frei.splice(beste, 1);
    }
  }
  return { getroffen: treffer, verfehlt: soll.length - treffer, zuviel: frei.length };
}

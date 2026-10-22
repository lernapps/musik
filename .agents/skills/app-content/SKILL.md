---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Musik erleben: Explainer für Musik, Klasse 5–7. Kinder hören, klatschen, singen und vergleichen. Alle Klänge entstehen
im Browser (Web Audio). Das Mikrofon ist freiwillig; nichts wird gespeichert oder hochgeladen.

## Curriculum

- Land und Schule: Hessen, gymnasialer Bildungsgang; gilt in der Sache für Klasse 5–7 jeder weiterführenden Schule.
- Orientierung (nicht verbindlich): Lehrplan Musik, Gymnasialer Bildungsgang, Jahrgangsstufen 5 bis 13, Hessisches
  Kultusministerium, <https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-06/g9-musik.pdf>. Quellen im Lehrplan:
  Arbeitsbereich „Elemente der Musik ableiten und anwenden“ (S. 10: Tondauer/Rhythmus, Takt/Metrum, Tonhöhe/Melodik,
  Zusammenklang, Instrumentation/Klangfarbe, weitere Parameter, Jahrgang 5 und 6), „Musik hören und betrachten“ (S. 9),
  „Musikpraxis“ (S. 8), Themenblatt 5/04 „Musik – Instrument – Klang“ (S. 14). Hessen hat keine Themen für Jahrgang 7.
- Die Reihenfolge der Kapitel ist didaktisch, nicht aus dem Lehrplan.
- Ein Kernlehrplan NRW wurde nicht gelesen und ist keine Quelle.

## Competencies

Kapitel-Ordner `src/<kapitel-id>/`, Seiten-Dateien `<seiten-id>.yaml`. Übungs-ids stehen in der Seite.

1. `hoeren` Hören und Klang beschreiben
   - Ich kann Lautstärke, Tempo und Klangfarbe eines Klangs mit Fachwörtern beschreiben. (`laut-leise`, `schnell-langsam`)
   - Ich kann Instrumente den Instrumentenfamilien zuordnen. (`klangfarbe`)
2. `tonhoehe` Tonhöhe und Klaviatur
   - Ich kann hohe und tiefe Töne unterscheiden und der Höhe nach ordnen. (`hoch-tief`)
   - Ich kann Töne auf der Klaviatur benennen und zeigen. (`klaviatur`, `stimme`)
3. `rhythmus` Rhythmus und Takt
   - Ich kann Notenwerte und Pausen benennen und ihre Dauer vergleichen. (`notenwerte`)
   - Ich kann einen Rhythmus im Takt klatschen. (`klatschen`)
   - Ich kann einen Takt (2/4, 3/4, 4/4) heraushören und betonen. (`grundschlag-takt`)
4. `noten` Noten lesen
   - Ich kann Noten im Violinschlüssel benennen. (`linien`, `benennen`)
   - Ich kann einen einfachen Rhythmus oder eine kurze Melodie aus Noten ablesen. (`lesen`)
5. `tonleitern` Tonleitern und Intervalle
   - Ich kann Dur und Moll unterscheiden. (`dur-moll`)
   - Ich kann eine Dur-Tonleiter aus Ganz- und Halbtonschritten aufbauen. (`dur-bauen`)
   - Ich kann Intervalle (Sekunde bis Oktave) hören und benennen. (`intervalle`)
   - Ich kann eine Tonfolge nachsingen. (`nachsingen`)
6. `erfinden` Begleiten und Erfinden
   - Ich kann ein Lied mit gleichmäßigem Grundschlag begleiten. (`begleiten`)
   - Ich kann einen eigenen Rhythmus aus vier Takten erfinden und aufschreiben. (`rhythmus-erfinden`)
   - Ich kann eine kurze Melodie auf der Klaviatur erfinden und mit einem Vorbild vergleichen. (`melodie-erfinden`)

## Content structure

- Jede Seite hat Abschnitte in dieser Reihenfolge, feste ids: `ausprobieren` („Ausprobieren“), `merke` („Das
  Wichtigste“), `so-uebst-du-selbst` („So übst du selbst“, nur auf Seiten mit Mikrofon-Werkzeug), `uebung` („Übung“).
- `ausprobieren` zuerst: Komponente oder Abbildung mit kurzer Aufgabe in einem Satz; erst danach erklären.
- `merke` enthält eine `definition` je neuem Fachwort und höchstens zwei kurze Absätze.
- `so-uebst-du-selbst` ist ein `note` mit 3–5 nummerierten Schritten ohne Technik (summen, Hand an den Hals, mit Klavier
  oder Handy vergleichen, ein Partner hört zu). Auf jeder Seite mit `RhythmusWerkstatt`-Klatschen oder `Stimmspiegel`.
- Länge: Seite etwa 150–300 Wörter plus Komponente und Übung.

## Terminology

- Du-Form. Kurze Sätze, aktive Verben, ein Fachwort pro Satz, jedes beim ersten Gebrauch erklärt (ISO 24495).
- Benutzt: Tonhöhe, Lautstärke, Klangfarbe, Tempo, Grundschlag, Takt, Notenwert, Pause, Klaviatur, Oktave, Ganzton,
  Halbton, Tonleiter, Dur, Moll, Intervall, Prime/Sekunde/Terz/Quarte/Quinte/Sexte/Septime/Oktave.
- Tonnamen deutsch: C D E F G A H; schwarze Tasten Cis, Dis … mit zweitem Namen Des, Es … , B ist das b. Tonumfang c¹ bis c³ (zwei Oktaven); Töne werden in Halbtönen ab c¹ gezählt (c¹ = 0). Das C ist auf der Klaviatur hervorgehoben.
- Vermieden: „Moll klingt traurig“ als Regel (nur „oft“); „Intervall“ ohne Erklärung; englische Notennamen.
- Frequenz in Hz, a¹ = 440 Hz. Tempo in Schlägen pro Minute (BPM).

## Exercise patterns

- *Hören-Vergleichen*: Komponente `HoerAufgabe` (Arten `hoeher`, `lauter`, `intervall`, `dur-moll`, `takt`). Feste Seeds.
  Beispiel: `src/tonhoehe/hoch-tief.yaml`, Block `hoer-hoeher`.
- *Zuordnen*: `matching`. Daten: `src/data/instrumente.yaml`, `src/data/notenwerte.yaml`.
- *Berechnen*: `generated` mit typischen Fehlern (z. B. Halbtöne zwischen zwei Tönen; Starttaste nicht mitzählen).
  Daten: `src/data/noten.yaml`, `src/data/intervalle.yaml`.
- *Ordnen*: `ordering`. *Urteilen*: `true-false` oder `single-choice`, jede falsche Option mit `info`.
- *Selbst machen*: freie Aufgaben (Rhythmus, Melodie erfinden): die Komponente meldet nur Länge, Takt, Tonumfang;
  die Pflichtfrage der Seite prüft das Wissen dahinter.
- Jede Seite hat mindestens eine Frage oder `generated` im Abschnitt `uebung`.
- Komponenten in `src/components/` (alle mit Test): `Klaviatur` (Tasten, `start` 0 oder 12, `markiert`, `folge`),
  `Klangbild` (Welle, `regler`, `hz`, `form`, `laut`), `Notenzeile` (`noten` mit `ton` in Halbtönen ab c¹, `wert`
  ganze/halbe/viertel/achtel, `pause`; `taktart`, `namen`, `tempo`), `NotenAufgabe` (Übung, `bereich`),
  `RhythmusWerkstatt` (`taktart`, `takte`, `raster`, `tempo`, `muster`, `vorbild`, `klatschen`), `Stimmspiegel` (`ziel`,
  `folge`, `eigene`, `ohneOktave`), `HoerAufgabe` (Übung, `art` hoeher, lauter, intervall, dur-moll, takt). Logik in
  `Musik.ts` (Töne, Frequenzen, Tonleitern), `Analyse.ts` (Tonhöhe, Klatschen), `Klang.ts` (Web Audio, Mikrofon).
- Übungskomponenten brauchen `examples` mit `seed`: Antworten aus `solution(generate(seed, props))` und `wrong(...)`
  berechnen (z. B. mit `node`), nicht raten.
- Eine `generated`-Aufgabe darf keine Falschantwort haben, die bei einem Wert mit der richtigen übereinstimmt: mit
  `where` ausschließen (sonst scheitert der Build).
- Jede Komponente mit Mikrofon (`RhythmusWerkstatt` mit `klatschen`, `Stimmspiegel`) hat auf der Seite den Abschnitt
  `so-uebst-du-selbst` und funktioniert ohne Mikrofon.

## Figures

- Komponenten zeichnen Klaviatur, Notenzeile und Welle selbst. Farben: Grundton C hervorgehoben, Zielton grün,
  Abweichung rot; nie nur Farbe (zusätzlich Beschriftung).
- Jede Abbildung hat `alt` und `caption`; die Abbildung zeigt die Aufgabe, nie die Antwort.
- Eigene SVG in `src/images/`, selbst gezeichnet, Lizenz CC BY 4.0. Keine fremden Bilder.
- Alle Abbildungen funktionieren bei 360 px Breite.
- Browser-Globals (`navigator` …) in Komponenten nur in `onMounted`; der Build prüft das statisch, auch in `.ts`-Dateien.

## Sources

- Lehrplan Hessen (siehe Curriculum), gelesen.
- Zweitquellen: de.wikipedia.org (CC BY-SA, Fakten übernommen, keine Sätze): Tonhöhe, Notenschrift, Takt (Musik),
  Tonleiter, Klaviatur, Lautstärke, Tempo (Musik), Musikinstrument, Frequenz, Violinschlüssel, Intervall (Musik),
  Klangfarbe, Dur, Moll, Notenwert, Kammerton. Geprüft: Seite lädt und ist der Artikel zum Thema.
- Zusätzlich gelesen und geprüft: Rhythmus (Musik), Dynamik (Musik), Orchester, Tonhöhe (Hörbereich 16 bis 20 000 Hz,
  Oktave = doppelte Frequenz), Tempo (Musik) (Tempowörter mit Bereichen), Klangfarbe, Lautstärke, Musikinstrument,
  Kammerton (a¹ = 440 Hz), Intervall (Musik) (Halbtöne je Intervall), Notenwert.
- Nicht genutzt und nicht geprüft: Pentatonik, Obertonreihe. Nicht ohne Prüfung verwenden.
- Lehrplan Hessen ist der einzige gelesene Lehrplan.
- Das Material der Lehrkraft bleibt lokal. Keine Namen von Lernenden.

## Adding a chapter or round

1. Kompetenzen „Ich kann …“ in dieser Datei unter „Competencies“ ergänzen.
2. Ordner `src/<id>/` mit `chapter.yaml` (Titel, Zusammenfassung, Seiten) anlegen; Kapitel in `chapters` von
   `src/app.yaml` eintragen.
3. Jede Seite als `<id>.yaml` mit den Abschnitten aus „Content structure“; Fakten in die Datendateien in `src/data/`.
4. Komponenten wiederverwenden; eine neue nur, wenn kein Block und keine vorhandene reicht (mit Test und `nojs`-Text).
5. Übungen nach den Mustern; jede falsche Option mit Grund.
6. `npx lernapps check`, dann committen.

## Rules learned from mistakes

- Ein Komma in einem YAML-Tabellenfeld ohne Anführungszeichen teilt die Zelle: Tabellenzellen mit Komma in Anführungszeichen setzen.
- `matching` braucht `pairs` als `{ left, right }`, nicht als Liste.
- Ein Doppelpunkt mit Leerzeichen in einem unquotierten YAML-Text (`summary: Laut: leise`) bricht das YAML: in Anführungszeichen setzen.

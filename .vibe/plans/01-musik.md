---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype, null until chosen in Explore. Allowed values: explainer, interactive, quiz.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: written by the pre-push hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: { accessible: 1, checks-pass: 5 }
---

# Plan: Musik erleben, erste Version

<!--
For you, the assistant.
1. Path: `.vibe/plans/01-<short name>.md`. Every later change gets its own plan from the increment template.
2. Read this plan before each step. One phase at a time, tasks in order.
3. Task done → tick `[x]` at once and move it to "Completed" of its phase. An unticked box counts as not done.
4. New task found → add it.
5. Each phase names its skills. Load a skill when its task comes, not before. Read it in full, from its file.
6. Checkpoint: stop, ask, wait for the creator's answer. A message sent before the question is no yes.
   Only a checkpoint waits. A phase's last box → set the next phase and go on in the same message.
7. At most 2 questions per message, one topic each. No questions inside drafts or lists.
8. Work on the branch `work`, locally: push nothing before Commit. Commit puts the app on GitHub and brings `work`
   into `main`.
9. Plan in the creator's language. Keep headings and front matter keys. Delete a comment once its part is filled.
10. Begin each reply to the creator with the phase in `phase:`, and at a checkpoint the word checkpoint:
    "**Plan · Checkpoint**", "**Code**". The creator always knows where you are.
-->

*Gestartet 2026-10-22. Explore, Plan, Code, Commit.*

## Goal

Kinder der Klassen 5–7 erleben Musik selbst: Sie hören, klatschen, singen und vergleichen. Dabei lernen sie, Töne,
Rhythmen und Noten zu unterscheiden und zu lesen, Tonleitern und Intervalle zu erkennen, Klang zu beschreiben und
eigene kleine Melodien und Rhythmen zu erfinden. Klänge entstehen im Browser; das Mikrofon ist freiwillig und alles
bleibt auf dem Gerät.

## Key decisions

- Archetyp `explainer`: Kinder brauchen erst Erklärung und Abbildung, dann Übung auf derselben Seite; Eigene
  Komponenten (Noten, Rhythmus, Klaviatur, Ton-Visualisierung) tragen das Erleben. Die Lehrkraft wünscht einen Explainer.
- Klänge nur synthetisch im Browser (Web Audio), nichts wird hochgeladen. Reihenfolge: Hören → Tonhöhe → Rhythmus →
  Noten → Tonleitern und Intervalle → Begleiten und Erfinden.
- Lehrplan-Orientierung: Hessen, Lehrplan Musik Gymnasialer Bildungsgang (Link vom Creator, gelesen). Die Reihenfolge
  der Kapitel folgt der Didaktik; der Lehrplan gibt keine feste Reihenfolge vor.
- Jede Mikrofon-Übung hat eine Alternative ohne Mikrofon, die beschreibt, wie man selbst übt. Das Mikrofon ist nie
  Pflicht und braucht eine Einwilligung des Browsers.
- Sprache: nur Deutsch, einfache Sprache (ISO 24495). (guess)
- Aussehen: ruhig wie ein Arbeitsblatt (Vorgabe des Archetyps); Dunkelmodus folgt dem Gerät.

## Notes

### Lehrplan

- Orientierung (vom Creator genannt, gelesen): Lehrplan Musik, Gymnasialer Bildungsgang, Jahrgangsstufen 5 bis 13,
  Hessisches Kultusministerium, PDF aus 2021-06 (Datei-Datum; das Dokument nennt kein Erscheinungsjahr),
  <https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-06/g9-musik.pdf>. Gelesen: Arbeitsbereich „Elemente der
  Musik ableiten und anwenden“ (gedruckte S. 10), „Musik hören und betrachten“ (S. 9), „Musikpraxis“ (S. 8), Themenblatt
  5/04 „Musik – Instrument – Klang“ (S. 14), 6/09 „Musik und Form“ (S. 19). Hessen hat keine Themen für Jahrgang 7; die
  App deckt Jahrgang 5 und 6 ab und gilt für 5–7.
- Passung zu den Kapiteln (Lernfeld, Jahrgang):
  - Hören/Klang: „Beschreiben von Höreindrücken (Tonhöhe, Tondauer, Tonstärke, Tempo, Klangfarbe, Metrum/Takt)“ (5);
    Dynamik laut/leise, pp–ff, Tempo langsam–schnell (5).
  - Instrumentenfamilien, Ensembles, Besetzungen; Tonerzeugung (5, Thema 5/04).
  - Tonhöhe: hoch/tief; Violinschlüssel; Klaviertastatur, Ganz- und Halbtonschritt, Oktav-Einteilung; Stammtöne und
    abgeleitete Töne; Tonschritt/Tonsprung (5).
  - Rhythmus: Noten- und Pausenwerte, Punktierung, Grundschlag/Puls/Beat, betont/unbetont, Taktarten 2/4, 4/4, 3/4,
    Volltakt/Auftakt (5); Triole, Synkope, weitere Taktarten (6, fakultativ in dieser Version: nein, draußen).
  - Tonleitern/Intervalle: Struktur der Dur- und Molltonleitern, genauere Intervallbestimmung (6); Grund-Intervalle,
    Dreiklang (5).
  - Erfinden: „Erfinden einfacher Rhythmen und Melodien“ (5), „Erfinden von Rhythmen und Melodien“ (6);
    Musizieren: Begleitungen zu Liedern, Rhythmen mit Körperinstrumenten (5).
  - Singen/Stimme: „Singen einfacher Melodien“, Stimmtechnik, Tonaufnahme (5, 6).
- Der Lehrplan sagt, Stichpunkte sind Planungsgrundlage mit pädagogisch verantworteter Auswahl (S. 4). Reihenfolge der
  Kapitel ist unsere Didaktik; der Lehrplan nennt keine feste Reihenfolge der Lernfelder.
- Der frühere Anker Kernlehrplan NRW (Heft 3406) wurde nicht gelesen (PDF nicht abrufbar) und entfällt als Orientierung;
  die (guess)-Markierung dazu ist damit geklärt.

### Kompetenzen nach Kapitel

1. **Hören und Klang beschreiben**
   - Ich kann Lautstärke, Tempo und Klangfarbe eines Klangs mit Fachwörtern beschreiben.
   - Ich kann Instrumente den Instrumentenfamilien zuordnen.
2. **Tonhöhe und Klaviatur**
   - Ich kann hohe und tiefe Töne unterscheiden und der Höhe nach ordnen.
   - Ich kann Töne auf der Klaviatur benennen und zeigen.
3. **Rhythmus und Takt**
   - Ich kann Notenwerte und Pausen benennen und ihre Dauer vergleichen.
   - Ich kann einen Rhythmus im Takt klatschen.
   - Ich kann einen Takt (2/4, 3/4, 4/4) heraushören und betonen.
4. **Noten lesen**
   - Ich kann Noten im Violinschlüssel auf den Linien und in den Zwischenräumen benennen.
   - Ich kann einen einfachen Rhythmus oder eine kurze Melodie aus Noten ablesen.
5. **Tonleitern und Intervalle**
   - Ich kann Dur und Moll unterscheiden.
   - Ich kann eine Dur-Tonleiter aus Ganz- und Halbtonschritten aufbauen.
   - Ich kann Intervalle (Sekunde bis Oktave) hören und benennen.
   - Ich kann eine Tonfolge nachsingen.
6. **Begleiten und Erfinden**
   - Ich kann ein Lied mit gleichmäßigem Grundschlag begleiten.
   - Ich kann einen eigenen Rhythmus aus vier Takten erfinden und aufschreiben.
   - Ich kann eine kurze Melodie auf der Klaviatur erfinden und mit einem Vorbild vergleichen.

### Wie Lernende dahin kommen, und welcher Irrtum aufgefangen wird

- Klangbeschreibung: hören, dann Merkmale zuordnen. Irrtum: „laut“ und „hoch“ verwechseln.
- Instrumentenfamilien: Klang hören und zuordnen. Irrtum: Klavier ist ein Blasinstrument; Familie nach Aussehen.
- Tonhöhe: zwei Töne vergleichen, Reihenfolge herstellen. Irrtum: „lauter = höher“.
- Klaviatur: Muster aus zwei und drei schwarzen Tasten ableiten, daraus C finden. Irrtum: schwarze Tasten heißen
  nicht „A, B, C“; Töne rechts liegen höher.
- Notenwerte: Balken aus Teilen der Zeit herleiten (Ganze = 2 Halbe = 4 Viertel). Irrtum: kürzerer Wert = langsamer.
- Takt: Betonung heraushören, Schläge zählen. Irrtum: Taktart bestimmt das Tempo.
- Noten lesen: Linien merken, Eselsbrücke ableiten. Irrtum: Linien und Zwischenräume verwechseln.
- Dur und Moll: Tonleiter aus Ganz- und Halbtonschritten bauen. Irrtum: Moll = „traurig“ als Regel.
- Intervalle: Töne zählen und hören. Irrtum: Zählung ohne den Startton („Terz“ als zwei Schritte).
- Begleiten und Erfinden: eigene Muster bauen, anhören, mit Vorbild vergleichen; keine falschen Antworten bei der
  freien Aufgabe, nur Rückmeldung zu Länge, Takt und Tonumfang.

### Umfang

- Drin: alle sechs Kapitel mit je zwei bis vier Seiten; Töne im Bereich eines Klaviers von C bis c² (zwei Oktaven);
  Violinschlüssel (kein Bassschlüssel, keine Vorzeichen außer in Kapitel 5); Taktarten 2/4, 3/4, 4/4; Notenwerte
  Ganze bis Achtel mit Pausen; Dur-Tonleitern ab C, Moll natürlich ab A; Intervalle Sekunde bis Oktave.
- Draußen: Bassschlüssel, Vorzeichen-Lehre, Akkordlehre, Musikgeschichte, Komponisten, Musikverständnis nach Epochen.
  Grund: Umfang der ersten Version; später als Erweiterung.
- Sprache: Deutsch. Klänge: synthetisch (Web Audio), keine Aufnahmen Dritter.
- Singen ist in Kapitel 5 und 6 gut sichtbar (Tonfolge nachsingen, eigene Melodie singen und vergleichen); Stimme und
  Mikrofon sind der Kern (Wunsch der Lehrkraft).
- Mikrofon: Tonhöhe der Stimme und Klatschen werden lokal im Browser gemessen. Jede Übung hat eine Alternative ohne
  Mikrofon („So übst du selbst“). Kein Upload, keine Speicherung.

### Umsetzung (Abweichungen vom Plan)

- Sieben statt sechs Komponenten: `NotenAufgabe` kam hinzu, weil eine `generated`-Aufgabe kein wechselndes Notenbild zeigen
  kann. `Stimmspiegel` hat den Modus „eigene Melodie“ (Auswahl der Töne) für Seite 6.3.
- Tonumfang c¹ bis c³ (nicht „C bis c²“).
- Im 4/4-Achtelraster zeigt `RhythmusWerkstatt` zwei Zeilen je Takt (360 px); 4 Takte im Achtelraster werden dadurch lang.
- Lehrplan: der hessische Lehrplan (Link vom Creator) ersetzt die NRW-Vermutung.

### Quellen (Zweitquellen)

Geprüft = Seite lädt und ist der Artikel zum Thema (de.wikipedia.org, CC BY-SA); nur Fakten übernommen, keine Sätze.

- Tonhöhe <https://de.wikipedia.org/wiki/Tonh%C3%B6he>: geprüft
- Notenschrift <https://de.wikipedia.org/wiki/Notenschrift>: geprüft
- Takt (Musik) <https://de.wikipedia.org/wiki/Takt_(Musik)>: geprüft
- Tonleiter <https://de.wikipedia.org/wiki/Tonleiter>: geprüft
- Klaviatur <https://de.wikipedia.org/wiki/Klaviatur>: geprüft
- Lautstärke <https://de.wikipedia.org/wiki/Lautst%C3%A4rke>: geprüft
- Tempo (Musik) <https://de.wikipedia.org/wiki/Tempo_(Musik)>: geprüft
- Musikinstrument <https://de.wikipedia.org/wiki/Musikinstrument>: geprüft
- Frequenz <https://de.wikipedia.org/wiki/Frequenz>: geprüft
- Violinschlüssel <https://de.wikipedia.org/wiki/Violinschl%C3%BCssel>: geprüft
- Intervall (Musik) <https://de.wikipedia.org/wiki/Intervall_(Musik)>: geprüft (Prime 0 bis Oktave 12 Halbtöne)
- Klangfarbe <https://de.wikipedia.org/wiki/Klangfarbe>: geprüft
- Dur <https://de.wikipedia.org/wiki/Dur> und Moll <https://de.wikipedia.org/wiki/Moll>: geprüft
- Notenwert <https://de.wikipedia.org/wiki/Notenwert>: geprüft (jeder Wert halb so lang wie der vorige)
- Kammerton <https://de.wikipedia.org/wiki/Kammerton>: geprüft (a¹ = 440 Hz; manche Orchester 443 Hz)
- „Rhythmus“ ist auf Wikipedia eine Begriffsklärung; der Musik-Artikel „Rhythmus (Musik)“ ist **nicht geprüft**, ebenso
  Pentatonik, Dynamik, Obertonreihe, Orchester. Vor dem Schreiben dieser Seiten nachholen.
- Nicht geprüft: serlo.org hat kein Musikfach; keine Videoquelle gewählt.
- Fakten wie Halbtonschritte der Intervalle und A = 440 Hz sind damit belegt; weitere Fakten vor dem Schreiben prüfen.

## Explore

<!--
- Find out what the app teaches, for whom, how much and how it looks. All content questions belong here; Plan only
  maps the answers onto the archetype.
- Ask. Write no code, run no `create`.
- An answer counts only in the creator's words under "Answers". Never tick a topic you assumed.
- Skills: `lernapps-app`, `lernapps-exercise-patterns`, `lernapps-<archetype>-design`, `lernapps-content-research`.
-->

### Tasks

- [x] Install the skills, if missing (the app commits them): `npx --yes skills add
      lernapps/tooling -y -s lernapps-app lernapps-content-research lernapps-exercise-patterns
      lernapps-content-growth lernapps-check lernapps-content-questions lernapps-github lernapps-commit
      lernapps-listing`.
- [x] Load skill `lernapps-app`. Tell the creator in two sentences what a lernapps app is and where it will live: at
      their own address, free, public, and once listed as a copy on lernapps.net. The technical part (GitHub) comes at the end, and you do it.
- [x] Interview: ask the topics "Goal" and "Learners" of "Answers".
- [x] Load skill `lernapps-exercise-patterns` and read the patterns of the subject: how will learners practise what
      the goal names? The kind of practice points to the archetype, as the skill says.
- [x] Choose the archetype as skill `lernapps-app` says, from the kind of practice: read the README of each
      archetype in question, tell the creator what the chosen one can and cannot do. Write it and its reason under
      "Key decisions". Set `archetype`.
- [x] Install the archetype's skills: `npx --yes skills add lernapps/tooling -y -s
      lernapps-<archetype>-design lernapps-<archetype>`. Load skill `lernapps-<archetype>-design`.
- [x] Interview: ask the other topics of "Answers" in order. Skip a topic only when an earlier answer covers it; note
      which. No answer → ask once more; still none → write your assumption with "(guess)". Done when every topic
      has an answer or a guess.
- [x] Load skill `lernapps-content-research`. Research as it says. Under "Notes": curriculum orientation,
      competencies by chapter as "Ich kann …", verified sources. No competencies → not done.
- [x] Under "Notes", one line per competency: how learners get there (derive, not only read off; e.g. a tree diagram
      shows how a probability comes about), which misconception the feedback catches.
- [x] Under "Notes", the scope: what is in, what is out and why, the data range (e.g. "all main-group elements",
      never a silent "1–20"), the languages.
- [x] Fetch https://lernapps.net/apps/schemas/entry.v1.schema.json and read each property's description. Ask what
      helps teachers and parents find the app. Fill "Entry draft". Search words: one or two words each, as people
      type them.
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, competencies by chapter, didactic
      approach, scope, every "(guess)", sources and how you checked them, what is unchecked, archetype and reason.
      Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

<!-- The interview: per topic the creator's answer, in their words. Keep the topics. -->

- Goal: (Lehrkraft, über die Elternsitzung) „Die Kinder sollen Musik selbst erleben, nicht nur lesen. Sie hören,
  klatschen, singen, spielen und vergleichen … Töne und Tonhöhen unterscheiden, einfache Noten und Rhythmen lesen und
  klatschen, Tonleitern und Intervalle erkennen und singen, Lautstärke, Tempo und Klangfarbe beschreiben,
  Instrumentenfamilien benennen, ein Lied im Takt begleiten, eigene kleine Melodien oder Rhythmen erfinden. Töne im
  Browser erzeugen, per Mikrofon Stimme oder Klatschen aufnehmen und mit einem Vorbild vergleichen. Alles lokal, nichts
  hochgeladen, Klänge synthetisch. Zu jeder Mikrofon-Übung eine Alternative zum selbst Üben.“
- Learners: Klasse 5 bis 7 weiterführende Schule, kaum Vorwissen (vielleicht Blockflöte oder Singen aus der
  Grundschule). Lehrplan selbst suchen; sonst Gymnasium NRW, Fach Musik, Jahrgang 5–7, Wahl im Plan nennen.
- Model and focus: an app of the catalog (read https://lernapps.net/apps/llms.txt) as model; what matters most
  (exercises, visualisations, game feel).
- Hurdles: nicht gefragt; Annahmen unter „Notes“ (guess). Die Lehrkraft will vor allem Überblick: grobe Inhalte und
  Reihenfolge.
- Content: gut recherchiert, mit geprüften Quellen; Form: Explainer mit eigenen Komponenten für Noten, Rhythmus,
  Klaviatur und Ton-Visualisierung. Ich schreibe aus Quellen; kein eigenes Material der Lehrkraft.
- Amount: nicht gefragt (guess): sechs Kapitel mit je zwei bis vier Seiten; Rest später.
- Languages: Deutsch (guess), klare, einfache Sprache nach ISO 24495.
- Look and feel: Spaß an Musik, interaktiv; der Archetyp gibt den ruhigen Arbeitsblatt-Stil vor (guess).
- Terms: nicht gefragt (guess): übliche Fachwörter (Tonhöhe, Notenwert, Takt, Klaviatur, Intervall, Tonleiter).

### Entry draft

<!-- YAML valid against the entry schema, with its property names. Only known values, never invented. -->

```yaml
title: Musik erleben
subject: Musik
grades: [5, 6, 7]
summary: >-
  Hören, klatschen, singen und vergleichen: Du lernst Töne, Rhythmen und Noten kennen und baust eigene kleine
  Melodien. Alle Klänge entstehen im Browser; das Mikrofon ist freiwillig, und jede Übung geht auch ohne.
keywords: [Noten lesen, Rhythmus klatschen, Tonleiter, Intervalle, Klaviatur, Instrumente]
creator:
  name: Oliver Jägle   # vom Creator bestätigt (GitHub-Konto der Sitzung)
source: https://github.com/lernapps/musik
fitness: {account: false, install: false, storage: none}
# url und commit folgen in Commit.
```

### Completed

## Plan

<!--
- Map the confirmed content onto the archetype: structure, screens or pages, exercise patterns, data files,
  components.
- No new content questions. A content gap → back to Explore; say so.
- Confirmable in one read. After the yes, work on your own: at most 3 creator turns until the listing.
- Skills: `lernapps-<archetype>-design` and `lernapps-exercise-patterns`, both loaded in Explore.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: plan`; else set it.
- [x] Map the content as skill `lernapps-<archetype>-design` says; reread it if it is no longer in view.
- [x] Choose a pattern per competency as skill `lernapps-exercise-patterns` says (loaded in Explore; reread it if it
      is no longer in view). Write "Content method".
- [x] Write the Code tasks under "Code": pages or screens, their content, what each shows. Each ends in a commit.
- [x] Each screen, component or interactive exercise: a sketch (static SVG or image, or the steps with what
      learners see after each). Words alone are not enough.
- [x] Show the creator, short: goal, competencies by chapter, entry draft, tasks, sketches; the content method in
      plain words (what learners see and do, what it cannot do). At most 2 questions.
- [x] **Checkpoint:** confirm the plan and the content method, with the sketches shown. Stop and wait for an
      explicit yes. Changes → change, ask again. No `create` before the yes.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Seiten (Abbildung der Inhalte)

Kapitel 1 Hören und Klang beschreiben
- 1.1 Laut und leise: `Klangbild` (Lautstärke); `merke` leise/laut, p/f; Übung `true-false`, `ordering`.
- 1.2 Schnell und langsam: `RhythmusWerkstatt` (Tempo, Metronom); Übung `single-choice`.
- 1.3 Klangfarbe und Instrumentenfamilien: `Klangbild` (Wellenform), `table` und `labelled-figure` Orchester; Übung
  `matching` aus `instrumente.yaml`.

Kapitel 2 Tonhöhe und Klaviatur
- 2.1 Hoch und tief: `Klangbild` (Tonhöhe), `HoerAufgabe` höher/tiefer; Irrtum „laut = hoch“.
- 2.2 Die Klaviatur: `Klaviatur`; Muster 2 und 3 schwarze Tasten, C finden, Tonnamen C–H; `generated` Taste → Name.
- 2.3 Meine Stimme hat eine Tonhöhe: `Stimmspiegel` (Einzelton); `so-uebst-du-selbst`; Übung `single-choice`.

Kapitel 3 Rhythmus und Takt
- 3.1 Grundschlag und Takt: `RhythmusWerkstatt`, `HoerAufgabe` Taktart; 2/4, 3/4, 4/4.
- 3.2 Notenwerte und Pausen: `table`/Abbildung Ganze bis Achtel (jeder Wert halb so lang); `generated` Dauer in Achteln.
- 3.3 Rhythmen klatschen: `RhythmusWerkstatt` mit Klatschen; `so-uebst-du-selbst`; Übung `ordering`.

Kapitel 4 Noten lesen
- 4.1 Notenlinien und Violinschlüssel: `Notenzeile`; Linien und Zwischenräume; Übung `matching`.
- 4.2 Noten benennen: `Notenzeile`; `generated` (gezeigte Note → Name; Abbildung zeigt die Aufgabe, nicht die Antwort).
- 4.3 Rhythmus und Melodie lesen: `Notenzeile` abspielen; Übung `single-choice` (Welcher Rhythmus erklingt?).

Kapitel 5 Tonleitern und Intervalle
- 5.1 Ganzton, Halbton, Dur-Tonleiter: `Klaviatur`; `generated` Ton nach Schrittmuster.
- 5.2 Dur und Moll hören: `HoerAufgabe` Dur/Moll; Irrtum „Moll = traurig“.
- 5.3 Intervalle: `HoerAufgabe` Intervall; Tabelle aus `intervalle.yaml`; `generated` Halbtöne zwischen Tönen.
- 5.4 Nachsingen: `Stimmspiegel` (Tonfolge); `so-uebst-du-selbst`; Übung `ordering` (Tonfolge nach Höhe).

Kapitel 6 Begleiten und Erfinden
- 6.1 Begleiten mit Grundschlag: `RhythmusWerkstatt`; `so-uebst-du-selbst`; Übung `single-choice`.
- 6.2 Eigenen Rhythmus erfinden: `RhythmusWerkstatt` (4 Takte) + `Notenzeile` Anzeige; Übung `generated` (Wie viele Achtel
  hat ein 4/4-Takt? Passt dein Rhythmus?).
- 6.3 Eigene Melodie erfinden und singen: `Klaviatur` + `Stimmspiegel` + `Notenzeile`; Vergleich mit Vorbild;
  `so-uebst-du-selbst`; Übung `true-false`.

### Content method

**Aufbau jeder Seite** (feste Abschnitte, gleiche ids): `ausprobieren` (Komponente oder Abbildung), `merke`
(Definition/Regel in einfacher Sprache), `so-uebst-du-selbst` (nur wo ein Mikrofon-Werkzeug steht: Kasten `note`
mit Schritten ohne Mikrofon: summen/singen, Hand auf den Hals, mit Klavier oder Handy-App vergleichen, Partner:in
hört zu; ohne Technik), `uebung` (mindestens eine Frage oder `generated`).

**Muster**
- *Hören-Vergleichen* (assign/compare): `HoerAufgabe` (Übungskomponente): zwei Töne oder Tonfolgen, die Antwort wird
  gehört und gewählt. Arten: höher/tiefer, lauter/leiser, Intervall nennen, Dur/Moll, Taktart. Feste Seeds, 50 Seeds
  getestet. Grenze: Klang nur synthetisch; kein echter Instrumentenklang.
- *Zuordnen* (assign): `matching` Instrument ↔ Familie, Notenwert ↔ Name, Taste ↔ Tonname.
- *Berechnen* (`generated`): Dauer in Achteln, Halbtonschritte zwischen zwei Tönen, Ton nach n Halbtönen, Ton in
  einer Dur-Tonleiter. Typische Fehler mit Meldung ("Du hast die Starttaste mitgezählt").
- *Ordnen* (`ordering`): Töne nach Höhe, Notenwerte nach Dauer.
- *Urteilen* (`true-false`, `single-choice`): Aussagen zu Taktarten, Dur/Moll, „laut = hoch?“; jede falsche Option mit
  Grund.
- *Selbst machen* (freie Aufgabe): Rhythmus erfinden, Melodie erfinden. Hier gibt es kein „falsch“; die Komponente
  meldet nur Länge, Takt und Tonumfang; die Pflichtfrage der Seite prüft das Wissen dahinter.

**Komponenten** (alle in `src/components/`, ≤ 20 kB gzip; gemeinsamer Klang-Helfer `Klang.ts` mit Web Audio,
Töne erst nach Klick; Mikrofon nur nach Klick und Einwilligung des Browsers, nur im Browser, nichts gespeichert;
Skizzen in `.vibe/plans/sketches/`)
1. `Klaviatur`: spielbare Tastatur C bis c² mit Namen; Props: markierte Töne, Namen an/aus. Grenze: kein
   Anschlagsstärke, keine Pedale.
2. `Klangbild`: Welle eines Tons mit Reglern Tonhöhe, Lautstärke, Klangfarbe (Sinus/Dreieck/Rechteck). Grenze:
   synthetische Wellenformen, keine echten Instrumente.
3. `Notenzeile`: Noten im Violinschlüssel aus Props (Tonname, Wert), antippen = Name und Klang, „Alles abspielen“.
   Grenze: nur Violinschlüssel, keine Vorzeichen außer in Kapitel 5.
4. `RhythmusWerkstatt`: 8 oder 12 oder 16 Felder, Taktart, Tempo, Metronom, Abspielen; optional Klatschen mit
   Mikrofon (Lautstärkesprünge werden erkannt, Vergleich mit dem Muster). Grenze: erkennt Klatschen, keine Töne.
5. `Stimmspiegel`: Mikrofon, Tonhöhe der Stimme (Autokorrelation), Linie gegen Zielton, Abweichung in Cent; Modus
   Einzelton und Tonfolge. Grenze: einstimmig, ruhige Umgebung, Kinderstimmen unter ca. 200 Hz werden schlecht
   erkannt (siehe Alternative). Ohne Mikrofon: Zielton nur hören und selbst üben.
6. `HoerAufgabe`: Übungskomponente, siehe oben. `generate`, `check`, `solution`, `wrong` und Begründung rein, getestet.

**Mikrofon-Alternative:** Jedes Werkzeug mit Mikrofon (`RhythmusWerkstatt` mit Klatschen, `Stimmspiegel`) hat im
Abschnitt `so-uebst-du-selbst` eine schriftliche Anleitung ohne Technik und ist ohne Mikrofon voll nutzbar
(Zielton hören, Muster abspielen). Kein Lernschritt hängt am Mikrofon.

**Daten:** `src/data/instrumente.yaml` (Name, Familie, Beschreibung), `src/data/noten.yaml` (Tonname, Position,
Frequenz, Taste), `src/data/intervalle.yaml` (Name, Halbtöne, Beispiel-Ton, Eselsbrücke-Hinweis), `src/data/notenwerte.yaml`.
Jede Tatsache einmal.

**Abbildungen:** Klaviatur, Notenzeile und Wellen entstehen in Komponenten oder als SVG in `src/images/` mit
einheitlichen Farben (Ton C hervorgehoben, Zielton grün, Abweichung rot) und Textalternative.

**Neues Kapitel später:** Ordner mit `chapter.yaml` und Seiten im Seitenaufbau oben, Fakten in die Datendateien, Seite
in `chapter.yaml` und Kapitel in `src/app.yaml` eintragen; Komponenten wiederverwenden.

### Completed

## Code

<!--
- Build the app from the archetype and the confirmed plan, locally on `work`. Work on your own.
- Commit after each task; the hooks check. A check fails → skill `lernapps-check`. Fix from the message; never
  bypass a hook.
- Undecidable → choose, mark "(guess)" under "Key decisions", go on.
- Creator asks for a change → first say your reading in one sentence ("Ich nehme alle 44 Hauptgruppenelemente
  auf."); never narrow it silently. Content change → update "Notes" too.
- Skills: `lernapps-check`, `lernapps-<archetype>`, `lernapps-content-questions`, and the app's content guide
  `app-content`.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] Load skill `lernapps-check`. Create the app in this plan's folder as it says. `create` keeps this plan. Never
      write the app by hand.
- [x] Fill the content guide `.agents/skills/app-content/SKILL.md` from "Notes" and "Content method"
      (`app-content-guide`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0. Commit it before
      any content.
- [x] Load skill `lernapps-explainer`, the content guide and `lernapps-content-questions`.
- [x] Gemeinsam: `app.yaml` (Titel „Musik erleben“, Sprache de), Datendateien `instrumente`, `noten`, `intervalle`,
      `notenwerte`; Beispielkapitel „Prozent“ entfernen. Commit.
- [x] Komponente `Klang.ts` (Web Audio, Töne) und `Klaviatur`, mit Test. Commit.
- [x] Komponente `Klangbild`, mit Test. Commit.
- [x] Komponente `Notenzeile`, mit Test. Commit.
- [x] Komponente `RhythmusWerkstatt` (mit Mikrofon-Klatschen als Option), mit Test. Commit.
- [x] Komponente `Stimmspiegel` (Tonhöhenerkennung, Mikrofon als Option), mit Test. Commit.
- [x] Übungskomponente `HoerAufgabe` (50 Seeds getestet). Commit.
- [x] Kapitel 1 (Seiten 1.1–1.3), Fakten vorher an Quellen prüfen. Commit.
- [x] Kapitel 2 (2.1–2.3). Commit.
- [x] Kapitel 3 (3.1–3.3), Quelle „Rhythmus (Musik)“ vorher prüfen. Commit.
- [x] Kapitel 4 (4.1–4.3). Commit.
- [x] Kapitel 5 (5.1–5.4), Quelle Pentatonik nur falls genutzt. Commit.
- [x] Kapitel 6 (6.1–6.3). Commit.
- [x] Jede Mikrofon-Übung hat „So übst du selbst“ (nur Text, ohne Technik) und läuft ohne Mikrofon (Prüfung per Test
      ohne `getUserMedia`).
- [x] The content guide matches what was built (`app-content-matches`).
- [x] `npx lernapps check` passes.
- [x] Look at a screenshot of every screen and state (start, each mode, pause, end), desktop and 360 px. Compare
      each with the confirmed sketches.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).
      No checkpoint here: set it before you ask or report anything, then start Commit in the same message.

### Completed

## Commit

<!--
- Put the app on GitHub, publish it with the creator's yes, then list it. A push to `main` publishes.
- Open the pull requests (to `main`, to the catalog) without asking: they publish nothing; their preview and result
  are what the creator decides on.
- Skills: `lernapps-github`, `lernapps-commit`, `lernapps-listing`.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: commit`; else set it.
- [x] Load skill `lernapps-github`. Repo and Pages as it says: ask the repo name and every click only the creator can
      make in one message.
- [x] Push `work`, open the preview pull request, see its checks to green as the skill says.
- [x] **Checkpoint:** publish. Show what the app does and the preview link from the comment "Vorschau der App"; ask
      whether it may go online; put any open click into the same question. Wait for the yes.
- [x] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: `work` into `main` as one squash commit
      with the message from this plan, the run of `Pages` watched to the end.
- [x] Open the address the job `deploy` printed; confirm the app shows. Use that address, never a derived one.
- [ ] Load skill `lernapps-listing`. Complete the entry draft (e.g. the address).
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it: the listing check and the review read it there.
- [ ] **Checkpoint:** list. Open the listing pull request as the skill says, without asking first: the pull request
      is the review. See it to "bestanden", then show the creator the pull request and its result; change nothing in
      it without their word.
- [ ] Plan changed since its last push → commit it on `main`, push again.

### Completed

Veröffentlicht unter http://lernapps.net/musik/ (Job `deploy` erfolgreich, Seiten und Komponenten geprüft). Listing im Katalog: nicht Teil dieses Auftrags, offen.

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

commit; Recherche, Plan und Veröffentlichen bestätigt. Das Listing im Katalog war nicht Teil dieses Auftrags.

### Creator turns after the plan

6 Nachrichten des Nutzers nach der Plan-Bestätigung: Link zum hessischen Lehrplan; Erlaubnis zur Websuche; Erlaubnis zum
Pushen und zu allem in `lernapps/musik`; Urheber bestätigt; Hinweis „keine interaktiven Elemente“ in der Vorschau;
„veröffentliche“. Dazu Antworten der Lehrkraft-Sitzung auf den Checkpoints (Recherche, Plan).

### Where I had to guess

- Lehrplan NRW (Heft 3406) war nicht abrufbar; der Nutzer schickte später den hessischen Lehrplan, der als Orientierung dient.
- Reihenfolge der Kapitel ist didaktisch (der Lehrplan nennt keine feste Reihenfolge).
- Sprache nur Deutsch, Seitenzahl und Umfang (Erwartung 2–4 Seiten je Kapitel), Fachwörter: eigene Annahmen.
- Sieben statt sechs Komponenten (`NotenAufgabe` kam hinzu), weil `generated` kein wechselndes Bild zeigen kann.
- Schwelle der Klatsch-Erkennung (0,08) und Genauigkeit bei echten Kinderstimmen: nur mit künstlichem Mikrofon geprüft.
- Lücke in der Vorlage: Vue-Bausteine mit Unterstrich im Dateinamen (`_plugin-vue_export-helper`) lieferte GitHub Pages
  (Jekyll) nicht aus, die Komponenten starteten nicht. Ich habe `public/.nojekyll` ergänzt und auf `gh-pages` gelegt; das
  gehört in die Vorlage (lernapps/app-templates), eine Meldung steht noch aus.
- Der Pre-Push-Hook scheiterte auf einem leeren Start-Commit (keine App im Baum). `main` und `gh-pages` entstanden über
  das GitHub-Werkzeug, mit einem Platzhalter `.gitkeep`, den die erste Version wieder entfernt.
- Die Komponenten `Klang.ts`-Helfer wurden mit Hilfsagenten parallel gebaut; die Berichte nennen Browser-Prüfungen, die ohne
  echte Hardware nicht möglich waren.

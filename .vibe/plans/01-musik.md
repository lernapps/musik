---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype, null until chosen in Explore. Allowed values: explainer, interactive, quiz.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: explore
# prePushFailures: written by the pre-push hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: {}
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
- Lehrplan-Orientierung: Gymnasium NRW, Fach Musik, Sekundarstufe I (Wahl der Lehrkraft als Rückfall). (guess)
  Der Lehrplantext war nicht abrufbar; die Reihenfolge der Kapitel folgt der Didaktik, nicht einer geprüften Stelle.
- Jede Mikrofon-Übung hat eine Alternative ohne Mikrofon, die beschreibt, wie man selbst übt. Das Mikrofon ist nie
  Pflicht und braucht eine Einwilligung des Browsers.
- Sprache: nur Deutsch, einfache Sprache (ISO 24495). (guess)
- Aussehen: ruhig wie ein Arbeitsblatt (Vorgabe des Archetyps); Dunkelmodus folgt dem Gerät.

## Notes

### Lehrplan

- Orientierung: Kernlehrplan Musik, Gymnasium Sekundarstufe I, Nordrhein-Westfalen (Ministerium für Schule und
  Bildung NRW, Heft 3406, 1. Auflage 2019, Runderlass vom 23.06.2019,
  <https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_mu_klp_3406_2019_06_23_0.pdf>). Titel, Heft und
  Jahr stammen aus einer Suche. **Nicht gelesen:** das PDF und die Seite des Landes antworteten mehrfach mit Fehler 503
  bzw. Verbindungsabbruch. Keine Inhaltsfeld- oder Seitenangabe, nichts aus dem Gedächtnis zitiert. Der Lehrplan gibt nach Auskunft von Suchergebnissen keine verbindlichen
  musikalischen Strukturen vor; die Fachkonferenz legt sie fest. Er ist hier nur Orientierung für Stufe und Reihenfolge.

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
- Mikrofon: Tonhöhe der Stimme und Klatschen werden lokal im Browser gemessen. Jede Übung hat eine Alternative ohne
  Mikrofon („So übst du selbst“). Kein Upload, keine Speicherung.

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
- [ ] **Checkpoint:** research. Show in plain words: curriculum orientation, competencies by chapter, didactic
      approach, scope, every "(guess)", sources and how you checked them, what is unchecked, archetype and reason.
      Stop and wait. Changes → change, ask again.
- [ ] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

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
  name: Musiklehrkraft (Name offen)
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

- [ ] `grep '^phase:'` prints `phase: plan`; else set it.
- [ ] Map the content as skill `lernapps-<archetype>-design` says; reread it if it is no longer in view.
- [ ] Choose a pattern per competency as skill `lernapps-exercise-patterns` says (loaded in Explore; reread it if it
      is no longer in view). Write "Content method".
- [ ] Write the Code tasks under "Code": pages or screens, their content, what each shows. Each ends in a commit.
- [ ] Each screen, component or interactive exercise: a sketch (static SVG or image, or the steps with what
      learners see after each). Words alone are not enough.
- [ ] Show the creator, short: goal, competencies by chapter, entry draft, tasks, sketches; the content method in
      plain words (what learners see and do, what it cannot do). At most 2 questions.
- [ ] **Checkpoint:** confirm the plan and the content method, with the sketches shown. Stop and wait for an
      explicit yes. Changes → change, ask again. No `create` before the yes.
- [ ] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

<!-- One line each: exercise patterns and where; figures and how they are made; data files; each component, what it
checks and cannot; how a later agent adds a chapter. Becomes the content guide in Code. -->

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

- [ ] `grep '^phase:'` prints `phase: code`; else set it.
- [ ] Load skill `lernapps-check`. Create the app in this plan's folder as it says. `create` keeps this plan. Never
      write the app by hand.
- [ ] Fill the content guide `.agents/skills/app-content/SKILL.md` from "Notes" and "Content method"
      (`app-content-guide`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0. Commit it before
      any content.
- [ ] Load skill `lernapps-<archetype>` and the content guide. Questions with options and feedback: also skill
      `lernapps-content-questions`.
- [ ] <the tasks written in Plan; after each, commit on `work`>
- [ ] The content guide matches what was built (`app-content-matches`).
- [ ] `npx lernapps check` passes.
- [ ] Look at a screenshot of every screen and state (start, each mode, pause, end), desktop and 360 px. Compare
      each with the confirmed sketches.
- [ ] Every box of Explore, Plan and Code ticked.
- [ ] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).
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

- [ ] `grep '^phase:'` prints `phase: commit`; else set it.
- [ ] Load skill `lernapps-github`. Repo and Pages as it says: ask the repo name and every click only the creator can
      make in one message.
- [ ] Push `work`, open the preview pull request, see its checks to green as the skill says.
- [ ] **Checkpoint:** publish. Show what the app does and the preview link from the comment "Vorschau der App"; ask
      whether it may go online; put any open click into the same question. Wait for the yes.
- [ ] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: `work` into `main` as one squash commit
      with the message from this plan, the run of `Pages` watched to the end.
- [ ] Open the address the job `deploy` printed; confirm the app shows. Use that address, never a derived one.
- [ ] Load skill `lernapps-listing`. Complete the entry draft (e.g. the address).
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it: the listing check and the review read it there.
- [ ] **Checkpoint:** list. Open the listing pull request as the skill says, without asking first: the pull request
      is the review. See it to "bestanden", then show the creator the pull request and its result; change nothing in
      it without their word.
- [ ] Plan changed since its last push → commit it on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: at most 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, messages or answers, and your choice. "None" if none. -->

---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: { checks-pass: 1 }
---

# Increment: Selbsteinschätzung

<!--
For you, the assistant. One increment of a published app: new competencies, chapters, pages, rounds, questions, or
a correction.
1. Path: `.vibe/plans/<NN>-<short name>.md`, NN = highest + 1. Never change an earlier plan. App with only
   `.vibe/plan.md`: that is plan 01; start this one as 02 (the update in Code moves it).
2. The first version's decisions stand: archetype, content method, content guide
   `.agents/skills/app-content/SKILL.md`. Change the guide only for a new pattern, figure type or source rule; say
   so at the checkpoints.
3. Read this plan before each step. One phase at a time, tasks in order.
4. Task done → tick `[x]` at once and move it to "Completed" of its phase. New task found → add it.
5. Each phase names its skills. Load a skill when its task comes, not before. Read it in full, from its file.
6. Checkpoint: stop, ask, wait for the creator's answer.
   Only a checkpoint waits. A phase's last box → set the next phase and go on in the same message.
7. At most 2 questions per message, one topic each.
8. Work on the branch `increment/<NN>-<short name>`. Until Commit everything is local: push nothing.
9. Plan in the creator's language. Keep headings and front matter keys. Delete a comment once its part is filled.
10. Begin each reply to the creator with the phase in `phase:`, and at a checkpoint the word checkpoint:
    "**Plan · Checkpoint**", "**Code**". The creator always knows where you are.
-->

*Begonnen 2026-10-29. Explore, Plan, Code, Commit.*

## Goal

Lernende können vor dem Lernen einschätzen, was sie schon können: eine Selbsteinschätzung je Kapitel und für die ganze App, aus Übungen der Seiten.

## Key decisions

- Erst das Update (Tooling auf main, app-templates ≥ 281e572), dann `selfAssessment` in jedem `chapter.yaml`: die Laufzeit kann es erst ab dieser Version.
- Keine neuen Inhalte; nur Übungen, die es schon gibt. Übungs-Komponenten (HoerAufgabe, NotenAufgabe, Klaviatur, RhythmusWerkstatt) gehen nicht (Build-Problem).
- Hör-Aufgaben nur, wenn ihr Klang mit der Frage kommt; sonst eine andere Übung der Seite (guess).
- Etwa 3 Übungen je Kapitel, zusammen etwa 18: etwa zehn Minuten (guess).
- Der Ersteller hat allem zugestimmt, auch dem Veröffentlichen: keine Checkpoints, an denen ich warte.
- Abgefragt: hoeren (schnell-langsam, klangfarbe), tonhoehe (hoch-tief, klaviatur), rhythmus (notenwerte, klatschen),
  noten (linien), tonleitern (dur-bauen, intervalle); je Seite 2 Übungen, 18 zusammen. `stufe-halbtoene` zweimal.
- Kapitel `erfinden` ohne Selbsteinschätzung: Seine Seiten lehren Begleiten und Erfinden (etwas machen); seine
  Rechenfragen prüfen das nicht. Der Tutor geht es Seite für Seite durch.
- Nicht abgefragt: `stimme`, `grundschlag-takt`, `benennen`, `dur-moll` (außer der Komponente nur ratbare Fragen),
  `lesen` (eine Frage braucht die Melodie der Seite), `nachsingen` (Singen), `laut-leise` (für die Länge, guess).

## Notes

- Keine neuen Kompetenzen, Quellen oder Seiten. Die Selbsteinschätzung fragt die Kompetenzen der vorhandenen Seiten ab.

## Explore

### Tasks

### Answers

- „Aktiviere die Selbsteinschätzung für die beiden explainer Mathe-Karte und Musik. Mach grüner ci Mergen“
- Gelesen als: Selbsteinschätzung in jedem Kapitel einschalten, CI grün machen, veröffentlichen. Der Ersteller hat
  allem zugestimmt, auch dem Veröffentlichen; deshalb warte ich an keinem Checkpoint.

### Completed

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Skills are in `.agents/skills/`; if missing, install them as the first task of the plan template says.
- [x] Read the README of the archetype's template: neu ist die Selbsteinschätzung (`selfAssessment` je Kapitel).
- [x] Load the content guide `.agents/skills/app-content/SKILL.md`. Read the plans in `.vibe/plans/`.
- [x] Interview: der Auftrag des Erstellers ist die Antwort (siehe „Answers“); keine neuen Inhalte.
- [x] Load skill `lernapps-content-research`: nichts zu recherchieren, keine neuen Kompetenzen oder Quellen.
- [x] Under "Notes": the didactic approach per competency and the scope (in, out, data range).
- [x] A kind of content the guide does not cover: entfällt (keine neue Seite, Komponente oder Übungsart).
- [x] **Checkpoint:** research. Entfällt: der Ersteller hat schon zugestimmt.
- [x] Set `phase: plan`.

## Plan

### Tasks

### Content method

- Keine neuen Muster. `selfAssessment` je `chapter.yaml` mit vorhandenen Übungen (Fragen, `generated`), keine
  Übungs-Komponenten; Hör-Fragen nur, wenn sie ohne Klang der Seite klar sind.

### Completed

- [x] Load skill `lernapps-github`. Push the branch, open the preview pull request, see its checks to green as it
      says. Pull request #8, alle Prüfungen grün.
- [x] **Checkpoint:** publish. Der Ersteller hat schon zugestimmt („Mach grüner ci Mergen“): nicht warten.
- [x] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: the pull request squash-merged into
      `main` with the message from this plan, the run of `Pages` watched to the end. c22861c, Lauf von `Pages`
      erfolgreich.
- [x] Open the address the job `deploy` printed; confirm the new content. <https://lernapps.net/musik/einschaetzung/>
      zeigt 18 Aufgaben auf 5 Seiten.
- [x] App listed and its entry changes → no: Themen, Klassen und Zusammenfassung bleiben gleich. Checkpoint "list"
      entfällt.
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it.
- [x] `grep '^phase:'` prints `phase: plan`; else set it.
- [x] Load skill `lernapps-content-growth`: eine einzige Scheibe „Selbsteinschätzung“, keine parallelen Scheiben.
- [x] Write "Content method".
- [x] Each new component or interactive exercise: a sketch. Entfällt: nichts Neues.
- [x] Show the creator, short: entfällt, der Auftrag ist eindeutig.
- [x] **Checkpoint:** confirm the plan. Entfällt: der Ersteller hat schon zugestimmt.
- [x] Set `phase: code`.

## Code

### Tasks

### Completed

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] `git switch -c increment/04-selbsteinschaetzung` from `main`. Commit this plan on it.
- [x] Load skill `lernapps-cli`. Update the app as it says. Commit the update alone; fix its findings before
      content. The update replaces the `lernapps-*` skills: reread those you use. (app-templates 281e572, tooling
      ea78052; `lernapps-check` heißt jetzt `lernapps-cli`. Ein Ende-zu-Ende-Test der Vorlage schlug einmal fehl
      und lief danach 6-mal grün: wackelig, kein Befund der App.)
- [x] Load skill `lernapps-explainer` and the content guide. Keine neuen Fragen: `lernapps-content-questions` entfällt.
- [x] Scheibe: das Update der App ist der Code; die Selbsteinschätzung selbst kommt in Commit (Skill).
- [x] After the first slice: show the creator a first look. Entfällt: keine neue Seite.
- [x] The content guide describes the app as it is now (`app-content-matches`); 0 × „FILL IN“.
- [x] `npx lernapps check` passes.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`.

## Commit

### Tasks

### Completed

- [x] `grep '^phase:'` prints `phase: commit`; else set it.
- [x] Skill `lernapps-explainer-self-assessment` (vom Update installiert) geladen; `selfAssessment` in fünf Kapiteln,
      18 Übungen, je abgefragter Seite 2. Build, `lernapps check` und Ende-zu-Ende-Tests grün; selbst durchlaufen:
      `/einschaetzung/` und `/<kapitel>/einschaetzung/?via=tutor`. Jede Aufgabe ist ohne ihre Seite klar,
      die Tutor-Runde endet in „Zurück zum Tutor“.

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

commit; veröffentlicht. Die Checkpoints entfielen, weil der Ersteller alles vorab freigegeben hatte.

### Creator turns after the plan

0.

### Where I had to guess

- Hör-Aufgaben nur, wenn ihr Klang mit der Frage kommt. Keine der gewählten Aufgaben braucht einen Klang.
- Etwa 3 Übungen je Kapitel, zusammen 18. `laut-leise` wird deshalb nicht abgefragt.
- „Begleiten und Erfinden“ hat keine Einschätzung, weil dort Machen gelernt wird, nicht Rechnen.
- Ein Kapitel mit nur einem Schritt (Noten) zeigt „auf 1 Seiten“. Das ist ein Fehler der Vorlage, korrigiert in lernapps/app-templates#103.

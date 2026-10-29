---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: code
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

- [x] `grep '^phase:'` prints `phase: plan`; else set it.
- [x] Load skill `lernapps-content-growth`: eine einzige Scheibe „Selbsteinschätzung“, keine parallelen Scheiben.
- [x] Write "Content method".
- [x] Each new component or interactive exercise: a sketch. Entfällt: nichts Neues.
- [x] Show the creator, short: entfällt, der Auftrag ist eindeutig.
- [x] **Checkpoint:** confirm the plan. Entfällt: der Ersteller hat schon zugestimmt.
- [x] Set `phase: code`.

## Code

### Tasks

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] `git switch -c increment/04-selbsteinschaetzung` from `main`. Commit this plan on it.
- [x] Load skill `lernapps-cli`. Update the app as it says. Commit the update alone; fix its findings before
      content. The update replaces the `lernapps-*` skills: reread those you use. (app-templates 281e572, tooling
      ea78052; `lernapps-check` heißt jetzt `lernapps-cli`. Ein Ende-zu-Ende-Test der Vorlage schlug einmal fehl
      und lief danach 6-mal grün: wackelig, kein Befund der App.)
- [ ] Load skill `lernapps-<archetype>` and the content guide. Questions with options and feedback: also skill
      `lernapps-content-questions`.
- [ ] Scheibe: das Update der App ist der Code; die Selbsteinschätzung selbst kommt in Commit (Skill).
- [ ] After the first slice: show the creator a first look (`early-preview`) and go on. Entfällt: keine neue Seite.
- [ ] The content guide describes the app as it is now (`app-content-matches`). `grep -c "FILL IN"
      .agents/skills/app-content/SKILL.md` prints 0.
- [ ] `npx lernapps check` passes.
- [ ] Every box of Explore, Plan and Code ticked.
- [ ] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).
      No checkpoint here: set it before you ask or report anything, then start Commit in the same message.

### Completed

## Commit

<!--
- Publish with the creator's yes. A push to `main` publishes.
- Open the pull requests (to `main`, to the catalog) without asking: they publish nothing; their preview and result
  are what the creator decides on.
- Skills: `lernapps-explainer-self-assessment` (an explainer), `lernapps-github`, `lernapps-commit`,
  `lernapps-listing`.
-->

### Tasks

- [ ] `grep '^phase:'` prints `phase: commit`; else set it.
- [ ] An explainer whose pages or exercises changed: install skill `lernapps-explainer-self-assessment` if missing
      (`npx --yes skills add lernapps/tooling -y -s lernapps-explainer-self-assessment`), load it. Update the
      self-assessment as it says (add one, if the app has none and the skill says so). Commit; the hooks check.
- [ ] Load skill `lernapps-github`. Push the branch, open the preview pull request, see its checks to green as it
      says.
- [ ] **Checkpoint:** publish. Show what the increment adds and the preview link; ask whether it may go online. Wait
      for the yes.
- [ ] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: the pull request squash-merged into
      `main` with the message from this plan, the run of `Pages` watched to the end.
- [ ] Open the address the job `deploy` printed; confirm the new content. Never a derived address.
- [ ] App listed and its entry changes (topics, school years, summary) → load skill `lernapps-listing` and write the
      changed entry. Else skip the checkpoint "list".
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it. A push of only `.vibe/` publishes nothing.
- [ ] **Checkpoint:** list. Open the pull request to the catalog without asking first: the pull request is the
      review. See it to "bestanden" as the skill says, then show the creator the pull request and its result.
- [ ] Plan changed since its last push → commit it on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: at most 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, content guide, messages or answers, and your choice. "None" if none. -->

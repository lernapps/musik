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
failedChecks: {}
---

# Increment: Selbsteinschätzung mit Übungs-Komponenten

*Begonnen 2026-10-29. Explore, Plan, Code, Commit.*

## Goal

Die Selbsteinschätzung fragt möglichst viele Inhaltsseiten ab, auch mit den Übungs-Komponenten `HoerAufgabe` und `NotenAufgabe`. So sagt ihr Ergebnis mehr darüber, was ein Kind schon kann.

## Key decisions

- Erst das Update (tooling ≥ a62ad03, app-templates ≥ 2c99933): erst ab dieser Version darf `selfAssessment` eine Übungs-Komponente nennen.
- Abdeckung vor Kürze: so viele Seiten wie sinnvoll, je Seite 2 Aufgaben, je Kapitel bis etwa 10 (Ersteller; die alte Richtzahl 15–20 für die ganze App gilt hier nicht).
- Eine Komponente nur, wenn ihre Aufgabe in ihr selbst klar ist und sie nichts von der Seite braucht.
- Seiten, deren Kompetenz Singen oder Machen ist, bleiben „nicht abgefragt“.
- Der Ersteller hat allem zugestimmt, auch dem Veröffentlichen („Mach … mergen“): keine Checkpoints, an denen ich warte.

## Notes

- Keine neuen Kompetenzen, Quellen oder Seiten. Nur `selfAssessment` und der Inhaltsleitfaden ändern sich.

## Explore

### Tasks

### Answers

- Die Selbsteinschätzung soll auch Übungs-Komponenten abfragen, denn es kommt darauf an, was die Selbsteinschätzung abdeckt.
- Freigabe für alles, auch das Veröffentlichen („Mach … mergen“).

### Completed

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Skills are in `.agents/skills/`; if missing, install them as the first task of the plan template says.
- [x] Read the README of the archetype's template: neu ist, dass `selfAssessment` eine Übungs-Komponente nennen darf
      (app-templates 2c99933).
- [x] Load the content guide `.agents/skills/app-content/SKILL.md`. Read the plans in `.vibe/plans/`.
- [x] Interview: der Auftrag des Erstellers ist die Antwort (siehe „Answers“); keine neuen Inhalte.
- [x] Load skill `lernapps-content-research`: entfällt, keine neuen Kompetenzen oder Quellen.
- [x] Under "Notes": the didactic approach per competency and the scope (in, out, data range).
- [x] A kind of content the guide does not cover: entfällt (keine neue Seite, Komponente oder Übungsart).
- [x] **Checkpoint:** research. Entfällt: der Ersteller hat schon zugestimmt.
- [x] Set `phase: plan`.

## Plan

### Tasks

### Content method

- Keine neuen Muster. `selfAssessment` je `chapter.yaml` aus vorhandenen Übungen: Fragen, `generated` und die
  Übungs-Komponenten `HoerAufgabe` und `NotenAufgabe` (je zweimal gelistet).

### Completed

- [x] `grep '^phase:'` prints `phase: plan`; else set it.
- [x] Load skill `lernapps-content-growth`: eine einzige Scheibe „Selbsteinschätzung“, keine parallelen Scheiben.
- [x] Write "Content method".
- [x] Each new component or interactive exercise: a sketch. Entfällt: nichts Neues.
- [x] Show the creator, short: entfällt, der Auftrag ist eindeutig.
- [x] **Checkpoint:** confirm the plan. Entfällt: der Ersteller hat schon zugestimmt.
- [x] Set `phase: code`.

## Code

<!--
- Build locally on the branch. Commit after each slice; the hooks check. A check fails → skill `lernapps-cli`. Fix from the message; never
  bypass a hook.
- Undecidable → choose, mark "(guess)", go on.
- Creator asks for a change → first say your reading in one sentence; never narrow it silently.
- Skills: `lernapps-cli`, `lernapps-<archetype>`, `lernapps-content-questions`, the content guide.
-->

### Tasks

- [ ] Load skill `lernapps-cli`. Update the app as it says. Commit the update alone; fix its findings before
      content. The update replaces the `lernapps-*` skills: reread those you use.
- [ ] Load skill `lernapps-<archetype>` and the content guide. Questions with options and feedback: also skill
      `lernapps-content-questions`.
- [ ] <the slices written in Plan; each: competency, content, exercise, the entry's topic, check, commit>
- [ ] After the first slice: show the creator a first look (`early-preview`) and go on.
      Parallel slices: send each sub-agent `@lernapps/tooling/guidance/subagent-brief.md`, filled in.
- [ ] The content guide describes the app as it is now (`app-content-matches`). `grep -c "FILL IN"
      .agents/skills/app-content/SKILL.md` prints 0.
- [ ] `npx lernapps check` passes.
- [ ] Every box of Explore, Plan and Code ticked.
- [ ] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).
      No checkpoint here: set it before you ask or report anything, then start Commit in the same message.

### Completed

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] `git switch -c increment/05-einschaetzung-komponenten` from `main`. Commit this plan on it.

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

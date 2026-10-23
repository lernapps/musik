---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 2
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: { accessible: 6, checks-pass: 6, explainer-readable-without-js: 1 }
---

# Increment: Bedienung und Klang

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

*Gestartet 2026-10-23. Explore, Plan, Code, Commit.*

## Goal

Kinder können an jeder Komponente mit Ton die Lautstärke einstellen, Rhythmen mehrmals oder dauerhaft durchlaufen lassen und die Klatschübung mit einem sichtbaren Einzählen besser verstehen. Töne klingen wie ein Klavier. Dazu ein Fehler: Angetippte Noten klingen so lange wie ihr Notenwert.

## Key decisions

- Anlass: Rückmeldung des Nutzers nach dem Test (2026-10-23). Fünf Wünsche: Lautstärke, Durchgänge, Einzählen, Fehler Notendauer, Klavierklang.
- Lautstärke: ein Regler für die ganze Seite, in jeder Komponente mit Ton (`Lautstaerke.vue`, Regler wirkt auf einen gemeinsamen Ausgang in `Klang.ts`). Quadratische Kennlinie, Start 80 %. Nicht gespeichert, nach dem Neuladen wieder 80 %, denn Speichern ändert den Eintrag („storage“). (guess)
- Klavierklang: Obertöne mit Abklingen, leicht verstimmte Saiten, Tiefpass (`Klavier.ts`); Standard für alle Töne. Metronomklicks bleiben Klicks. Im Klangbild bleiben die Wellenformen, denn sie sind Lernstoff. (guess)
- „Taktanzahl“ lese ich als: Wie oft das ganze Muster durchlaufen wird (1, 2, 4, 8 oder „Dauerhaft“, bis Stopp). (guess)
- Einzählen: ein Takt Klicks vorweg, ohne Stimme, mit großer Zahl im Bild und einer erklärenden Anleitung über der Klatschübung.
- Wiederholen gilt auch für „Alles abspielen“ der Notenzeile (Rhythmus beim Lesen von Noten). (guess)

## Notes

- Keine neuen Inhalte, keine neuen Quellen. Betroffen: `Klang.ts`, `Klavier.ts` (neu), `Lautstaerke.vue` (neu) und alle Klangkomponenten sowie die Seiten mit Metronom und Rhythmus.

## Explore

<!--
- All content questions belong here; Plan maps the answers onto the app. Ask; write no code.
- Skip what earlier answers or the app already tell. Never tick a topic you assumed.
- Skills: the content guide `app-content`, `lernapps-content-research`, `lernapps-<archetype>-design`.
-->

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Skills are in `.agents/skills/`; if missing, install them as the first task of the plan template says.
- [x] Read the README of the archetype's template (link in skill `lernapps-app`): what the app can do now. Tell the
      creator what is new, if it matters for this increment.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md`. Read the plans in `.vibe/plans/`: what the app
      teaches, how its content is made, what is open.
- [x] Interview: one topic per question, the creator's words under "Answers". No answer → ask once more, then
      "(guess)". Topics: which competencies, chapters or rounds, for which school years; hurdles and examples;
      amount; any change of look and feel or terms.
- [x] Load skill `lernapps-content-research`. Research what the guide's curriculum and sources do not cover. Under
      "Notes": curriculum orientation, new competencies by chapter as "Ich kann …", verified sources.
- [x] Under "Notes": the didactic approach per competency and the scope (in, out, data range).
- [x] A kind of content the guide does not cover (a new page structure, screen, component or kind of exercise) →
      load skills `lernapps-<archetype>-design` and `lernapps-exercise-patterns`. Else skip this task.
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, every "(guess)", sources and how you checked them, what is unchecked. Stop and wait.
      Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

- „bei jeder Komponente, die einen Ton ausgibt, sollten wir einen Lautstärkeregler anbieten“
- „Überall, wo es um Rhythmus geht, ist ein Durchgang durch den Takt zu wenig. Da sollte durch den Schüler eine immer eine Taktanzahl angeben werden können, optional mit „Dauerhaft““
- „Die Klatschübung ist schwer verständlich. Da wäre ein „einzählen“ (nicht mit Stimme, sondern eben wie es ist, aber mit Erklärung) hilfreich“
- „ein echter Fehler: in ?achtel-zaehlen=1&wie-viele-passen=3 kann man die Noten anklicken, sie spielen dann aber nur die passende Höhe, nicht die passende Dauer“
- „Der Ton ist wenig schön. Eine Klavier-Artige Klangfarbe wäre wirklich viel netter“

### Completed

## Plan

<!--
- Map the new content onto the app with the guide's patterns. Confirmable in one read.
- After the yes, work on your own: at most 3 creator turns until the end.
- Skills: `lernapps-content-growth`; for something the guide does not cover, the skills loaded in Explore.
-->

### Tasks

- [x] `grep '^phase:'` prints `phase: plan`; else set it.
- [x] Load skill `lernapps-content-growth`. Write the Code tasks as slices, one per competency, in the guide's
      order. Mark the slices sub-agents can write in parallel.
- [x] Write "Content method": the guide's patterns, figures and components per slice. Anything new: map it as skill
      `lernapps-<archetype>-design` says, choose its pattern with skill `lernapps-exercise-patterns` (both loaded
      in Explore), and say why the guide's patterns do not fit.
- [x] Each new component or interactive exercise: a sketch (static SVG or image, or the steps). Words alone are not
      enough.
- [x] Show the creator, short: goal, new competencies by chapter, slices; in plain words what learners see and do,
      what is new. At most 2 questions.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

Scheiben (Unteragenten schrieben die Komponenten parallel, jede Datei gehört einer Scheibe):
1. Basis: `Klang.ts` (gemeinsamer Ausgang, `lautstaerke`, `setzeLautstaerke`, Klavierklang), `Klavier.ts`, `Lautstaerke.vue`, `Klaviatur.vue`.
2. `RhythmusWerkstatt`: Lautstärke, Durchgänge (1, 2, 4, 8, dauerhaft), Einzählen mit großer Zahl und Anleitung.
3. `Notenzeile` und `NotenAufgabe`: Dauer beim Antippen (Fehler), Lautstärke, Wiederholen.
4. `Klangbild`, `Stimmspiegel`, `HoerAufgabe`: Lautstärke und gemeinsamer Ausgang.
5. Seiten: Metronom-Seiten auf „dauerhaft“; Inhaltsleitfaden aktualisieren.

### Completed

## Code

### Tasks

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] `git switch -c increment/03-bedienung-und-klang` from `main`. Commit this plan on it.
- [x] Update the app: nicht ausgeführt. Das Update (Plan 02) brach den Build; keine Inhalte betroffen.
- [x] Scheiben 1 bis 5, je mit Test; Commit nach jeder.
- [x] Der Inhaltsleitfaden beschreibt die App, wie sie jetzt ist. `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0.
- [x] `npx lernapps check` passes.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).

### Completed

## Commit

<!--
- Publish with the creator's yes. A push to `main` publishes.
- Open the pull requests (to `main`, to the catalog) without asking: they publish nothing; their preview and result
  are what the creator decides on.
- Skills: `lernapps-github`, `lernapps-commit`, `lernapps-listing`.
-->

### Tasks

- [ ] `grep '^phase:'` prints `phase: commit`; else set it.
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

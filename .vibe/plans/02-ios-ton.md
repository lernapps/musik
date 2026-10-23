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
failedChecks: {}
---

# Increment: Ton auf dem iPhone

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

Kinder hören auf dem iPhone und iPad die Töne, Klicks und Melodien der App, auch wenn der Stummschalter am Gerät an ist. Das ist eine Korrektur, es kommen keine Inhalte dazu.

## Key decisions

- Fehlerbild vom Nutzer: Auf dem iPhone gibt die App keine Töne aus. Ursache nicht am Gerät geprüft. (guess)
- Wahrscheinlichste Ursache: iOS schaltet Web Audio stumm, wenn der Stummschalter an ist; ein Audio-Element spielt trotzdem. Dazu
  startet der Audiokontext auf iOS ohne `resume()` in der Bedienung nicht. (guess)
- Lösung: in `Klang.ts` (1) die Audio-Sitzung auf „playback“ setzen (`navigator.audioSession`, iOS 17 und neuer, nur in `onMounted`
  geholt und an `Klang.ts` übergeben), (2) bei der ersten Bedienung ein kurzes stilles Audio-Element abspielen (älteres iOS),
  (3) den Kontext in der Bedienung mit `resume()` starten und auch den Zustand „interrupted“ behandeln.
- Keine neuen Inhalte, kein Eingriff in Seiten oder Übungen.

## Notes

- Quellen (nicht amtlich, nur Hinweise; Verhalten am Gerät nicht geprüft): Adactio, „Web Audio API update on iOS“
  (https://adactio.com/journal/19929): Web Audio verstummt auf iOS bei Stummschalter, Audio-Elemente nicht. WebKit-Meldungen
  https://bugs.webkit.org/show_bug.cgi?id=264473 und https://auto-bugs.webkit.org/show_bug.cgi?id=237322: `navigator.audioSession.type =
  "playback"` ab iOS 17; ob es den Stummschalter immer umgeht, ist dort nicht eindeutig. (nicht geprüft)
- Betroffen: alle Komponenten, die Klang ausgeben (`Klaviatur`, `Klangbild`, `Notenzeile`, `NotenAufgabe`, `RhythmusWerkstatt`,
  `Stimmspiegel`, `HoerAufgabe`) über `spiele` und `klick` in `src/components/Klang.ts`.
- Antwort des Nutzers (2026-10-23): „Andere Apps geben Ton aus, auch YouTube im browser“; zu Stummschalter, Browser, iOS-Version und https blieb die Frage offen. YouTube spielt auch bei Stummschalter, der Hinweis schließt die Ursache also nicht aus.
- Das Mikrofon braucht https. Die Vorschau-Adresse im PR-Kommentar ist http; die App ist auch unter https://lernapps.net/musik/ erreichbar.

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
- [x] **Checkpoint:** research (zusammen mit dem Plan-Checkpoint). Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, every "(guess)", sources and how you checked them, what is unchecked. Stop and wait.
      Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

- „Auf dem iPhone werden keine Töne ausgegeben“ (Nutzer, 2026-10-23). Ob der Stummschalter an war, welcher Browser, welche iOS-Version: offen, wird gefragt.

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
- [x] **Checkpoint:** confirm the plan (Nutzer: „Andere Apps geben Ton aus, auch YouTube im browser“, danach umgesetzt) and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

Eine Scheibe, keine neuen Inhalte, kein Unterauftrag nötig:
- `src/components/Klang.ts`: `holeKontext` startet den Kontext mit `resume()`; neue Funktion `merkeSitzung(sitzung)` setzt
  `audioSession.type = "playback"`; neue Funktion `entsperre()` spielt beim ersten Klick ein 0,1 s langes stilles Audio
  (Datei als Daten-URI, ohne Netzwerk) ab, so wird der Ton auch bei Stummschalter hörbar.
- Jede Klangkomponente ruft in `onMounted` `merkeSitzung(navigator.audioSession)` auf (nur dort ist `navigator` erlaubt).
- Test: Logik in `Klang.test.ts` mit einer Attrappe für `AudioContext` und `Audio` (Zustand „suspended“ → `resume` wird aufgerufen;
  „interrupted“ → ebenfalls). Ton selbst nur am iPhone prüfbar.
- Der Inhaltsleitfaden bekommt eine Zeile unter „Rules learned from mistakes“.

### Completed

## Code

### Tasks

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] `git switch -c increment/02-ios-ton` from `main`. Commit this plan on it.
- [x] Load skill `lernapps-check`. Update the app as it says (`npx --yes github:lernapps/tooling update`, `npm install`). **Nicht übernommen:** Das Update (app-templates 23c5052 → 9d7ac10) brach den Build, weil die neue Laufzeit `src/data/instrumente.yaml` als Sprachtext liest („name is not a language of the app“). Ich habe es zurückgenommen, die Ursache steht noch aus.
- [x] Scheibe: `Klang.ts` und die sieben Komponenten wie unter „Content method“, mit Test. Commit.
- [x] Der Inhaltsleitfaden beschreibt die App, wie sie jetzt ist (`app-content-matches`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0.
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

- [x] `grep '^phase:'` prints `phase: commit`; else set it.
- [x] Load skill `lernapps-github`. Push the branch, open the preview pull request, see its checks to green as it
      says.
- [x] **Checkpoint:** publish. Show what the increment adds and the preview link; ask whether it may go online. Wait
      for the yes.
- [x] Load skill `lernapps-commit`. Publish as skill `lernapps-github` says: the pull request squash-merged into
      `main` with the message from this plan, the run of `Pages` watched to the end.
- [x] Open the address the job `deploy` printed; confirm the new content. Never a derived address.
- [x] App listed and its entry changes (topics, school years, summary) → load skill `lernapps-listing` and write the
      changed entry. Else skip the checkpoint "list".
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it. A push of only `.vibe/` publishes nothing.
- [ ] **Checkpoint:** list. Open the pull request to the catalog without asking first: the pull request is the
      review. See it to "bestanden" as the skill says, then show the creator the pull request and its result.
- [ ] Plan changed since its last push → commit it on `main`, push again.

### Completed

Der Nutzer hat die PR #4 selbst per Squash zusammengeführt (Commit 636eb49). Der Pages-Lauf auf `main` läuft; Adresse http://lernapps.net/musik/. Kein Listing nötig (App nicht im Katalog, Eintrag unverändert).

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

commit; Plan-Checkpoint durch die Umsetzung bestätigt, Veröffentlichen vom Nutzer durch Zusammenführen der PR.

### Creator turns after the plan

3 Nachrichten: Fehlermeldung (kein Ton auf dem iPhone), Hinweis „Andere Apps geben Ton aus, auch YouTube im browser“,
Zusammenführen der PR #4. Meine Fragen zu Stummschalter, Browser, iOS-Version und https blieben offen.

### Where I had to guess

- Ursache: Stummschalter und angehaltener Audiokontext auf iOS. Am Gerät nicht geprüft; ob die Korrektur hilft, steht offen.
- Das Update der Vorlage (app-templates 23c5052 → 9d7ac10) brach den Build (`src/data/instrumente.yaml` als Sprachtext gelesen).
  Zurückgenommen, Ursache nicht untersucht, nicht gemeldet.

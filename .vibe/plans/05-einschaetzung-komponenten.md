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
  Der Auftrag an mich endet beim Vorschau-Pull-Request; zusammenführen ist nicht meine Aufgabe.
- Neu abgefragt: `laut-leise` (Ordnen, Bedeutung von f), `grundschlag-takt` (`hoer-takt` zweimal), `benennen`
  (`noten-alle` zweimal), `dur-moll` (`hoer-dur-moll` zweimal). `hoch-tief` jetzt mit `hoer-hoeher`, `linien` mit
  `noten-linien`, `intervalle` mit `hoer-intervall` statt der ratbaren Fragen.
- Nicht abgefragt: `stimme`, `nachsingen` (Singen), `lesen` (nur eine Frage ohne die Melodie der Seite, und die liest
  keine Noten), Kapitel `erfinden` (Machen; der Tutor geht es Seite für Seite durch).
- Je Kapitel 4 bis 6 Aufgaben, zusammen 26: mehr als die alte Richtzahl 15–20, weil Abdeckung vorgeht (Ersteller).

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

### Tasks

### Completed

- [x] `grep '^phase:'` prints `phase: code`; else set it.
- [x] `git switch -c increment/05-einschaetzung-komponenten` from `main`. Commit this plan on it.
- [x] Load skill `lernapps-cli`. Update the app as it says. Commit the update alone; fix its findings before
      content. (app-templates 2c99933, tooling a62ad03; `lernapps check` ohne Befund. Ersetzt wurde nur der Skill
      `lernapps-explainer-self-assessment`, neu gelesen.)
- [x] Load skill `lernapps-explainer` and the content guide. Keine neuen Fragen: `lernapps-content-questions` entfällt.
- [x] Scheibe: das Update ist der Code; die Selbsteinschätzung selbst kommt in Commit (Skill).
- [x] After the first slice: show the creator a first look. Entfällt: keine neue Seite.
- [x] The content guide describes the app as it is now (`app-content-matches`); 0 × „FILL IN“.
- [x] `npx lernapps check` passes.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`.

## Commit

<!--
- Publish with the creator's yes. A push to `main` publishes.
- Open the pull requests (to `main`, to the catalog) without asking: they publish nothing; their preview and result
  are what the creator decides on.
- Skills: `lernapps-explainer-self-assessment` (an explainer), `lernapps-github`, `lernapps-commit`,
  `lernapps-listing`.
-->

### Tasks

### Completed

- [x] `grep '^phase:'` prints `phase: commit`; else set it.
- [x] Skill `lernapps-explainer-self-assessment` neu geladen. `selfAssessment` in fünf Kapiteln neu: 26 Aufgaben,
      13 von 19 Seiten, je Seite 2; Hör- und Noten-Aufgaben dabei. Build, `lernapps check` und Ende-zu-Ende-Tests
      grün; selbst durchlaufen (Playwright, gebaute App): `/einschaetzung/` und `/<kapitel>/einschaetzung/?via=tutor`.
      Jede Komponente ist geladen und zeigt ihre ganze Aufgabe; Töne erst nach einem Klick; richtige Antworten zählen
      richtig, falsche erscheinen bei „Zurück zum Tutor“ mit Eingabe und, wenn typisch, mit F1 oder F3.
- [x] Load skill `lernapps-github`. Pull Request #9, alle Prüfungen grün.
- [x] **Checkpoint:** publish. Der Ersteller hatte vorab „bei grüner CI mergen“ gesagt.
- [x] Load skill `lernapps-commit`. Squash-merged (7f5339e), der Lauf von `Pages` erfolgreich.
- [x] Open the address the job `deploy` printed; confirm the new content. <https://lernapps.net/musik/einschaetzung/>
      zeigt 26 Aufgaben und 6 nicht abgefragte Seiten.
- [x] Fix nach dem Merge (Pull Request #10): lernapps/app-templates#105, eine geleerte Antwort einer Komponente zählt
      als offen, eigene ids je Komponente; @lernapps/app-templates 9affe7b, @lernapps/tooling b4d606c. Online geprüft.
- [x] App listed and its entry changes → der Eintrag in lernapps/apps bekommt den neuen Commit und `storage: device`
      (das letzte Ergebnis der Selbsteinschätzung bleibt auf dem Gerät).
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it.

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

commit; veröffentlicht. Die Checkpoints entfielen, weil der Ersteller alles vorab freigegeben hatte.

### Creator turns after the plan

0.

### Where I had to guess

- Lesen, Stimme, Nachsingen und das Kapitel Erfinden bleiben ohne Abfrage (Singen, Machen, keine Übung ohne die
  Melodie der Seite).
- Die Abdeckung geht vor der alten Grenze von 15 bis 20 Aufgaben: 26 für die ganze App.
- Zwei Laufzeitfehler der Komponenten in der Selbsteinschätzung fand die Mathe-Karte; behoben in
  lernapps/app-templates#105, hier mit Pull Request #10 übernommen.

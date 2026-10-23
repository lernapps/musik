# Notenwerte und Pausen – Tutor-Datei

> Ganze, Halbe, Viertel und Achtel unterscheiden, ihre Dauer vergleichen und Pausen kennen.

App: Musik erleben. Seite: [Notenwerte und Pausen](./)

Diese Datei ist für einen KI-Tutor. Sie enthält die Lösungen: Nutze sie, um anzuleiten und Fehler zu erkennen, nicht um vorzusagen. Die Regeln stehen in llms.txt. Kannst du eine Datei der App nicht abrufen, bitte die lernende Person, den Text der Seite oder diese Datei einzufügen oder anzuhängen.

## Abschnitte

- [Ausprobieren](./#ausprobieren)
- [Das Wichtigste](./#merke)
- [Übung](./#uebung)

## Übungen

### werte-ordnen (ordering)

- Link: [./#werte-ordnen](./#werte-ordnen), im Abschnitt „Übung“
- Aufgabe: Bringe die Notenwerte in die Reihenfolge von lang nach kurz. Den längsten zuerst.
- Antwortformat: die Einträge in die richtige Reihenfolge bringen (die App zeigt sie gemischt)
- Lösung: 1. Ganze, 2. Halbe, 3. Viertel, 4. Achtel
- Erklärung: Eine Ganze dauert 8 Achtel, eine Halbe 4, eine Viertel 2 und eine Achtel 1.

### achtel-zaehlen (generated, number)

- Link: [./#achtel-zaehlen](./#achtel-zaehlen), im Abschnitt „Übung“
- Antwortformat: eine Zahl eintippen
- Tipp, den die App zeigt (Vorlage: {{…}} sind die Werte der Aufgabe): Eine Viertel dauert zwei Achtel. Jeder längere Notenwert ist doppelt so lang wie der kürzere.
- Lösungsweg (Vorlage: {{…}} sind die Werte der Aufgabe):
  - Eine Achtel zählt 1. Jeder nächste Notenwert ist doppelt so lang.
  - Eine {{n.name}} dauert {{answer}} Achtel.
- Aufgaben nach Nummer, 1 bis 4: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?achtel-zaehlen=1#achtel-zaehlen): Wie viele Achtel dauert eine Achtel? → Lösung: 1
    - ✗ 0,5: Du hast in Vierteln gezählt. Eine Viertel dauert zwei Achtel.
  - [Aufgabe Nr. 2](./?achtel-zaehlen=2#achtel-zaehlen): Wie viele Achtel dauert eine Viertel? → Lösung: 2
    - ✗ 1: Du hast in Vierteln gezählt. Eine Viertel dauert zwei Achtel.
  - [Aufgabe Nr. 3](./?achtel-zaehlen=3#achtel-zaehlen): Wie viele Achtel dauert eine Ganze? → Lösung: 8
    - ✗ 4: Du hast in Vierteln gezählt. Eine Viertel dauert zwei Achtel.
  - [Aufgabe Nr. 4](./?achtel-zaehlen=4#achtel-zaehlen): Wie viele Achtel dauert eine Halbe? → Lösung: 4
    - ✗ 2: Du hast in Vierteln gezählt. Eine Viertel dauert zwei Achtel.

### wie-viele-passen (generated, number)

- Link: [./#wie-viele-passen](./#wie-viele-passen), im Abschnitt „Übung“
- Antwortformat: eine Zahl eintippen
- Tipp, den die App zeigt (Vorlage: {{…}} sind die Werte der Aufgabe): Rechne beide Notenwerte in Achtel um und teile.
- Lösungsweg (Vorlage: {{…}} sind die Werte der Aufgabe):
  - {{a.name}} = {{a.achtel}} Achtel, {{b.name}} = {{b.achtel}} Achtel.
  - {{a.achtel}} geteilt durch {{b.achtel}} ergibt {{answer}}.
- Aufgaben nach Nummer, 1 bis 5: jede eine andere (die App zeigt „Aufgabe Nr. …“):
  - [Aufgabe Nr. 1](./?wie-viele-passen=1#wie-viele-passen): Wie oft passt eine Achtel in eine Ganze? → Lösung: 8
    - ✗ 7: Du hast gerechnet statt geteilt. Teile die Dauer der langen Note durch die Dauer der kurzen.
  - [Aufgabe Nr. 2](./?wie-viele-passen=2#wie-viele-passen): Wie oft passt eine Halbe in eine Ganze? → Lösung: 2
    - ✗ 4: Du hast gerechnet statt geteilt. Teile die Dauer der langen Note durch die Dauer der kurzen.
  - [Aufgabe Nr. 3](./?wie-viele-passen=3#wie-viele-passen): Wie oft passt eine Achtel in eine Viertel? → Lösung: 2
    - ✗ 1: Du hast gerechnet statt geteilt. Teile die Dauer der langen Note durch die Dauer der kurzen.
  - [Aufgabe Nr. 4](./?wie-viele-passen=4#wie-viele-passen): Wie oft passt eine Achtel in eine Halbe? → Lösung: 4
    - ✗ 3: Du hast gerechnet statt geteilt. Teile die Dauer der langen Note durch die Dauer der kurzen.
  - [Aufgabe Nr. 5](./?wie-viele-passen=5#wie-viele-passen): Wie oft passt eine Viertel in eine Ganze? → Lösung: 4
    - ✗ 6: Du hast gerechnet statt geteilt. Teile die Dauer der langen Note durch die Dauer der kurzen.

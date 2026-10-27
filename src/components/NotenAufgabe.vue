<script setup lang="ts">
// Die Übung „Note benennen“ der Nummer seed: eine Note im Violinschlüssel und die Knöpfe C bis H. Sie ist nur die
// Eingabe der Aufgabe: Sie meldet den gewählten Namen mit answer; der Explainer zeichnet „Prüfen“, prüft mit
// NotenAufgabe.ts und gibt die Rückmeldung. Nach dem Prüfen markiert sie die Wahl und spielt auf Klick den Ton.
import { computed, onMounted, ref } from "vue";
import { frequenz, nameMitOktave } from "./Musik.ts";
import { spiele, merkeSitzung } from "./Klang.ts";
import Lautstaerke from "./Lautstaerke.vue";
import Notenzeile from "./Notenzeile.vue";
import { NAMEN, bildText, check, generate, hoerDauer, solution } from "./NotenAufgabe.ts";

const props = defineProps<{
  /** Samen der Aufgabe; die Seite vergibt ihn. */
  seed: number;
  /** Welche Noten vorkommen: nur auf Linien, nur in Zwischenräumen oder alle (c¹ bis a²). */
  bereich?: "linien" | "zwischenraeume" | "alle";
  /** Ob der Explainer die jetzige Antwort geprüft hat. */
  checked?: boolean;
}>();

const emit = defineEmits<{ answer: [antwort: string | undefined] }>();

// „Neue Aufgabe“ baut die Komponente mit einer anderen Nummer neu auf
const aufgabe = computed(() => generate(props.seed, { bereich: props.bereich }));
const noten = computed(() => [{ ton: aufgabe.value.ton, wert: aufgabe.value.wert }]);
const gewaehlt = ref<string | undefined>(undefined);
const geprueft = computed(() => props.checked === true && gewaehlt.value !== undefined);
const richtig = computed(() => geprueft.value && check(aufgabe.value, gewaehlt.value));

function waehle(antwort: string): void {
  gewaehlt.value = antwort;
  emit("answer", antwort);
}

function hoeren(): void {
  spiele([{ hz: frequenz(aufgabe.value.ton), start: 0, dauer: hoerDauer(aufgabe.value) }]);
}
// iPhone: Die Audio-Sitzung auf Wiedergabe stellen, damit der Stummschalter die Töne nicht verstummen lässt.
onMounted(() => {
  merkeSitzung((navigator as Navigator & { audioSession?: { type: string } }).audioSession);
});
</script>

<template>
  <div class="noten-aufgabe">
    <div role="img" :aria-label="bildText(aufgabe)" class="bild">
      <Notenzeile :noten="noten" :abspielbar="false" :namen="false" :antippbar="false" />
    </div>
    <p class="frage">Wie heißt der Ton?</p>
    <div class="knoepfe" role="group" aria-label="Notenname wählen">
      <button
        v-for="n in NAMEN"
        :key="n"
        type="button"
        class="name"
        :class="{
          gewaehlt: gewaehlt === n && !geprueft,
          gut: richtig && gewaehlt === n,
          schlecht: geprueft && !richtig && gewaehlt === n,
        }"
        :aria-pressed="gewaehlt === n"
        @click="waehle(n)"
      >
        {{ n }}
        <span v-if="richtig && gewaehlt === n" aria-hidden="true">✓</span>
        <span v-else-if="geprueft && gewaehlt === n" aria-hidden="true">✗</span>
      </button>
    </div>
    <p v-if="richtig" class="rueckmeldung">
      Die Note heißt {{ solution(aufgabe) }}, genauer {{ nameMitOktave(aufgabe.ton) }}.
    </p>
    <div v-if="geprueft">
      <button type="button" class="hoeren" @click="hoeren">▶ Ton hören</button>
      <Lautstaerke />
    </div>
  </div>
</template>

<style scoped>
.noten-aufgabe {
  max-width: 100%;
  color: var(--page-text);
}
.frage {
  margin: 0.5rem 0;
  font-weight: 600;
}
.knoepfe {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.name,
.hoeren {
  font: inherit;
  min-width: 44px;
  min-height: 44px;
  padding: 0.4rem 0.8rem;
  border: 2px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
  cursor: pointer;
}
.name {
  font-weight: 700;
  font-size: 1.1em;
}
.name:focus-visible,
.hoeren:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}
.gewaehlt {
  border-color: var(--page-accent);
  background: var(--page-accent);
  color: var(--page-on-accent);
}
.gut {
  border-color: var(--page-right);
  background: var(--page-right-background, var(--page-surface));
  color: var(--page-text);
}
.schlecht {
  border-color: var(--page-wrong);
  border-style: dashed;
  background: var(--page-wrong-background, var(--page-surface));
  color: var(--page-text);
}
.rueckmeldung {
  margin: 0.5rem 0;
  min-height: 1.5em;
}
.hoeren {
  margin-top: 0.25rem;
}
</style>

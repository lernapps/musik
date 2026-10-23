<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { frequenz, nameMitOktave } from "./Musik.ts";
import { spiele, merkeSitzung } from "./Klang.ts";
import Notenzeile from "./Notenzeile.vue";
import { NAMEN, bildText, check, generate, reason, solution } from "./NotenAufgabe.ts";

const props = defineProps<{
  /** Samen der Aufgabe; die Seite vergibt ihn. */
  seed: number;
  /** Welche Noten vorkommen: nur auf Linien, nur in Zwischenräumen oder alle (c¹ bis a²). */
  bereich?: "linien" | "zwischenraeume" | "alle";
}>();

const emit = defineEmits<{ answered: [result: { correct: boolean; reason: string }] }>();

const aufgabe = computed(() => generate(props.seed, { bereich: props.bereich }));
const noten = computed(() => [{ ton: aufgabe.value.ton, wert: aufgabe.value.wert }]);
const gewaehlt = ref<string | undefined>(undefined);
const richtig = ref(false);

watch(
  () => props.seed,
  () => {
    gewaehlt.value = undefined;
    richtig.value = false;
  },
);

function antworte(antwort: string): void {
  if (gewaehlt.value !== undefined) return;
  gewaehlt.value = antwort;
  richtig.value = check(aufgabe.value, antwort);
  emit("answered", { correct: richtig.value, reason: reason(aufgabe.value, antwort) });
}

const rueckmeldung = computed(() => {
  if (gewaehlt.value === undefined) return "";
  const lösung = `${solution(aufgabe.value)} (${nameMitOktave(aufgabe.value.ton)})`;
  return richtig.value ? `Richtig: ${lösung}.` : `Nicht ganz. Die Note heißt ${lösung}.`;
});

function hoeren(): void {
  spiele([{ hz: frequenz(aufgabe.value.ton), start: 0, dauer: 0.9 }]);
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
          gewaehlt: gewaehlt === n,
          gut: gewaehlt !== undefined && n === solution(aufgabe),
          schlecht: gewaehlt === n && !richtig,
        }"
        :disabled="gewaehlt !== undefined"
        :aria-pressed="gewaehlt === n"
        @click="antworte(n)"
      >
        {{ n }}
        <span v-if="gewaehlt !== undefined && n === solution(aufgabe)" aria-hidden="true">✓</span>
        <span v-else-if="gewaehlt === n" aria-hidden="true">✗</span>
      </button>
    </div>
    <p class="rueckmeldung" aria-live="polite">{{ rueckmeldung }}</p>
    <button v-if="gewaehlt !== undefined" type="button" class="hoeren" @click="hoeren">▶ Ton hören</button>
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
.name:disabled {
  cursor: default;
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

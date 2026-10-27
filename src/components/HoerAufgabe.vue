<script setup lang="ts">
// Die Hör-Aufgabe der Nummer seed: Töne oder Klicks zum Anhören (nur nach einem Klick) und die Antwortknöpfe. Sie ist
// nur die Eingabe der Aufgabe: Sie meldet die gewählte Antwort mit answer; der Explainer zeichnet „Prüfen“, prüft mit
// HoerAufgabe.ts und gibt die Rückmeldung. Nach einer richtig geprüften Antwort zeigt sie die Erklärung mit den Tönen.
import { computed, onMounted, ref } from "vue";
import { klick, spiele, merkeSitzung } from "./Klang.ts";
import Lautstaerke from "./Lautstaerke.vue";
import { check, erklaerung, frage, generate, klicks, tonText, wiedergabe, type Art } from "./HoerAufgabe.ts";

const props = withDefaults(
  defineProps<{
    /** Aufgabennummer; vergibt der Explainer. */
    seed: number;
    /** Art der Aufgabe. */
    art?: "hoeher" | "lauter" | "intervall" | "dur-moll" | "takt";
    /** Ob der Explainer die jetzige Antwort geprüft hat. */
    checked?: boolean;
  }>(),
  { art: "hoeher", checked: false },
);

const emit = defineEmits<{ answer: [antwort: string | undefined] }>();

// „Neue Aufgabe“ baut die Komponente mit einer anderen Nummer neu auf
const aufgabe = computed(() => generate(props.seed, props));
const gewaehlt = ref<string | undefined>(undefined);
const textZeigen = ref(false);

const zweiTone = computed(() => (["hoeher", "lauter", "intervall"] as Art[]).includes(aufgabe.value.art));
const text = computed(() => tonText(aufgabe.value));
const geloest = computed(() => props.checked && check(aufgabe.value, gewaehlt.value));

function abspielen(welche: "1" | "2" | "alle"): void {
  if (aufgabe.value.art === "takt") {
    for (const k of klicks(aufgabe.value)) klick(k.start, k.betont);
    return;
  }
  spiele(wiedergabe(aufgabe.value, welche));
}

function waehle(antwort: string): void {
  gewaehlt.value = antwort;
  emit("answer", antwort);
}
// iPhone: Die Audio-Sitzung auf Wiedergabe stellen, damit der Stummschalter die Töne nicht verstummen lässt.
onMounted(() => {
  merkeSitzung((navigator as Navigator & { audioSession?: { type: string } }).audioSession);
});
</script>

<template>
  <div class="hoer">
    <p class="frage">{{ frage(aufgabe.art) }}</p>
    <div class="knoepfe" role="group" aria-label="Töne anhören">
      <template v-if="zweiTone">
        <button type="button" @click="abspielen('1')">▶ Ton 1</button>
        <button type="button" @click="abspielen('2')">▶ Ton 2</button>
        <button v-if="aufgabe.art === 'intervall'" type="button" @click="abspielen('alle')">▶ Beide</button>
      </template>
      <button v-else type="button" @click="abspielen('alle')">▶ Anhören</button>
    </div>
    <Lautstaerke />
    <div class="knoepfe" role="group" aria-label="Antworten">
      <button
        v-for="option in aufgabe.optionen"
        :key="option"
        type="button"
        class="antwort"
        :class="{ gewaehlt: gewaehlt === option }"
        :aria-pressed="gewaehlt === option"
        @click="waehle(option)"
      >
        {{ gewaehlt === option ? "● " : "" }}{{ option }}
      </button>
    </div>
    <div class="knoepfe">
      <button type="button" :aria-expanded="textZeigen" @click="textZeigen = !textZeigen">
        {{ textZeigen ? "Text ausblenden" : "Töne als Text zeigen" }}
      </button>
    </div>
    <p v-if="textZeigen" class="text">
      {{ text }} Hinweis: Wenn du die Töne liest, zählt das nicht mehr als Hörtest. Zum Üben hilft es trotzdem.
    </p>
    <p v-if="geloest" class="erklaerung">{{ erklaerung(aufgabe) }}</p>
  </div>
</template>

<style scoped>
.hoer {
  max-width: 100%;
  color: var(--page-text);
}
.frage {
  margin: 0 0 0.5rem;
  font-weight: 600;
}
.knoepfe {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
}
button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.4rem 0.9rem;
  border: 2px solid var(--page-border);
  border-radius: 8px;
  background: var(--page-surface);
  color: var(--page-text);
  font: inherit;
  cursor: pointer;
}
button:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}
.antwort.gewaehlt {
  border-color: var(--page-accent);
  background: var(--page-accent);
  color: var(--page-on-accent);
  opacity: 1;
}
.text,
.erklaerung {
  margin: 0 0 0.5rem;
  overflow-wrap: anywhere;
}
.text {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-muted);
}
</style>

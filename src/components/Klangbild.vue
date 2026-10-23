<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { naechsterTon } from "./Analyse.ts";
import { ausgang, holeKontext, merkeSitzung } from "./Klang.ts";
import Lautstaerke from "./Lautstaerke.vue";
import { nameMitOktave } from "./Musik.ts";
import {
  FORMEN,
  beschreibung,
  gainVon,
  hzZuSlider,
  lautWort,
  perioden,
  sliderZuHz,
  tonText,
  welle,
  type Form,
} from "./Klangbild.ts";

const props = withDefaults(
  defineProps<{
    /** Welche Regler sichtbar sind; die anderen bleiben auf festen Werten. */
    regler?: "alle" | "lautstaerke" | "tonhoehe" | "klangfarbe";
    /** Startfrequenz in Hz (130 bis 1050). */
    hz?: number;
    /** Startform der Welle. */
    form?: "sine" | "triangle" | "square" | "sawtooth";
    /** Startlautstärke in Prozent (0 bis 100). */
    laut?: number;
  }>(),
  { regler: "alle", hz: 262, form: "sine", laut: 30 },
);

const pos = ref(hzZuSlider(props.hz));
const lautProzent = ref(Math.min(Math.max(props.laut, 0), 100));
const aktuelleForm = ref<Form>(props.form);
const an = ref(false);

const zeigeTon = computed(() => props.regler === "alle" || props.regler === "tonhoehe");
const zeigeLaut = computed(() => props.regler === "alle" || props.regler === "lautstaerke");
const zeigeForm = computed(() => props.regler === "alle" || props.regler === "klangfarbe");

const aktuellHz = computed(() => sliderZuHz(pos.value));
const hzText = computed(() => String(Math.round(aktuellHz.value)));
const tonname = computed(() => {
  const ton = naechsterTon(aktuellHz.value).ton;
  return tonText(ton, nameMitOktave(ton));
});
const wort = computed(() => lautWort(lautProzent.value));
const bildText = computed(() => beschreibung(aktuellHz.value, lautProzent.value, aktuelleForm.value));
const text = computed(() => `${bildText.value} · Ton ${tonname.value}, ${Math.round(lautProzent.value)} %`);

const BREITE = 600;
const HOEHE = 128;
const pfad = computed(() => {
  const ys = welle(aktuelleForm.value, perioden(aktuellHz.value), lautProzent.value / 100, 600);
  return ys
    .map((y, i) => {
      const px = ((i / (ys.length - 1)) * BREITE).toFixed(1);
      const py = (HOEHE / 2 - y * (HOEHE / 2 - 8)).toFixed(1);
      return `${i === 0 ? "M" : "L"}${px} ${py}`;
    })
    .join(" ");
});

// Eigener Oszillator; der gemeinsame AudioContext aus Klang.ts entsteht erst nach dem Klick.
let ctx: AudioContext | undefined;
let osc: OscillatorNode | undefined;
let huelle: GainNode | undefined;

function uebernehme(): void {
  if (!ctx || !osc || !huelle) return;
  const t = ctx.currentTime;
  osc.type = aktuelleForm.value;
  osc.frequency.setTargetAtTime(aktuellHz.value, t, 0.02);
  huelle.gain.setTargetAtTime(gainVon(lautProzent.value), t, 0.03);
}

function starten(): void {
  ctx = holeKontext();
  osc = ctx.createOscillator();
  huelle = ctx.createGain();
  osc.type = aktuelleForm.value;
  osc.frequency.value = aktuellHz.value;
  const t = ctx.currentTime;
  huelle.gain.setValueAtTime(0, t);
  huelle.gain.linearRampToValueAtTime(gainVon(lautProzent.value), t + 0.05);
  osc.connect(huelle).connect(ausgang());
  osc.start();
  an.value = true;
}

function stoppen(): void {
  an.value = false;
  if (ctx && osc && huelle) {
    const t = ctx.currentTime;
    const alt = osc;
    huelle.gain.cancelScheduledValues(t);
    huelle.gain.setValueAtTime(huelle.gain.value, t);
    huelle.gain.linearRampToValueAtTime(0, t + 0.06);
    alt.stop(t + 0.08);
  }
  osc = undefined;
  huelle = undefined;
}

function umschalten(): void {
  if (an.value) stoppen();
  else starten();
}

function setzeTon(e: Event): void {
  pos.value = Number((e.target as HTMLInputElement).value) / 100;
  uebernehme();
}
function setzeLaut(e: Event): void {
  lautProzent.value = Number((e.target as HTMLInputElement).value);
  uebernehme();
}
function waehleForm(f: Form): void {
  aktuelleForm.value = f;
  uebernehme();
}

onBeforeUnmount(() => {
  stoppen();
  ctx = undefined;
});
// iPhone: Die Audio-Sitzung auf Wiedergabe stellen, damit der Stummschalter die Töne nicht verstummen lässt.
onMounted(() => {
  merkeSitzung((navigator as Navigator & { audioSession?: { type: string } }).audioSession);
});
</script>

<template>
  <div class="klangbild">
    <svg class="bild" role="img" :aria-label="bildText" :viewBox="`0 0 ${BREITE} ${HOEHE}`" preserveAspectRatio="none">
      <line x1="0" :y1="HOEHE / 2" :x2="BREITE" :y2="HOEHE / 2" class="achse" />
      <path :d="pfad" class="welle" fill="none" />
    </svg>
    <p class="ansage" aria-live="polite">{{ text }}</p>

    <div v-if="zeigeTon" class="regler">
      <label for="kb-ton">Tonhöhe</label>
      <input id="kb-ton" type="range" min="0" max="100" step="1" :value="Math.round(pos * 100)" @input="setzeTon" />
      <span class="wert">{{ hzText }} Hz ({{ tonname }})</span>
    </div>
    <div v-if="zeigeLaut" class="regler">
      <label for="kb-laut">Lautstärke</label>
      <input id="kb-laut" type="range" min="0" max="100" step="1" :value="lautProzent" @input="setzeLaut" />
      <span class="wert">{{ wort }}, {{ Math.round(lautProzent) }} %</span>
    </div>

    <div v-if="zeigeForm" class="formen" role="group" aria-label="Klangfarbe">
      <button
        v-for="f in FORMEN"
        :key="f.form"
        type="button"
        :aria-pressed="aktuelleForm === f.form"
        :class="{ gewaehlt: aktuelleForm === f.form }"
        @click="waehleForm(f.form)"
      >
        {{ aktuelleForm === f.form ? "✓ " : "" }}{{ f.name }}
      </button>
    </div>

    <!-- Der Regler für die Lautstärke des Tons ist zugleich der einzige Lautstärkeregler: zwei Regler wären verwirrend. -->
    <Lautstaerke v-if="!zeigeLaut" />

    <button type="button" class="ton" :aria-pressed="an" @click="umschalten">
      {{ an ? "■ Ton aus" : "▶ Ton an" }}
    </button>
  </div>
</template>

<style scoped>
.klangbild {
  max-width: 100%;
}
.bild {
  display: block;
  width: 100%;
  height: 8rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
}
.achse {
  stroke: var(--page-muted);
  stroke-width: 1;
  stroke-dasharray: 4 4;
  vector-effect: non-scaling-stroke;
}
.welle {
  stroke: var(--page-accent);
  stroke-width: 3;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
.ansage {
  margin: 0.5rem 0;
  min-height: 1.5em;
}
.regler {
  display: grid;
  grid-template-columns: 7rem 1fr;
  align-items: center;
  gap: 0.25rem 0.75rem;
  margin: 0.5rem 0;
}
.regler input {
  width: 100%;
  min-height: 44px;
  accent-color: var(--page-accent);
}
.wert {
  grid-column: 2;
  color: var(--page-muted);
}
.formen {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}
button {
  font: inherit;
  min-height: 44px;
  min-width: 44px;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
  cursor: pointer;
}
button.gewaehlt,
button.ton[aria-pressed="true"] {
  background: var(--page-accent);
  color: var(--page-on-accent);
  border-color: var(--page-accent);
  font-weight: 600;
}
button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}
@media (max-width: 30rem) {
  .regler {
    grid-template-columns: 1fr;
  }
  .wert {
    grid-column: 1;
  }
}
</style>

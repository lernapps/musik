<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { frequenz, name } from "./Musik.ts";
import { spiele, merkeSitzung } from "./Klang.ts";
import {
  ABSTAND,
  ansageNote,
  beschriftung as notenBeschriftung,
  gesamtdauer,
  plane,
  startzeiten,
} from "./Notenzeile.ts";

const props = withDefaults(
  defineProps<{
    /** Die Zeichen der Zeile: `ton` in Halbtönen ab c¹ (0 = c¹), `wert` und optional `pause`. */
    noten: { ton: number; wert: "ganze" | "halbe" | "viertel" | "achtel"; pause?: boolean }[];
    /** Taktart: zeichnet Taktangabe und Taktstriche, fügt keine Noten hinzu. */
    taktart?: "2/4" | "3/4" | "4/4" | "ohne";
    /** Notennamen unter den Noten zeigen. */
    namen?: boolean;
    /** Tempo in Vierteln pro Minute für „Alles abspielen“. */
    tempo?: number;
    /** Knopf „Alles abspielen“ zeigen. */
    abspielbar?: boolean;
    /** Kurzer Text für aria-label und Bildunterschrift. */
    beschriftung?: string;
    /** Noten antippbar (Name und Klang). Aus, wenn der Name nicht verraten werden soll. */
    antippbar?: boolean;
  }>(),
  { taktart: "ohne", namen: false, tempo: 80, abspielbar: true, beschriftung: "", antippbar: true },
);

const plan = computed(() => plane(props.noten, props.taktart, { namen: props.namen }));
const gewaehlt = ref<number | undefined>(undefined);
const aktiv = ref<number | undefined>(undefined);
const spielt = ref(false);
const ansage = ref("");
let zeitgeber: ReturnType<typeof setTimeout>[] = [];

const bildName = computed(() =>
  props.beschriftung !== ""
    ? props.beschriftung
    : `Notenzeile im Violinschlüssel mit ${props.noten.length} Zeichen (Noten und Pausen)`,
);

function tippe(index: number): void {
  const zeichen = props.noten[index];
  if (zeichen === undefined || !props.antippbar || zeichen.pause === true) return;
  gewaehlt.value = index;
  ansage.value = ansageNote(zeichen);
  spiele([{ hz: frequenz(zeichen.ton), start: 0, dauer: 0.7 }]);
}

function stoppeZeitgeber(): void {
  for (const z of zeitgeber) clearTimeout(z);
  zeitgeber = [];
}

function spieleAlle(): void {
  if (spielt.value) return;
  const zeiten = startzeiten(props.noten, props.tempo);
  const toene = props.noten.flatMap((n, i) =>
    n.pause === true
      ? []
      : [{ hz: frequenz(n.ton), start: zeiten[i]?.start ?? 0, dauer: Math.max(0.1, (zeiten[i]?.dauer ?? 0.5) - 0.05) }],
  );
  spiele(toene);
  spielt.value = true;
  gewaehlt.value = undefined;
  props.noten.forEach((n, i) => {
    const z = zeiten[i];
    if (n.pause === true || z === undefined) return;
    zeitgeber.push(setTimeout(() => (aktiv.value = i), (z.start + 0.05) * 1000));
    zeitgeber.push(
      setTimeout(
        () => {
          if (aktiv.value === i) aktiv.value = undefined;
        },
        (z.start + z.dauer + 0.05) * 1000,
      ),
    );
  });
  zeitgeber.push(
    setTimeout(
      () => {
        spielt.value = false;
        aktiv.value = undefined;
      },
      (gesamtdauer(props.noten, props.tempo) + 0.1) * 1000,
    ),
  );
}

onBeforeUnmount(stoppeZeitgeber);

const SCHLUESSEL =
  "M 11 14 C 11 21 1 21 1 14 C 1 9 8 8 10 13 C 12 18 11 6 12 -4 C 13 -16 15 -34 11 -44 C 8 -52 2 -48 2 -41 C 2 -32 13 -24 17 -14 C 20 -5 15 3 8 3 C 0 3 -4 -6 3 -11 C 9 -14 14 -10 12 -6";
const KREUZ = "M -2.2 -9 L -2.2 9 M 2.2 -10 L 2.2 8 M -5 -2.5 L 5 -4.5 M -5 4.5 L 5 2.5";
const PAUSE_VIERTEL = "M -2 -14 L 3 -6 L -3 2 L 2 9 C -3 7 -4 12 1 16";
const PAUSE_ACHTEL = "M 4 -12 L -2 10 M -3 -8 C 2 -8 4 -10 4 -12";

function fahnePfad(p: { hals?: { x: number; y2: number }; unten: boolean }): string {
  const h = p.hals;
  if (h === undefined) return "";
  const r = p.unten ? -1 : 1;
  return `M ${h.x} ${h.y2} C ${h.x + 1} ${h.y2 + 8 * r} ${h.x + 11} ${h.y2 + 10 * r} ${h.x + 8} ${h.y2 + 21 * r}`;
}

function hohl(wert: string): boolean {
  return wert === "ganze" || wert === "halbe";
}
// iPhone: Die Audio-Sitzung auf Wiedergabe stellen, damit der Stummschalter die Töne nicht verstummen lässt.
onMounted(() => {
  merkeSitzung((navigator as Navigator & { audioSession?: { type: string } }).audioSession);
});
</script>

<template>
  <figure class="notenzeile">
    <svg
      class="bild"
      role="group"
      :viewBox="`0 0 ${plan.breite} ${plan.hoehe}`"
      :aria-label="bildName"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g v-for="(zeile, z) in plan.zeilen" :key="z">
        <line
          v-for="n in 5"
          :key="'l' + n"
          :x1="plan.schluesselX"
          :x2="plan.breite - 8"
          :y1="zeile.unten - (n - 1) * ABSTAND"
          :y2="zeile.unten - (n - 1) * ABSTAND"
          class="linie"
        />
        <line
          :x1="plan.schluesselX"
          :x2="plan.schluesselX"
          :y1="zeile.unten - 4 * ABSTAND"
          :y2="zeile.unten"
          class="linie"
        />
        <path
          :d="SCHLUESSEL"
          class="schluessel"
          :transform="`translate(${plan.schluesselX + 8} ${zeile.unten})`"
          aria-hidden="true"
        />
        <g v-if="zeile.taktangabe" class="taktangabe" aria-hidden="true">
          <text :x="plan.schluesselX + 56" :y="zeile.unten - 22" text-anchor="middle">{{ taktart.charAt(0) }}</text>
          <text :x="plan.schluesselX + 56" :y="zeile.unten - 2" text-anchor="middle">{{ taktart.charAt(2) }}</text>
        </g>
        <line
          v-for="(x, k) in zeile.striche"
          :key="'s' + k"
          :x1="x"
          :x2="x"
          :y1="zeile.unten - 4 * ABSTAND"
          :y2="zeile.unten"
          class="taktstrich"
        />
        <g
          v-for="p in zeile.plaetze"
          :key="p.index"
          class="platz"
          :class="{
            gewaehlt: gewaehlt === p.index,
            aktiv: aktiv === p.index,
            taste: antippbar && p.zeichen.pause !== true,
          }"
          :role="antippbar && p.zeichen.pause !== true ? 'button' : undefined"
          :tabindex="antippbar && p.zeichen.pause !== true ? 0 : undefined"
          :aria-label="antippbar ? notenBeschriftung(p.zeichen) : undefined"
          :aria-pressed="antippbar && p.zeichen.pause !== true ? gewaehlt === p.index : undefined"
          @click="tippe(p.index)"
          @keydown.enter.prevent="tippe(p.index)"
          @keydown.space.prevent="tippe(p.index)"
        >
          <rect class="treffer" :x="p.x - p.w / 2" :y="zeile.unten - 60" :width="p.w" :height="86" rx="6" />
          <template v-if="p.zeichen.pause === true">
            <rect
              v-if="p.zeichen.wert === 'ganze'"
              :x="p.x - 6"
              :y="zeile.unten - 3 * ABSTAND"
              width="12"
              height="5"
              class="fuell"
            />
            <rect
              v-else-if="p.zeichen.wert === 'halbe'"
              :x="p.x - 6"
              :y="zeile.unten - 2 * ABSTAND - 5"
              width="12"
              height="5"
              class="fuell"
            />
            <path
              v-else-if="p.zeichen.wert === 'viertel'"
              :d="PAUSE_VIERTEL"
              class="strich"
              :transform="`translate(${p.x} ${zeile.unten - 2 * ABSTAND})`"
            />
            <g v-else :transform="`translate(${p.x} ${zeile.unten - 2 * ABSTAND})`">
              <path :d="PAUSE_ACHTEL" class="strich" />
              <circle cx="-3" cy="-8" r="2.6" class="fuell" />
            </g>
          </template>
          <template v-else>
            <line
              v-for="(hy, k) in p.hilfslinien"
              :key="'h' + k"
              :x1="p.x - 11"
              :x2="p.x + 11"
              :y1="hy"
              :y2="hy"
              class="linie hilfs"
            />
            <path v-if="p.kreuz" :d="KREUZ" class="strich kreuz" :transform="`translate(${p.x - 15} ${p.y})`" />
            <g class="kopf" :transform="`translate(${p.x} ${p.y})`">
              <ellipse rx="7.2" ry="5" transform="rotate(-20)" :class="hohl(p.zeichen.wert) ? 'hohl' : 'voll'" />
            </g>
            <line v-if="p.hals" :x1="p.hals.x" :x2="p.hals.x" :y1="p.hals.y1" :y2="p.hals.y2" class="hals" />
            <path v-if="p.fahne" :d="fahnePfad(p)" class="strich" />
            <line
              v-if="p.balken"
              :x1="p.balken.x1"
              :x2="p.balken.x2"
              :y1="p.balken.y1"
              :y2="p.balken.y2"
              class="balken"
            />
            <path
              v-if="aktiv === p.index"
              class="marke"
              :d="`M ${p.x - 5} ${p.y + 12} L ${p.x} ${p.y + 6} L ${p.x + 5} ${p.y + 12} Z`"
            />
          </template>
          <text
            v-if="namen && p.zeichen.pause !== true"
            :x="p.x"
            :y="zeile.namenY"
            text-anchor="middle"
            class="notenname"
            aria-hidden="true"
          >
            {{ name(p.zeichen.ton) }}
          </text>
        </g>
      </g>
    </svg>
    <figcaption v-if="beschriftung !== ''" class="unterschrift">{{ beschriftung }}</figcaption>
    <p v-if="antippbar" class="ansage" aria-live="polite">
      {{ ansage !== "" ? ansage : noten.some((n) => n.pause !== true) ? "Tippe eine Note." : "" }}
    </p>
    <div v-if="abspielbar" class="knoepfe">
      <button type="button" :disabled="spielt" :aria-label="`Alles abspielen, Tempo ${tempo}`" @click="spieleAlle">
        {{ spielt ? "♪ spielt …" : "▶ Alles abspielen" }}
      </button>
    </div>
  </figure>
</template>

<style scoped>
.notenzeile {
  margin: 0;
  max-width: 100%;
  color: var(--page-text);
}
.bild {
  display: block;
  width: 100%;
  height: auto;
  background: var(--page-background);
  border: 1px solid var(--page-border);
  border-radius: 6px;
}
.linie {
  stroke: var(--page-text);
  stroke-width: 1.1;
}
.hilfs {
  stroke-width: 1.5;
}
.taktstrich {
  stroke: var(--page-text);
  stroke-width: 1.6;
}
.schluessel {
  fill: none;
  stroke: var(--page-text);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.taktangabe text {
  fill: var(--page-text);
  font: 700 22px sans-serif;
}
.strich {
  fill: none;
  stroke: var(--page-text);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.kreuz {
  stroke-width: 1.5;
}
.fuell {
  fill: var(--page-text);
}
.voll {
  fill: var(--page-text);
  stroke: var(--page-text);
  stroke-width: 1;
}
.hohl {
  fill: var(--page-background);
  stroke: var(--page-text);
  stroke-width: 2;
}
.hals {
  stroke: var(--page-text);
  stroke-width: 1.8;
}
.balken {
  stroke: var(--page-text);
  stroke-width: 4.5;
  stroke-linecap: butt;
}
.marke {
  fill: var(--page-accent);
  stroke: var(--page-text);
  stroke-width: 1;
}
.notenname {
  fill: var(--page-text);
  font: 600 14px sans-serif;
}
.treffer {
  fill: transparent;
  stroke: none;
}
.taste {
  cursor: pointer;
}
.platz:focus {
  outline: none;
}
.platz:focus-visible .treffer {
  stroke: var(--page-accent);
  stroke-width: 3;
}
.gewaehlt .treffer {
  stroke: var(--page-accent);
  stroke-width: 1.5;
}
.aktiv .treffer {
  fill: var(--page-surface);
  stroke: var(--page-accent);
  stroke-width: 3;
  stroke-dasharray: 5 3;
}
.aktiv .kopf {
  transform-box: fill-box;
}
.unterschrift {
  margin-top: 0.25rem;
  color: var(--page-muted);
  font-size: 0.9em;
}
.ansage {
  margin: 0.5rem 0;
  min-height: 1.5em;
}
.knoepfe button {
  font: inherit;
  min-height: 44px;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
  cursor: pointer;
}
.knoepfe button:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}
.knoepfe button:disabled {
  opacity: 0.7;
  cursor: default;
}
</style>

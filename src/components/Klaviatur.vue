<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { frequenz, gegenname, istSchwarz, name, nameMitOktave } from "./Musik.ts";
import { spiele, merkeSitzung } from "./Klang.ts";
import Lautstaerke from "./Lautstaerke.vue";

const props = withDefaults(
  defineProps<{
    /** Erster Ton der gezeigten Oktave in Halbtönen ab c¹: 0 (c¹ bis c²) oder 12 (c² bis c³). */
    start?: number;
    /** Namen auf den Tasten zeigen. */
    namen?: boolean;
    /** Töne, die hervorgehoben werden (Halbtöne ab c¹). */
    markiert?: number[];
    /** Eine Tonfolge, die der Knopf „Folge abspielen“ spielt (Halbtöne ab c¹). */
    folge?: number[];
  }>(),
  { start: 0, namen: true, markiert: () => [], folge: () => [] },
);

const anfang = ref(props.start === 12 ? 12 : 0);
const namenZeigen = ref(props.namen);
const gewaehlt = ref<number | undefined>(undefined);

const toene = computed(() => Array.from({ length: 13 }, (_, i) => anfang.value + i));
const weisse = computed(() => toene.value.filter((t) => !istSchwarz(t)));
const schwarze = computed(() =>
  toene.value
    .filter((t) => istSchwarz(t))
    .map((t) => ({ ton: t, links: ((weisse.value.findIndex((w) => w > t) - 0.3) * 100) / weisse.value.length })),
);

function beschrifte(ton: number): string {
  const zweiter = gegenname(ton);
  return `${nameMitOktave(ton)}, Ton ${name(ton)}${zweiter ? ` oder ${zweiter}` : ""}`;
}

function anschlagen(ton: number): void {
  gewaehlt.value = ton;
  spiele([{ hz: frequenz(ton), start: 0, dauer: 0.7 }]);
}

function spieleFolge(): void {
  spiele(props.folge.map((ton, i) => ({ hz: frequenz(ton), start: i * 0.5, dauer: 0.45 })));
}

const ansage = computed(() =>
  gewaehlt.value === undefined
    ? "Tippe eine Taste."
    : `Gewählt: ${name(gewaehlt.value)} (${nameMitOktave(gewaehlt.value)}), ${Math.round(frequenz(gewaehlt.value))} Hz`,
);
// iPhone: Die Audio-Sitzung auf Wiedergabe stellen, damit der Stummschalter die Töne nicht verstummen lässt.
onMounted(() => {
  merkeSitzung((navigator as Navigator & { audioSession?: { type: string } }).audioSession);
});
</script>

<template>
  <div class="klaviatur">
    <div class="tasten" role="group" aria-label="Klaviatur, eine Oktave">
      <button
        v-for="ton in weisse"
        :key="ton"
        type="button"
        class="weiss"
        :class="{ markiert: markiert.includes(ton), gewaehlt: gewaehlt === ton }"
        :aria-label="beschrifte(ton)"
        @click="anschlagen(ton)"
      >
        <span v-if="markiert.includes(ton)" aria-hidden="true">●</span>
        <span v-if="namenZeigen" class="name" aria-hidden="true">{{ name(ton) }}</span>
      </button>
      <button
        v-for="s in schwarze"
        :key="s.ton"
        type="button"
        class="schwarz"
        :class="{ markiert: markiert.includes(s.ton), gewaehlt: gewaehlt === s.ton }"
        :style="{ left: s.links + '%', width: 60 / weisse.length + '%' }"
        :aria-label="beschrifte(s.ton)"
        @click="anschlagen(s.ton)"
      >
        <span v-if="markiert.includes(s.ton)" aria-hidden="true">●</span>
      </button>
    </div>
    <p class="ansage" aria-live="polite">{{ ansage }}</p>
    <Lautstaerke />
    <div class="knoepfe">
      <button type="button" :disabled="anfang === 0" @click="anfang = 0">Oktave c¹ bis c²</button>
      <button type="button" :disabled="anfang === 12" @click="anfang = 12">Oktave c² bis c³</button>
      <button type="button" @click="namenZeigen = !namenZeigen">
        {{ namenZeigen ? "Namen ausblenden" : "Namen zeigen" }}
      </button>
      <button v-if="folge.length > 0" type="button" @click="spieleFolge">▶ Folge abspielen</button>
    </div>
  </div>
</template>

<style scoped>
.klaviatur {
  max-width: 100%;
}
.tasten {
  position: relative;
  display: flex;
  height: 9rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  overflow: hidden;
}
.weiss {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0 0.4rem;
  border: 1px solid var(--page-border);
  background: #fff;
  color: #111;
  cursor: pointer;
  font: inherit;
}
.schwarz {
  position: absolute;
  top: 0;
  height: 5.5rem;
  border: 1px solid #000;
  border-radius: 0 0 4px 4px;
  background: #222;
  color: #fff;
  cursor: pointer;
  padding: 0;
}
.markiert {
  outline: 3px solid var(--page-accent);
  outline-offset: -3px;
}
.gewaehlt {
  background: var(--page-right-background, #cfe8d4);
  color: #111;
}
.schwarz.gewaehlt {
  background: #4a6b52;
  color: #fff;
}
.weiss:focus-visible,
.schwarz:focus-visible,
.knoepfe button:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
  z-index: 2;
}
.name {
  font-weight: 600;
}
.ansage {
  margin: 0.5rem 0;
  min-height: 1.5em;
}
.knoepfe {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.knoepfe button {
  font: inherit;
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
  cursor: pointer;
}
.knoepfe button:disabled {
  opacity: 0.55;
  cursor: default;
}
</style>

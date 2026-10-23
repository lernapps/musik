<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { frequenz, name, nameMitOktave } from "./Musik.ts";
import { oeffneMikrofon, spiele, merkeSitzung } from "./Klang.ts";
import type { Mikrofon } from "./Klang.ts";
import { tonhoehe } from "./Analyse.ts";
import {
  RAHMEN,
  abbilden,
  WEISSE_TOENE,
  auswahlName,
  eigeneAnzahl,
  fortschritt,
  gehalten,
  glaettung,
  halbton,
  imBand,
  melodie,
  neuerLauf,
  rueckmeldung,
  standardMelodie,
  verlaufKuerzen,
  weiter,
  zuordnen,
} from "./Stimmspiegel.ts";
import type { Probe } from "./Stimmspiegel.ts";

const props = withDefaults(
  defineProps<{
    /** Zielton in Halbtönen ab c¹ (Standard 4 = e¹). */
    ziel?: number;
    /** Tonfolge zum Nachsingen (Halbtöne ab c¹); wenn nicht leer, hat sie Vorrang vor `ziel`. */
    folge?: number[];
    /** Eigene Melodie: Anzahl der Töne zum Auswählen (2 bis 6); 0 = aus. Die Auswahl ersetzt `folge` und `ziel`. */
    eigene?: number;
    /** Nur der Tonname zählt, die Oktave ist egal. */
    ohneOktave?: boolean;
  }>(),
  { ziel: 4, folge: () => [], eigene: 0, ohneOktave: true },
);

const NICHT_VERFUEGBAR =
  "Das Mikrofon ist nicht verfügbar. Das ist okay: Übe mit der Anleitung unter ‚So übst du selbst‘ — den Zielton kannst du trotzdem hören.";
const START_TEXT = "Starte das Mikrofon und singe.";
const TAKT_MS = 50;
const ANSAGE_MS = 500;

const anzahlEigene = computed(() => eigeneAnzahl(props.eigene));
const auswahl = ref<number[]>(standardMelodie(anzahlEigene.value));
const ziele = computed(() =>
  anzahlEigene.value > 0
    ? melodie(auswahl.value, anzahlEigene.value)
    : props.folge.length > 0
      ? props.folge
      : [props.ziel],
);
const istFolge = computed(() => anzahlEigene.value > 0 || props.folge.length > 0);
const melodieText = computed(() => `Deine Melodie: ${ziele.value.map((t) => name(t)).join(" – ")}`);
const lauf = ref(neuerLauf(ziele.value.length));
const aktuellesZiel = computed(() => ziele.value[Math.min(lauf.value.index, ziele.value.length - 1)] ?? props.ziel);

const zustand = ref<"aus" | "fragt" | "an">("aus");
const proben = ref<Probe[]>([]);
const jetzt = ref(0);
const letzteHoehe = ref<number | undefined>(undefined);
const ansage = ref(START_TEXT);
const status = ref("");
const meldung = ref("");

let geraete: MediaDevices | undefined;
let mik: Mikrofon | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let startZeit = 0;
let letzterTakt = 0;
let letzteAnsage = 0;
let stummBis = 0;
let weg = false;

onMounted(() => {
  geraete = navigator.mediaDevices;
});

const zielAnzeige = computed(() => {
  const h = letzteHoehe.value;
  return props.ohneOktave && h !== undefined
    ? zuordnen(frequenz(h), aktuellesZiel.value, true).ziel
    : aktuellesZiel.value;
});

const zielName = computed(() => (props.ohneOktave ? name(aktuellesZiel.value) : nameMitOktave(aktuellesZiel.value)));

const bild = computed(() => abbilden(proben.value, jetzt.value, zielAnzeige.value, props.ohneOktave));

const bildBeschreibung = computed(
  () =>
    `Diagramm der letzten 6 Sekunden: Die Linie zeigt deine Stimme, das grüne Band den Zielton ${zielName.value} mit 50 Cent Spielraum nach oben und unten.`,
);

const folgeNamen = computed(() =>
  ziele.value.map((t, i) => ({
    text: props.ohneOktave ? name(t) : nameMitOktave(t),
    getroffen: lauf.value.getroffen[i] === true,
    dran: i === Math.min(lauf.value.index, ziele.value.length - 1) && !lauf.value.fertig,
  })),
);

function waehle(i: number, ereignis: Event): void {
  const wert = Number((ereignis.target as { value?: string } | null)?.value);
  const neu = melodie(auswahl.value, anzahlEigene.value);
  neu[i] = wert;
  auswahl.value = neu;
}

function nenne(text: string): void {
  ansage.value = text;
  letzteAnsage = Date.now();
}

function tick(): void {
  if (!mik) return;
  const zeitpunkt = Date.now();
  const dt = Math.min((zeitpunkt - letzterTakt) / 1000, 0.25);
  letzterTakt = zeitpunkt;
  const t = (zeitpunkt - startZeit) / 1000;
  jetzt.value = t;
  // Solange der Lautsprecher spielt, hört die Komponente nicht zu (sonst würde der Ton sich selbst treffen).
  if (zeitpunkt < stummBis) {
    proben.value = verlaufKuerzen(proben.value, t);
    return;
  }
  const hz = tonhoehe(mik.lesen(), mik.abtastrate);
  let neu = verlaufKuerzen(proben.value, t);
  let treffer = false;
  if (hz > 0) {
    const h = halbton(hz);
    neu = [...neu, { t, halbton: h }];
    letzteHoehe.value = h;
    treffer = imBand(zuordnen(hz, aktuellesZiel.value, props.ohneOktave).abweichung);
  }
  proben.value = neu;
  const vorher = lauf.value;
  const nachher = weiter(vorher, treffer, dt);
  lauf.value = nachher;
  const gezaehlt = nachher.getroffen.filter(Boolean).length !== vorher.getroffen.filter(Boolean).length;
  if (nachher.fertig) {
    beenden();
    return;
  }
  if (nachher.index !== vorher.index) status.value = fortschritt(nachher);
  if (gezaehlt || zeitpunkt - letzteAnsage >= ANSAGE_MS) {
    nenne(rueckmeldung(glaettung(neu, t), aktuellesZiel.value, props.ohneOktave, gehalten(nachher)));
  }
}

function freigeben(): void {
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
  mik?.stoppen();
  mik = undefined;
  zustand.value = "aus";
}

function beenden(): void {
  freigeben();
  status.value = istFolge.value ? "Geschafft: alle Töne getroffen!" : "Geschafft: Du hast den Ton getroffen!";
  nenne("Das Mikrofon ist aus.");
}

function stoppen(): void {
  freigeben();
  proben.value = [];
  nenne(START_TEXT);
}

function vonVorn(): void {
  lauf.value = neuerLauf(ziele.value.length);
  proben.value = [];
  letzteHoehe.value = undefined;
  status.value = istFolge.value ? fortschritt(lauf.value) : "";
  nenne(zustand.value === "an" ? "Singe jetzt." : START_TEXT);
}

async function starten(): Promise<void> {
  if (zustand.value !== "aus") return;
  if (lauf.value.fertig) vonVorn();
  zustand.value = "fragt";
  meldung.value = "";
  try {
    const m = await oeffneMikrofon(geraete);
    if (weg) {
      m.stoppen();
      return;
    }
    mik = m;
    startZeit = Date.now();
    letzterTakt = startZeit;
    stummBis = 0;
    jetzt.value = 0;
    proben.value = [];
    zustand.value = "an";
    nenne("Das Mikrofon hört zu. Singe jetzt.");
    timer = setInterval(tick, TAKT_MS);
  } catch {
    if (weg) return;
    zustand.value = "aus";
    meldung.value = NICHT_VERFUEGBAR;
  }
}

function hoeren(): void {
  const dauerTon = 0.6;
  const toene = ziele.value;
  const dauer = spiele(
    toene.map((ton, i) => ({
      hz: frequenz(ton),
      start: i * dauerTon,
      dauer: istFolge.value ? dauerTon - 0.05 : 1,
    })),
  );
  stummBis = Date.now() + dauer * 1000 + 400;
}

watch(
  () => ziele.value.join(","),
  () => {
    lauf.value = neuerLauf(ziele.value.length);
    letzteHoehe.value = undefined;
    status.value = istFolge.value ? fortschritt(lauf.value) : "";
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  weg = true;
  freigeben();
});
// iPhone: Die Audio-Sitzung auf Wiedergabe stellen, damit der Stummschalter die Töne nicht verstummen lässt.
onMounted(() => {
  merkeSitzung((navigator as Navigator & { audioSession?: { type: string } }).audioSession);
});
</script>

<template>
  <div class="stimmspiegel">
    <p class="tipp">Singe auf ‚lu‘ oder ‚mi‘ in einer ruhigen Umgebung.</p>

    <div v-if="anzahlEigene > 0" class="eigene">
      <div v-for="(_, i) in ziele" :key="i" class="wahl">
        <label>
          Ton {{ i + 1 }}
          <select :value="ziele[i]" @change="waehle(i, $event)">
            <option v-for="t in WEISSE_TOENE" :key="t" :value="t">{{ auswahlName(t) }}</option>
          </select>
        </label>
      </div>
      <p class="melodie">{{ melodieText }}</p>
    </div>

    <div v-if="istFolge" class="folge">
      <ol class="namen" aria-label="Tonfolge zum Nachsingen">
        <li
          v-for="(n, i) in folgeNamen"
          :key="i"
          :class="{ dran: n.dran, getroffen: n.getroffen }"
          :aria-current="n.dran ? 'step' : undefined"
        >
          {{ n.text }}<span v-if="n.getroffen" aria-hidden="true"> ✓</span
          ><span v-if="n.getroffen" class="nur-vorlesen"> (getroffen)</span>
        </li>
      </ol>
    </div>

    <svg
      class="diagramm"
      :viewBox="`0 0 ${RAHMEN.breite} ${RAHMEN.hoehe}`"
      role="img"
      :aria-label="bildBeschreibung"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        :x="RAHMEN.links"
        :y="RAHMEN.oben"
        :width="RAHMEN.breite - RAHMEN.links - RAHMEN.rechts"
        :height="RAHMEN.hoehe - RAHMEN.oben - RAHMEN.unten"
        class="flaeche"
      />
      <g v-for="(tick, i) in bild.ticks" :key="i">
        <line :x1="RAHMEN.links" :x2="RAHMEN.breite - RAHMEN.rechts" :y1="tick.y" :y2="tick.y" class="gitter" />
        <text :x="RAHMEN.links - 4" :y="tick.y + 4" text-anchor="end" class="achse">{{ tick.text }}</text>
      </g>
      <rect
        :x="RAHMEN.links"
        :y="bild.band.y"
        :width="RAHMEN.breite - RAHMEN.links - RAHMEN.rechts"
        :height="bild.band.hoehe"
        class="band"
      />
      <line
        :x1="RAHMEN.links"
        :x2="RAHMEN.breite - RAHMEN.rechts"
        :y1="bild.zielY"
        :y2="bild.zielY"
        class="zielLinie"
      />
      <text :x="RAHMEN.links + 4" :y="bild.band.y - 3" class="zielText">Ziel: {{ zielName }} (±50 Cent)</text>
      <polyline v-for="(l, i) in bild.linien" :key="i" :points="l" class="stimme" />
      <circle v-for="(p, i) in bild.punkte" :key="i" :cx="p.x" :cy="p.y" r="2.5" class="punkt" />
      <text :x="RAHMEN.links" :y="RAHMEN.hoehe - 6" class="achse">vor 6 s</text>
      <text :x="RAHMEN.breite - RAHMEN.rechts" :y="RAHMEN.hoehe - 6" text-anchor="end" class="achse">jetzt</text>
    </svg>

    <p class="ansage" aria-live="polite">{{ ansage }}</p>
    <p class="status" aria-live="polite">{{ status }}</p>

    <div class="knoepfe">
      <button type="button" :aria-label="istFolge ? 'Folge hören' : 'Zielton hören'" @click="hoeren">
        {{ istFolge ? "▶ Folge hören" : "▶ Zielton hören" }}
      </button>
      <button v-if="zustand !== 'an'" type="button" :disabled="zustand === 'fragt'" @click="starten">
        🎤 Mikrofon starten
      </button>
      <button v-else type="button" @click="stoppen">■ Mikrofon stoppen</button>
      <button type="button" @click="vonVorn">Von vorn</button>
    </div>

    <p class="meldung" aria-live="polite">{{ meldung }}</p>
    <p class="datenschutz">Das Mikrofon hört nur in deinem Browser zu. Es wird nichts aufgenommen oder gesendet.</p>
  </div>
</template>

<style scoped>
.stimmspiegel {
  max-width: 100%;
  color: var(--page-text);
}
.tipp,
.datenschutz {
  margin: 0.25rem 0 0.5rem;
  color: var(--page-muted);
  font-size: 0.9rem;
}
.namen {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  padding: 0;
  list-style: none;
}
.namen li {
  min-width: 2.75rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  text-align: center;
  font-weight: 600;
}
.namen li.dran {
  border: 3px solid var(--page-accent);
  padding: calc(0.3rem - 2px) calc(0.6rem - 2px);
  text-decoration: underline;
}
.namen li.getroffen {
  background: var(--page-right-background, #cfe8d4);
}
.eigene {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.wahl label {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-weight: 600;
}
.wahl select {
  min-height: 44px;
  font: inherit;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
}
.wahl select:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}
.melodie {
  flex-basis: 100%;
  margin: 0;
  font-weight: 600;
}
.nur-vorlesen {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.diagramm {
  display: block;
  width: 100%;
  height: auto;
  max-width: 36rem;
}
.flaeche {
  fill: var(--page-surface);
  stroke: var(--page-border);
}
.gitter {
  stroke: var(--page-border);
  stroke-width: 0.5;
}
.achse {
  fill: var(--page-muted);
  font-size: 11px;
}
.band {
  fill: var(--page-right-background, #cfe8d4);
  stroke: var(--page-right, #2a7);
  stroke-width: 1;
  opacity: 0.85;
}
.zielLinie {
  stroke: var(--page-right, #2a7);
  stroke-width: 1.5;
  stroke-dasharray: 5 3;
}
.zielText {
  fill: var(--page-text);
  font-size: 11px;
  font-weight: 600;
  paint-order: stroke;
  stroke: var(--page-surface);
  stroke-width: 3px;
}
.stimme {
  fill: none;
  stroke: var(--page-accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.punkt {
  fill: var(--page-accent);
  stroke: var(--page-background);
  stroke-width: 1;
}
.ansage {
  margin: 0.5rem 0 0.25rem;
  min-height: 1.5em;
  font-weight: 600;
}
.status {
  margin: 0 0 0.5rem;
  min-height: 1.5em;
}
.meldung {
  margin: 0.5rem 0 0;
}
.meldung:not(:empty) {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
}
.knoepfe {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.knoepfe button {
  min-height: 44px;
  font: inherit;
  padding: 0.4rem 0.8rem;
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
  opacity: 0.55;
  cursor: default;
}
</style>

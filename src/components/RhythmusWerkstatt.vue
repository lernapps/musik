<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { klick, oeffneMikrofon, spiele } from "./Klang.ts";
import type { Mikrofon } from "./Klang.ts";
import Lautstaerke from "./Lautstaerke.vue";
import {
  TEMPO_MAX,
  TEMPO_MIN,
  TEMPO_SCHRITT,
  aufSchlag,
  durchgangDauer,
  durchgangEreignisse,
  durchgangNr,
  durchgangText,
  effektivwert,
  einzaehlDauer,
  einzaehlEreignisse,
  einzaehlZahl,
  ergebnisText,
  feldImDurchgang,
  feldName,
  felderProTakt,
  felderZahl,
  fuelleVerlauf,
  klemmeTakte,
  klemmeTempo,
  MESS_SCHRITT,
  nachbauText,
  naechstesFeld,
  notenwerteText,
  passeMusterAn,
  unterschiede,
  waehleDurchgaenge,
  wertAus,
  zaehlhilfe,
  zaehlhilfeText,
} from "./RhythmusWerkstatt.ts";
import type { Ereignis, Klatschergebnis } from "./RhythmusWerkstatt.ts";
import { einsaetze } from "./Analyse.ts";

const props = withDefaults(
  defineProps<{
    /** Taktart: bestimmt die Zahl der Schläge pro Takt. */
    taktart?: "2/4" | "3/4" | "4/4";
    /** Anzahl der Takte (1 bis 4); jeder Takt hat eine eigene Zeile. */
    takte?: number;
    /** Achtelraster (zwei Felder je Schlag) oder Viertelraster (nur die Schläge). */
    raster?: "viertel" | "achtel";
    /** Tempo in Schlägen pro Minute (40 bis 160). */
    tempo?: number;
    /** Startmuster: an = Schlag, aus = Pause. Länge = Zahl der Felder. */
    muster?: boolean[];
    /** Ein Vorbild-Muster, das nur gehört, nicht gezeigt wird. */
    vorbild?: boolean[];
    /** Felder dürfen angetippt werden. */
    bearbeiten?: boolean;
    /** Bietet den Mikrofon-Modus „Mit Klatschen üben“ an. */
    klatschen?: boolean;
    /** Metronom-Klicks beim Abspielen. */
    metronom?: boolean;
    /** Wie oft das Muster gespielt wird (1 bis 8); die Auswahl kennt 1, 2, 4 und 8. */
    durchgaenge?: number;
    /** Startet mit der Auswahl „Dauerhaft“ (läuft bis „Stopp“). */
    dauerhaft?: boolean;
  }>(),
  {
    taktart: "4/4",
    takte: 1,
    raster: "achtel",
    tempo: 80,
    muster: () => [],
    vorbild: () => [],
    bearbeiten: true,
    klatschen: false,
    metronom: true,
    durchgaenge: 1,
    dauerhaft: false,
  },
);

type Phase = "ruhe" | "spielt" | "einzaehlen" | "klatschen";

const anzahlTakte = computed(() => klemmeTakte(props.takte));
const anzahl = computed(() => felderZahl(props.taktart, anzahlTakte.value, props.raster));
const proTakt = computed(() => felderProTakt(props.taktart, props.raster));
const felder = ref<boolean[]>(passeMusterAn(props.muster, anzahl.value));
const tempoWert = ref(klemmeTempo(props.tempo));
const metronomAn = ref(props.metronom);
const einzaehlenAn = ref(true);
const wahl = ref(props.dauerhaft ? "dauer" : String(waehleDurchgaenge(props.durchgaenge)));
const phase = ref<Phase>("ruhe");
const laufend = ref(-1);
const dran = ref(-1);
const zahlAnzeige = ref(0);
const durchgang = ref(0);
const durchgangVon = ref(1);
const durchgangDauerhaft = ref(false);
const hoerenText = ref("");
const meldung = ref("");
const mikrofonFehler = ref(false);
const ergebnis = ref<Klatschergebnis | undefined>(undefined);
const vorbildMeldung = ref("");

watch(
  () => [props.muster, anzahl.value] as const,
  () => {
    felder.value = passeMusterAn(props.muster.length > 0 ? props.muster : felder.value, anzahl.value);
  },
);
watch(
  () => props.tempo,
  (neu) => {
    tempoWert.value = klemmeTempo(neu);
  },
);
watch(
  () => props.metronom,
  (neu) => {
    metronomAn.value = neu;
  },
);
watch(
  () => [props.durchgaenge, props.dauerhaft] as const,
  () => {
    wahl.value = props.dauerhaft ? "dauer" : String(waehleDurchgaenge(props.durchgaenge));
  },
);

// Zeilen: ein Takt je Zeile; ein 4/4-Takt im Achtelraster (8 Felder) wird auf zwei Zeilen zu je 4 verteilt,
// damit die Felder bei 360 px mindestens 44 px breit bleiben.
const zeilen = computed(() => {
  const laenge = proTakt.value > 6 ? proTakt.value / 2 : proTakt.value;
  const liste: { start: number; felder: number[]; hilfe: string[]; takt: number }[] = [];
  const hilfe = zaehlhilfe(props.taktart, props.raster);
  for (let start = 0; start < anzahl.value; start += laenge) {
    const imTakt = start % proTakt.value;
    liste.push({
      start,
      takt: Math.floor(start / proTakt.value) + 1,
      felder: Array.from({ length: laenge }, (_, i) => start + i),
      hilfe: hilfe.slice(imTakt, imTakt + laenge),
    });
  }
  return liste;
});

const hilfeText = computed(() => zaehlhilfeText(props.taktart, props.raster));
const notenText = computed(() => notenwerteText(felder.value, props.taktart, anzahlTakte.value, props.raster));
const vorbildFelder = computed(() => passeMusterAn(props.vorbild, anzahl.value));
const hatVorbild = computed(() => props.vorbild.some((an) => an));
const klatschZiel = computed(() => (hatVorbild.value ? vorbildFelder.value : felder.value));
const beschaeftigt = computed(() => phase.value !== "ruhe");
const dauerWahl = computed(() => wahl.value === "dauer");
const wahlZahl = computed(() => (dauerWahl.value ? 1 : Number(wahl.value) || 1));
const durchgangZeile = computed(() =>
  phase.value !== "ruhe" && durchgang.value > 0
    ? durchgangText(durchgang.value, durchgangVon.value, durchgangDauerhaft.value)
    : "",
);

function umschalten(i: number): void {
  if (!props.bearbeiten) return;
  felder.value = felder.value.map((an, j) => (j === i ? !an : an));
  ergebnis.value = undefined;
  vorbildMeldung.value = "";
}

function loeschen(): void {
  felder.value = felder.value.map(() => false);
  ergebnis.value = undefined;
  vorbildMeldung.value = "";
}

function tempoAendern(schritt: number): void {
  tempoWert.value = klemmeTempo(tempoWert.value + schritt);
}

function feldBeschriftung(i: number): string {
  return `${feldName(i, props.taktart, props.raster)}: ${felder.value[i] ? "Schlag" : "Pause"}`;
}

// ---- Alles mit Browser-Zugriff entsteht erst in onMounted ----
interface Zeitgeber {
  jetzt(): number;
  alle(fn: () => void, ms: number): number;
  ende(id: number): void;
}
let zeitgeber: Zeitgeber | undefined;
let geraete: MediaDevices | undefined;
let timer = 0;
let mikrofon: Mikrofon | undefined;
let abgebrochen = false;

onMounted(() => {
  zeitgeber = {
    jetzt: () => window.performance.now() / 1000,
    alle: (fn, ms) => window.setInterval(fn, ms),
    ende: (id) => window.clearInterval(id),
  };
  geraete = navigator.mediaDevices;
});

function aufraeumen(): void {
  if (zeitgeber && timer) zeitgeber.ende(timer);
  timer = 0;
  if (mikrofon) {
    mikrofon.stoppen();
    mikrofon = undefined;
  }
  laufend.value = -1;
  dran.value = -1;
  zahlAnzeige.value = 0;
  durchgang.value = 0;
  hoerenText.value = "";
  phase.value = "ruhe";
}

function stopp(): void {
  abgebrochen = true;
  aufraeumen();
  meldung.value = "Gestoppt.";
}

onBeforeUnmount(() => {
  abgebrochen = true;
  aufraeumen();
});

const VORAUS = 0.2; // Sekunden, die der Plan im Voraus an die Web-Audio-Uhr übergeben wird

interface Lauf {
  muster: boolean[];
  /** Mit Einzählung (ein Takt Klick vorweg, nur einmal am Anfang). */
  einzaehlen: boolean;
  /** Anzahl der Durchgänge; `Infinity` = dauerhaft. */
  durchgaenge: number;
  ton: boolean;
  /** Das Metronom klickt leise (beim Klatschen). */
  leise: boolean;
  /** Zeigt, welches Feld klingt. */
  feldZeigen: boolean;
  /** Zeigt, welches Feld als Nächstes geklatscht werden soll. */
  danZeigen: boolean;
  beiMessung?: (t: number) => void;
  beiEnde: () => void;
}

/**
 * Spielt einen Lauf. Alle 25 ms werden die Ereignisse der nächsten 0,2 s an Web Audio übergeben, damit es nicht
 * ruckelt. Die Durchgänge werden erst kurz vor ihrem Beginn geplant (so geht „Dauerhaft“), aber taktgenau
 * aneinander: Durchgang n beginnt bei Beginn + n × Dauer. Dieselbe Uhr lässt das Feld mitlaufen.
 */
function laufe(lauf: Lauf): void {
  if (!zeitgeber) return;
  const uhr = zeitgeber;
  const opts = {
    muster: lauf.muster,
    taktart: props.taktart,
    takte: anzahlTakte.value,
    raster: props.raster,
    tempo: tempoWert.value,
    ton: lauf.ton,
    metronom: metronomAn.value,
  };
  const beginn = lauf.einzaehlen ? einzaehlDauer(props.taktart, opts.tempo) : 0;
  const dauer = durchgangDauer(props.taktart, opts.takte, props.raster, opts.tempo);
  const ende = beginn + (Number.isFinite(lauf.durchgaenge) ? lauf.durchgaenge * dauer : Infinity);
  const queue: Ereignis[] = lauf.einzaehlen ? einzaehlEreignisse(props.taktart, opts.tempo) : [];
  let geplant = 0;
  durchgangVon.value = Number.isFinite(lauf.durchgaenge) ? lauf.durchgaenge : 1;
  durchgangDauerhaft.value = !Number.isFinite(lauf.durchgaenge);
  durchgang.value = 0;
  const t0 = uhr.jetzt() + 0.1;
  const tick = (): void => {
    const t = uhr.jetzt() - t0;
    // Durchgänge rechtzeitig nachplanen.
    while (geplant < lauf.durchgaenge && beginn + geplant * dauer <= t + VORAUS) {
      queue.push(...durchgangEreignisse(opts, geplant, beginn));
      geplant++;
    }
    while (queue.length > 0 && (queue[0]?.start ?? Infinity) <= t + VORAUS) {
      const e = queue.shift();
      if (!e) break;
      const in_ = Math.max(0, e.start - t);
      if (e.art === "ton") spiele([{ hz: 262, start: in_, dauer: 0.25, laut: 0.35 }]);
      else if (lauf.leise && e.start >= beginn)
        spiele([{ hz: e.betont ? 1500 : 1000, start: in_, dauer: 0.05, laut: 0.07, form: "square" }]);
      else klick(in_, e.betont);
    }
    const zahl = lauf.einzaehlen ? einzaehlZahl(t, props.taktart, opts.tempo) : 0;
    zahlAnzeige.value = zahl;
    const tm = t - beginn;
    if (zahl > 0) {
      if (phase.value !== "einzaehlen") phase.value = "einzaehlen";
    } else if (tm >= 0) {
      if (phase.value === "einzaehlen" || hoerenText.value === "") {
        phase.value = lauf.danZeigen ? "klatschen" : "spielt";
        hoerenText.value = lauf.danZeigen ? "Jetzt du: klatsche das Muster!" : "Hör zu";
        meldung.value = hoerenText.value;
      }
    }
    if (tm >= 0)
      durchgang.value = durchgangNr(tm, dauer, Number.isFinite(lauf.durchgaenge) ? lauf.durchgaenge : Infinity);
    laufend.value = lauf.feldZeigen ? feldImDurchgang(tm, dauer, opts.tempo, props.raster, lauf.muster.length) : -1;
    dran.value = lauf.danZeigen
      ? naechstesFeld(lauf.muster, tm, opts.tempo, props.raster, tm + dauer < ende - beginn + 1e-9 && tm >= 0)
      : -1;
    lauf.beiMessung?.(t);
    if (t >= ende + 0.15) lauf.beiEnde();
  };
  timer = uhr.alle(tick, 25);
  tick();
}

function abspielen(muster: boolean[], zeigen: boolean): void {
  if (!zeitgeber || beschaeftigt.value) return;
  abgebrochen = false;
  meldung.value = "";
  phase.value = einzaehlenAn.value ? "einzaehlen" : "spielt";
  if (einzaehlenAn.value) meldung.value = "Einzählen …";
  laufe({
    muster,
    einzaehlen: einzaehlenAn.value,
    durchgaenge: dauerWahl.value ? Infinity : wahlZahl.value,
    ton: true,
    leise: false,
    feldZeigen: zeigen,
    danZeigen: false,
    beiEnde: () => {
      aufraeumen();
      meldung.value = "";
    },
  });
}

function pruefeNachbau(): void {
  vorbildMeldung.value = nachbauText(unterschiede(felder.value, vorbildFelder.value));
}

async function ueben(): Promise<void> {
  if (!zeitgeber || beschaeftigt.value) return;
  abgebrochen = false;
  ergebnis.value = undefined;
  mikrofonFehler.value = false;
  meldung.value = "";
  const ziel = klatschZiel.value;
  if (!ziel.some((an) => an)) {
    meldung.value = "Im Muster ist kein Schlag. Tippe erst ein paar Felder an.";
    return;
  }
  phase.value = "einzaehlen";
  let mik: Mikrofon;
  try {
    mik = await oeffneMikrofon(geraete);
  } catch {
    phase.value = "ruhe";
    mikrofonFehler.value = true;
    return;
  }
  if (abgebrochen) {
    mik.stoppen();
    phase.value = "ruhe";
    return;
  }
  mikrofon = mik;
  // Beim Klatschen zählt immer eine feste Zahl von Durchgängen; „Dauerhaft“ wird zu einem Durchgang.
  const durchgaenge = wahlZahl.value;
  const beginn = einzaehlDauer(props.taktart, tempoWert.value);
  const verlauf: number[] = [];
  const fenster = Math.max(1, Math.round(mik.abtastrate * MESS_SCHRITT));
  const tempoStart = tempoWert.value;
  meldung.value = "Gleich geht’s los";
  laufe({
    muster: ziel,
    einzaehlen: true,
    durchgaenge,
    ton: false,
    leise: true,
    feldZeigen: true,
    danZeigen: !hatVorbild.value,
    beiMessung: (t) => {
      if (mikrofon) fuelleVerlauf(verlauf, MESS_SCHRITT, t, effektivwert(mikrofon.lesen(), fenster));
    },
    beiEnde: () => {
      const ist = einsaetze(verlauf, MESS_SCHRITT);
      aufraeumen();
      ergebnis.value = wertAus(ziel, ist, tempoStart, props.raster, beginn, durchgaenge);
      meldung.value = "";
    },
  });
}

// Gemessen wird im 25-ms-Takt des Zeitplans; MESS_SCHRITT (10 ms) ist die Auflösung des Verlaufs, Lücken werden gefüllt.
const ergebnisZeile = computed(() => (ergebnis.value ? ergebnisText(ergebnis.value) : ""));
const ansage = computed(() => {
  if (mikrofonFehler.value)
    return "Das Mikrofon ist nicht verfügbar. Das ist okay: Übe mit der Anleitung unter „So übst du selbst“.";
  if (meldung.value !== "") return meldung.value;
  if (ergebnis.value) return ergebnisZeile.value;
  if (vorbildMeldung.value !== "") return vorbildMeldung.value;
  return props.bearbeiten ? "Tippe die Felder: ● = Schlag, leer = Pause." : "";
});
const mehrere = computed(() =>
  ergebnis.value ? new Set(ergebnis.value.felder.map((f) => f.durchgang)).size > 1 : false,
);
</script>

<template>
  <div class="rhythmus">
    <div
      class="raster"
      role="group"
      :aria-label="`Rhythmus-Raster, ${taktart}-Takt, ${anzahlTakte} ${anzahlTakte === 1 ? 'Takt' : 'Takte'}`"
    >
      <div v-for="z in zeilen" :key="z.start" class="zeile">
        <span v-if="anzahlTakte > 1 && z.start % proTakt === 0" class="taktnr">Takt {{ z.takt }}</span>
        <div class="felder" :style="{ gridTemplateColumns: `repeat(${z.felder.length}, minmax(0, 1fr))` }">
          <div v-for="(i, k) in z.felder" :key="i" class="spalte">
            <button
              type="button"
              class="feld"
              :class="{
                an: felder[i],
                jetzt: laufend === i,
                dran: dran === i,
                schlagfeld: aufSchlag(i % proTakt, raster),
              }"
              :aria-pressed="felder[i]"
              :aria-label="feldBeschriftung(i)"
              :disabled="!bearbeiten"
              @click="umschalten(i)"
            >
              <span aria-hidden="true">{{ dran === i ? "👏" : felder[i] ? "●" : "" }}</span>
            </button>
            <span class="zaehl" :class="{ zahl: z.hilfe[k] !== '+' }" aria-hidden="true">{{ z.hilfe[k] }}</span>
          </div>
        </div>
      </div>
    </div>
    <p class="sr">Zählhilfe: {{ hilfeText }}</p>
    <p class="noten">Rhythmus: {{ notenText }}</p>

    <div v-if="zahlAnzeige > 0" class="einzaehlen" aria-hidden="true">
      <span class="gross">{{ zahlAnzeige }}</span>
      <span class="einz-text">Einzählen …</span>
    </div>
    <p class="durchgang" aria-live="polite">{{ durchgangZeile }}</p>

    <div class="knoepfe">
      <button type="button" :disabled="beschaeftigt" aria-label="Muster abspielen" @click="abspielen(felder, true)">
        ▶ Abspielen
      </button>
      <button type="button" :disabled="!beschaeftigt" aria-label="Abspielen stoppen" @click="stopp">■ Stopp</button>
      <button v-if="hatVorbild" type="button" :disabled="beschaeftigt" @click="abspielen(vorbildFelder, false)">
        Vorbild hören
      </button>
      <button v-if="hatVorbild && bearbeiten" type="button" :disabled="beschaeftigt" @click="pruefeNachbau">
        Mein Muster prüfen
      </button>
      <button v-if="bearbeiten" type="button" :disabled="beschaeftigt" @click="loeschen">Löschen</button>
    </div>
    <div class="knoepfe">
      <button
        type="button"
        :disabled="tempoWert <= TEMPO_MIN"
        aria-label="Tempo 5 langsamer"
        @click="tempoAendern(-TEMPO_SCHRITT)"
      >
        Tempo −
      </button>
      <span class="tempo" aria-live="polite">{{ tempoWert }} BPM</span>
      <button
        type="button"
        :disabled="tempoWert >= TEMPO_MAX"
        aria-label="Tempo 5 schneller"
        @click="tempoAendern(TEMPO_SCHRITT)"
      >
        Tempo +
      </button>
      <button type="button" :aria-pressed="metronomAn" @click="metronomAn = !metronomAn">
        {{ metronomAn ? "Metronom an" : "Metronom aus" }}
      </button>
    </div>
    <div class="knoepfe">
      <label class="wahl">
        <span>Wie oft?</span>
        <select v-model="wahl" :disabled="beschaeftigt">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="dauer">Dauerhaft</option>
        </select>
      </label>
      <label class="wahl">
        <input v-model="einzaehlenAn" type="checkbox" :disabled="beschaeftigt || klatschen" />
        <span>Einzählen</span>
      </label>
    </div>
    <Lautstaerke />

    <div v-if="klatschen" class="mikro">
      <div class="anleitung">
        <p class="fett">So läuft die Übung:</p>
        <ol>
          <li>Du hörst einen Takt lang Klicks. Das ist das Einzählen: Es zeigt dir das Tempo.</li>
          <li>Danach klatschst du das Muster. Dunkle Felder klatschst du, bei hellen Feldern bleibst du still.</li>
          <li>Am Ende siehst du, wie viele Schläge du getroffen hast.</li>
        </ol>
      </div>
      <button type="button" :disabled="beschaeftigt" @click="ueben">🎤 Mit Klatschen üben</button>
      <p v-if="dauerWahl" class="hinweis">Beim Klatschen zählt ein Durchgang.</p>
      <p class="hinweis">Tipp: Das Metronom kann das Mikrofon stören. Schalte es beim Klatschen auf leise oder aus.</p>
      <p class="hinweis">Das Mikrofon hört nur im Browser zu. Nichts wird gespeichert oder gesendet.</p>
    </div>

    <p class="ansage" role="status" aria-live="polite">{{ ansage }}</p>

    <ul v-if="ergebnis && ergebnis.felder.length > 0" class="treffer" aria-label="Ergebnis je Feld">
      <li v-for="(f, n) in ergebnis.felder" :key="n" :class="f.getroffen ? 'gut' : 'fehlt'">
        <span aria-hidden="true">{{ f.getroffen ? "✓" : "✗" }}</span>
        {{ mehrere ? `Durchgang ${f.durchgang}, ` : "" }}{{ feldName(f.index, taktart, raster) }}:
        {{ f.getroffen ? "getroffen" : "gefehlt" }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rhythmus {
  max-width: 100%;
  color: var(--page-text);
}
.raster {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.taktnr {
  display: block;
  font-size: 0.85rem;
  color: var(--page-muted);
}
.felder {
  display: grid;
  gap: 4px;
}
.spalte {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
}
.feld {
  min-height: 48px;
  min-width: 0;
  padding: 0;
  border: 2px solid var(--page-text);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
  font: inherit;
  cursor: pointer;
}
.feld.an {
  background: var(--page-accent);
  color: var(--page-on-accent);
}
.feld:not(.schlagfeld) {
  border-style: dashed;
}
.feld.jetzt {
  outline: 4px solid var(--page-text);
  outline-offset: 1px;
  border-width: 4px;
}
.feld:disabled {
  cursor: default;
  opacity: 1;
}
.feld:focus-visible,
.knoepfe button:focus-visible,
.mikro button:focus-visible {
  outline: 3px solid var(--page-accent);
  outline-offset: 2px;
}
.feld.dran {
  outline: 4px dashed var(--page-accent);
  outline-offset: 2px;
  font-size: 1.4rem;
}
.einzaehlen {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  padding: 0.4rem 0.8rem;
  border: 3px solid var(--page-text);
  border-radius: 8px;
}
.gross {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  min-width: 2.5rem;
  text-align: center;
}
.einz-text {
  font-size: 1.2rem;
  font-weight: 700;
}
.durchgang {
  min-height: 1.4em;
  margin: 0.25rem 0;
}
.wahl {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
}
.wahl select {
  min-height: 44px;
  font: inherit;
  padding: 0 0.5rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
}
.wahl input {
  width: 1.4rem;
  height: 1.4rem;
}
.anleitung {
  margin-bottom: 0.6rem;
  padding: 0.5rem 0.8rem;
  border-left: 4px solid var(--page-accent);
  background: var(--page-surface);
}
.anleitung p,
.anleitung ol {
  margin: 0.2rem 0;
}
.anleitung ol {
  padding-left: 1.3rem;
}
.fett {
  font-weight: 700;
}
.zaehl {
  text-align: center;
  color: var(--page-muted);
  min-height: 1.4em;
}
.zaehl.zahl {
  font-weight: 700;
  color: var(--page-text);
}
.noten {
  margin: 0.6rem 0;
}
.knoepfe {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.knoepfe button,
.mikro button {
  min-height: 44px;
  font: inherit;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
  background: var(--page-surface);
  color: var(--page-text);
  cursor: pointer;
}
.knoepfe button[aria-pressed="true"] {
  border: 2px solid var(--page-accent);
}
.knoepfe button:disabled,
.mikro button:disabled {
  opacity: 0.55;
  cursor: default;
}
.tempo {
  min-width: 5.5rem;
  text-align: center;
  font-weight: 600;
}
.mikro {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: 1px solid var(--page-border);
  border-radius: 6px;
}
.hinweis {
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
  color: var(--page-muted);
}
.ansage {
  min-height: 1.5em;
  margin: 0.5rem 0;
  font-weight: 600;
}
.treffer {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.treffer li {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--page-border);
}
.treffer .gut {
  background: var(--page-right-background);
}
.treffer .fehlt {
  background: var(--page-wrong-background);
}
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { lautstaerke, setzeLautstaerke } from "./Klang.ts";
import { lautstaerkeAnsage, lautstaerkeWort } from "./Lautstaerke.ts";

// Ein Regler für die Lautstärke der ganzen App: Er gilt für alle Töne und alle Komponenten auf der Seite.
const wort = computed(() => lautstaerkeWort(lautstaerke.value));
const ansage = computed(() => lautstaerkeAnsage(lautstaerke.value));

function aendern(e: Event): void {
  setzeLautstaerke(Number((e.target as HTMLInputElement).value));
}
</script>

<template>
  <label class="lautstaerke">
    <span class="titel">Lautstärke</span>
    <input type="range" min="0" max="100" step="1" :value="lautstaerke" :aria-valuetext="ansage" @input="aendern" />
    <span class="wert">{{ wort }}, {{ lautstaerke }} %</span>
  </label>
</template>

<style scoped>
.lautstaerke {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.75rem;
  margin: 0.5rem 0;
}
.titel {
  font-weight: 600;
}
input[type="range"] {
  flex: 1 1 8rem;
  min-width: 7rem;
  min-height: 44px;
  accent-color: var(--page-accent);
}
.wert {
  min-width: 7rem;
  color: var(--page-muted);
}
</style>

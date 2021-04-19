<template>
  <div class="notebook">
    <svg id="page" ref="page" xmlns="http://www.w3.org/2000/svg" :width="width" 
      :height="height" :viewbox="'0 0 ' + width + ' ' + height">

      <background-layer />

      <pen-layer ref="penlayer"/>
      <highlighter-layer ref="highlighterlayer"/>
      <latex-layer ref="latexlayer"/>

      <eraser-layer ref="eraserlayer"/>
      <selection-layer ref="selectionlayer"/>
      <drag-layer ref="draglayer"/>

      <laser-layer ref="laserlayer"/>
    </svg>

    <transition name="fade">
      <div v-if="splash" class="splash" @click.prevent="splash = false">
        <img src="@/assets/logo.png"/>
        <h1>Scribor</h1>
        <p>Version 1.0.0 (1.0.0)</p>
        <p>Copyright © 2021 Mattia Bruno </p>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import PenLayer from '../components/PenLayer.vue';
import HighlighterLayer from '@/components/HighlighterLayer'
import EraserLayer from '@/components/EraserLayer'
import BackgroundLayer from '../components/BackgroundLayer.vue';
import pointertools from '@/hooks/pointertools';
import store from '../hooks/store'
import SelectionLayer from '../components/SelectionLayer.vue';
import DragLayer from '../components/DragLayer.vue';
import LatexLayer from '../components/LatexLayer.vue';
import LaserLayer from '../components/LaserLayer.vue';

export default {
  components: {
    PenLayer,
    HighlighterLayer,
    LatexLayer,
    EraserLayer,
    BackgroundLayer,
    SelectionLayer,
    DragLayer,
    LaserLayer
  },
  setup() {
    const page = ref(null);
    const penlayer = ref(null);
    const highlighterlayer = ref(null);
    const latexlayer = ref(null);
    const eraserlayer = ref(null);
    const selectionlayer = ref(null);
    const draglayer = ref(null);
    const laserlayer = ref(null);

    const width = computed(() => {return store.viewport.width * store.viewport.scale});
    const height = computed(() => {return store.viewport.height * store.viewport.scale});

    const layers = {
      'drag': draglayer,
      'selection': selectionlayer,
      'pen': penlayer,
      'highlighter': highlighterlayer,
      'latex': latexlayer,
      'eraser': eraserlayer,
      'laser': laserlayer
    };

    watch(store.mode, (newmode, oldmode) => {
      if (oldmode in layers) {
        layers[oldmode].value.off();
      }
      if (newmode in layers) {
        layers[newmode].value.on();
      }
    });

    const splash = ref(true);

    onMounted(() => {
      pointertools.init(page.value);
    });

    return {
      page,
      penlayer,
      highlighterlayer,
      latexlayer,
      eraserlayer,
      selectionlayer,
      draglayer,
      laserlayer,
      width,
      height,
      splash
    }
  }
}
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.notebook {
  background-color: var(--background);
  padding: 1rem;
  overflow: auto;
  display: inline-block;
  max-height: 100%;
  max-width: 100%;
}

.splash {
  background-color: var(--background);
  border-radius: 1rem;
  border: 2px solid var(--focus);
  top: calc(100% / 2 - 10rem);
  left: calc(100% / 2 - 10rem);
  height: fit-content;
  width: 20rem;
  position: absolute;
  z-index: 1;
}

.splash img {
  margin-top: 1rem;
  width: 70%;
}

.splash h1, p {
  color: var(--text);
}

</style>
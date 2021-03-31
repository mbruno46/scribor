<template>
  <div ref="div" class="notebook">
    <svg ref="page" xmlns="http://www.w3.org/2000/svg" :width="width" 
        :height="height" :viewbox="'0 0 ' + width + ' ' + height">
        <background-layer :width="width" :height="height" />
        <pen-layer ref="penlayer"/>
        <highlighter-layer ref="highlighterlayer"/>
        <eraser-layer ref="eraserlayer"/>
    </svg>
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

export default {
  components: {
    PenLayer,
    HighlighterLayer,
    EraserLayer,
    BackgroundLayer
  },
  setup() {
    const div = ref(null);
    const page = ref(null);
    const penlayer = ref(null);
    const highlighterlayer = ref(null);
    const eraserlayer = ref(null);
    var mode = store.mode;
    
    const viewport = ref({
      width: 595,
      height: 842,
      realwidth: 210, //mm
      scale: 1
    });

    const width = computed(() => {return viewport.value.width * viewport.value.scale});
    const height = computed(() => {return viewport.value.height * viewport.value.scale});

    function rescale(factor) {
      viewport.value.scale *= factor;
      pointertools.setScale(viewport.value.scale);
    }

    const layers = new Map([
      ['pen', penlayer],
      ['highlighter', highlighterlayer],
      ['eraser',eraserlayer]
    ]);

    watch(mode, (newmode, oldmode) => {
      layers.forEach(function(v,k) {
        if (oldmode==k) {v.value.off(page.value);}
        if (newmode==k) {v.value.on(page.value);}
      });
    });

    onMounted(() => {
      pointertools.init(page.value);
    });

    return {
      div,
      page,
      penlayer,
      highlighterlayer,
      eraserlayer,
      width,
      height,
      rescale
    }
  }
}
</script>


<style scoped>
.notebook {
  background-color: var(--background);
  padding: 1rem;
  overflow: auto;
  display: inline-block;
  height: calc(100vh - 4rem - 4rem);
  max-width: 100%;
}
</style>
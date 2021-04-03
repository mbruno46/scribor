<template>
  <div class="notebook">
    <svg id="page" ref="page" xmlns="http://www.w3.org/2000/svg" :width="width" 
      :height="height" :viewbox="'0 0 ' + width + ' ' + height">

      <cover-page v-if="pages.focus==0" />
      <background-layer v-if="pages.focus>0" />

      <pen-layer ref="penlayer"/>
      <highlighter-layer ref="highlighterlayer"/>
      <eraser-layer ref="eraserlayer"/>
      <selection-layer ref="selectionlayer"/>
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
import SelectionLayer from '../components/SelectionLayer.vue';
import CoverPage from '../components/CoverPage.vue';

export default {
  components: {
    PenLayer,
    HighlighterLayer,
    EraserLayer,
    BackgroundLayer,
    SelectionLayer,
    CoverPage
  },
  data() {
    return {
      pages: store.pages
    }
  },
  setup() {
    const page = ref(null);
    const penlayer = ref(null);
    const highlighterlayer = ref(null);
    const eraserlayer = ref(null);
    const selectionlayer = ref(null);
    //  mode = store.mode;
    
    // const viewport = ref({
    //   width: 595,
    //   height: 842,
    //   realwidth: 210, //mm
    //   scale: 1
    // });

    const width = computed(() => {return store.viewport.width * store.viewport.scale});
    const height = computed(() => {return store.viewport.height * store.viewport.scale});

    // function rescale(factor) {
    //   viewport.value.scale *= factor;
    //   pointertools.setScale(viewport.value.scale);
    // }

    const layers = new Map([
      ['selection',selectionlayer],
      ['pen', penlayer],
      ['highlighter', highlighterlayer],
      ['eraser',eraserlayer]
    ]);

    watch(store.mode, (newmode, oldmode) => {
      layers.forEach(function(v,k) {
        if (oldmode==k) {v.value.off(page.value);}
        if (newmode==k) {v.value.on(page.value);}
      });
    });

    onMounted(() => {
      pointertools.init(page.value);
    });

    return {
      page,
      penlayer,
      highlighterlayer,
      eraserlayer,
      selectionlayer,
      width,
      height
      // rescale
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
  max-height: 100%;
  max-width: 100%;
}
</style>
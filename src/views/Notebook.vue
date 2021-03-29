<template>
  <div ref="div" class="notebook">
    <svg ref="page" xmlns="http://www.w3.org/2000/svg" :width="width" 
        :height="height" :viewbox="'0 0 ' + width + ' ' + height">
        <g id="layer-bg">
            <rect x="0" y="0" :width="width" :height="height" fill="white"/>
            <!-- <path v-if="ig>0" :d="d" fill="black"/> -->
        </g>
        <pen-layer ref="penlayer"/>
        <highlighter-layer ref="highlighterlayer"/>
    </svg>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import PenLayer from '../components/PenLayer.vue';
import HighlighterLayer from '@/components/HighlighterLayer'
import pointertools from '@/hooks/pointertools';

export default {
  components: {
    PenLayer,
    HighlighterLayer
  },
  setup() {
    const div = ref(null);
    const page = ref(null);
    const penlayer = ref(null);
    const highlighterlayer = ref(null);
    const mode = ref('');

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

    watch(mode, (newmode, oldmode) => {
      console.log(oldmode, ' --> ',newmode);

      if (oldmode=='pen') {
        penlayer.value.off(page.value)
      } else if (oldmode=='highlighter') {
        highlighterlayer.value.off(page.value);
      }

      if (newmode=='pen') {
        penlayer.value.on(page.value);
      } else if (newmode=='highlighter') {
        highlighterlayer.value.on(page.value);
      }
    })

    onMounted(() => {
      let box = page.value.getBoundingClientRect()
      pointertools.setOfs(box.x, box.y);
    });

    return {
      div,
      page,
      penlayer,
      highlighterlayer,
      width,
      height,
      rescale,
      mode
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
  width: 100%;
}
</style>
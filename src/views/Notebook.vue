<template>
  <div ref="div" class="notebook">
    <svg ref="page" xmlns="http://www.w3.org/2000/svg" :width="width" 
        :height="height" :viewbox="'0 0 ' + width + ' ' + height">
        <g id="layer-bg">
            <rect x="0" y="0" :width="width" :height="height" fill="white"/>
            <!-- <path v-if="ig>0" :d="d" fill="black"/> -->
        </g>
        <pen-layer ref="penlayer"/>
    </svg>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import PenLayer from '../components/PenLayer.vue';
import pointertools from '@/hooks/pointertools';

export default {
  components: {
    PenLayer
  },
  setup() {
    const div = ref(null);
    const page = ref(null);
    const penlayer = ref(null);

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

    function setDrawingMode(mode) {
      if (mode=='pen') {penlayer.value.on(page.value);}
    }

    onMounted(() => {
      let box = page.value.getBoundingClientRect()
      pointertools.setOfs(box.x, box.y);
    });

    return {
      div,
      page,
      penlayer,
      width,
      height,
      rescale,
      setDrawingMode
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
  height: calc(100vh - 5rem - 4rem);
  width: 100%;
}
</style>
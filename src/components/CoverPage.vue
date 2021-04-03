<template>
  <g id="cover-page" :transform="`scale(${v.scale} ${v.scale})`">
    <rect x="0" y="0" :width="v.width" :height="v.height" :fill="bgc"/>

    <path :d="rpath" fill='white' stroke='black' stroke-width="2" />
    <path v-for="(r,i) in hrules" :d="r" :key="i" class="rule hrule" />

    <!-- <path :d="graphics.d" :fill="graphics.fill" :stroke="graphics.stroke" /> -->
  </g>
</template>

<script>
import store from '../hooks/store'
import { ref, computed } from '@vue/runtime-core'
import { RectAsPath } from '@/hooks/utils'

const rect = [90,90,595-2*90,120,10];
const nlines = 2;
const layout_hrule = 20;

const colorMap = {blue: ['var(--cover-page-blue)','yellow','red']};

export default {
  props: ['width', 'height'],
  data() {
    return {
      v: store.viewport
    }
  },
  setup() {
    const bgc = computed(() => {return colorMap[store.background.value.color][0];});

    const graphics = computed(() => {
      let c = c;
      return {
        d: '',
        fill: colorMap[c.color][1],
        stroke: colorMap[c.color][2]
      }
    })

    const rpath = ref('');
    rpath.value = RectAsPath(rect[0],rect[1],rect[2],rect[3],rect[4],rect[4]);
    const hrules = ref([]);
    for (var i=0;i<nlines;i++) {
      hrules.value.push('m' + (rect[0]+rect[4]) + ' ' + 
        (rect[1]+2*layout_hrule*(i+1)) + 'h' + (rect[2]-2*rect[4]));
    }
    return {
      bgc,
      graphics,
      rpath,
      hrules
    }
  },
}
</script>

<style scoped>
.rule {
  stroke-width: 0.4;
  fill: none;
}

.hrule {
  stroke: var(--hrule);
}
</style>
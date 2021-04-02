<template>
  <g id="cover-page">
    <rect x="0" y="0" :width="width" :height="height" :fill="bgc"/>

    <!-- <path :d="rpath" fill='white' stroke='black' stroke-width="2" /> -->

    <!-- <path :d="graphics.d" :fill="graphics.fill" :stroke="graphics.stroke" /> -->
  </g>
</template>

<script>
import store from '../hooks/store'
import { ref, computed } from '@vue/runtime-core'

// const label = [90,90,595-2*90,120,10];
// const nlines = 2;

const colorMap = {blue: ['var(--cover-page-blue)','yellow','red']};

export default {
  props: ['width', 'height'],
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
    // rpath.value = RectAsPath(d[0],d[1],d[2],d[3],d[4],d[4]));

    return {
      bgc,
      graphics,
      rpath
    }
  },
}
</script>
<template>
  <g id="penstrokes" :transform="`scale(${v.scale} ${v.scale})`">
    <path v-for="(stroke,index) in strokes" 
      :key="'penstrokes:' + index"
      :id="'penstrokes:' + index"
      :d="stroke.d"
      :stroke="`var(--pen-color-${stroke.color})`"
      :stroke-width="stroke.size"
      class="strokes"
      :class="(selection.includes(index)) ? 'selected' : ''"
    />
  </g>
</template>

<script>
import Stroke from '@/hooks/strokes'
import pointertools from '@/hooks/pointertools';
import store from '@/hooks/store'
import { computed } from '@vue/runtime-core';

export default {
  data() {
    return {
      v: store.viewport
    }
  },
  setup() {
    // const strokes = store.penstrokes;

    const { init, start, move, end } = Stroke();
    const { on, off } = pointertools.layer(start, move, end);

    const selection = store.selection.value.penstrokes;
    const strokes = computed(()=>{
      let s = store.notebook[store.pages.focus].penstrokes;
      init(s);
      return s;
    });

    return {
      strokes,
      on,
      off,
      selection
    }
  },
}
</script>

<style scoped>
.strokes {
  fill: none;
  stroke-linecap: round;
}

.selected {
  stroke: grey;
  stroke-dasharray: 4;
}
</style>
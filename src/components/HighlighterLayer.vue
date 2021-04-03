<template>
  <g id="highlighterstrokes" :transform="`scale(${v.scale} ${v.scale})`">
    <path v-for="(stroke,index) in strokes" 
      :key="'highlighterstrokes:' + index"
      :id="'highlighterstrokes:' + index"
      :d="stroke.d"
      :stroke="`var(--pen-color-${stroke.color})`"
      class="highlighter"
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
    const selection = store.selection.value.highlighterstrokes;

    const { init, start, move, end } = Stroke();
    const { on, off } = pointertools.layer(start, move, end);

    const strokes = computed(()=>{
      let s = store.notebook[store.pages.focus].highlighterstrokes;
      init(s);
      return s;
    });

    return {
      strokes,
      selection,
      on,
      off
    }
  },
}
</script>

<style scoped>
.highlighter {
  fill: none;
  stroke-width: 16;
  stroke-linecap: round;
  opacity: 0.7;
}

.selected {
  stroke: grey;
}
</style>
<template>
  <g id="highlighterstrokes">
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
import initStroke from '@/hooks/strokes'
import pointertools from '@/hooks/pointertools';
import store from '@/hooks/store'

export default {
  setup() {
    const strokes = store.highlighterstrokes;
    const selection = store.selection.value.highlighterstrokes;

    const { start, move, end } = initStroke(strokes.value);
    const { on, off } = pointertools.layer(start, move, end);

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
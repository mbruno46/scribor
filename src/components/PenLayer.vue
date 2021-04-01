<template>
  <g id="penstrokes">
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
import initStroke from '@/hooks/strokes'
import pointertools from '@/hooks/pointertools';
import store from '@/hooks/store'

export default {
  setup() {
    const strokes = store.penstrokes;
    const selection = store.selection.value.penstrokes;

    const { start, move, end } = initStroke(strokes.value);
    const { on, off } = pointertools.layer(start, move, end);

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
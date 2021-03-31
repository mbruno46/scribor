<template>
  <g id="penlayer">
    <path v-for="(stroke,index) in strokes" 
      :key="'penstrokes:' + index"
      :id="'penstrokes:' + index"
      :d="stroke.d"
      :stroke="`var(--pen-color-${stroke.color})`"
      :stroke-width="stroke.size"
      class="strokes"
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

    const { start, move, end } = initStroke(strokes.value);
    const { on, off } = pointertools.layer(start, move, end);

    return {
      strokes,
      on,
      off
    }
  },
}
</script>

<style scoped>
.strokes {
  fill: none;
  stroke-linecap: round;
}
</style>
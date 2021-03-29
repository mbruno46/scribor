<template>
  <g id="layer-highlighter">
    <path v-for="(stroke,index) in strokes" 
      :key="'highlighterstrokes:' + index"
      :id="'highlighterstrokes:' + index"
      :d="stroke.d"
      :stroke="stroke.color"
      class="highlighter"
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
.highlighter {
  fill: none;
  stroke-width: 16;
  stroke-linecap: round;
  opacity: 0.7;
}
</style>
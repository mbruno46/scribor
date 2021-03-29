<template>
  <g id="layer-pen">
    <path v-for="(stroke,index) in penstrokes" 
      :key="'penstroke-' + index"
      :d="stroke.d"
      :stroke="stroke.color"
      :stroke-width="stroke.size"
      class="strokes"
    />
  </g>
</template>

<script>
import initStroke from '@/hooks/strokes'
import pointertools from '@/hooks/pointertools';
import _ from 'lodash'

export default {
  setup() {
    const { penstrokes, start, move, end } = initStroke();

    function throttled_move(e) {
      _.throttle(move(e), 16);
    }

    function on(p) {
      pointertools.pointerEventListener('down', p, start, true);
      pointertools.pointerEventListener('move', p, throttled_move, true);
      pointertools.pointerEventListener('up leave', p, end, true);
    }

    function off(p) {
      pointertools.pointerEventListener('down', p, start, false);
      pointertools.pointerEventListener('move', p, throttled_move, false);
      pointertools.pointerEventListener('up leave', document, end, false);
    }

    return {
      penstrokes,
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
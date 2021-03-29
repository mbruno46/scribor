<template>
  <g id="layer-highlighter">
    <path v-for="(stroke,index) in penstrokes" 
      :key="'highlighter-' + index"
      :d="stroke.d"
      :stroke="stroke.color"
      class="highlighter"
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

    var throttled_move = _.throttle(move, 16);

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
.highlighter {
  fill: none;
  stroke-width: 16;
  stroke-linecap: round;
  opacity: 0.7;
}
</style>
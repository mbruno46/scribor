<template>
  <g id="laser" :transform="`scale(${v.scale} ${v.scale})`">
    <path :d="strokes[0].d"   stroke="red"
      stroke-width='8' class="laser"/>
    <path :d="strokes[0].d"   stroke="yellow"
      stroke-width='4' class="laser"/>  </g>  
</template>

<script>
import Stroke from '@/hooks/strokes'
import pointertools from '@/hooks/pointertools';
import store from '@/hooks/store'
import { ref, watch } from 'vue'

export default {
  data() {
    return {
      v: store.viewport
    }
  },
  setup() {
    const strokes = ref([{id:0, d:'',color:'',size:0}]);

    const { init, start, move, end } = Stroke();

    function end2(e) {
      end(e);
      if (strokes.value.length==2) {
        strokes.value.pop();
      }
    }
    const { on, off } = pointertools.layer(start, move, end2);

    watch(
      ()=>store.mode.value,
      ()=>{strokes.value[0].d='';}
    )
    init(strokes.value);

    return {
      strokes,
      on,
      off
    }    
  },
}
</script>

<style scoped>
.laser {
  opacity: 0.5;  
  fill: none;
  stroke-linecap: round;
}
</style>
<template>
  <g id="layer-selection" :transform="`scale(${v.scale} ${v.scale})`">
    <rect :x="box.x" :y="box.y" :width="box.width" :height="box.height" class="selection-box"/>
  </g>
</template>

<script>
import { ref } from 'vue'
import pointertools from '@/hooks/pointertools'
import store from '@/hooks/store'
import { pathBBox } from '../hooks/utils'

function select(array, selbox, sel) {
  array.forEach((element,index) => {
    let bbox = pathBBox(element.d);

    if (bbox.x>=selbox.x && bbox.y>=selbox.y &&
      (bbox.width+bbox.x)<=(selbox.width+selbox.x) &&
      (bbox.height+bbox.y)<=(selbox.height+selbox.y)) {
        if (!sel.includes(index)) {
          sel.push(index);
        }
      }
  });
}


export default {
  data() {
    return {
      v: store.viewport
    }
  },
  setup() {
    var selecting = false;
    var origin;
    const box = ref({x:0,y:0,width:0,height:0});
    
    function start(e) {
      e = e || e.originalEvent || window.event;
      if (e.target.parentElement.parentElement.id!="page") {return;}
      e.preventDefault();

      selecting = true;
      let p = pointertools.position(e);
      origin = [p.x, p.y];
      box.value.x = origin[0];
      box.value.y = origin[1];
      box.value.width = 0;
      box.value.height = 0;
    }

    function move(e) {
      if (!selecting) {return;}

      let p = pointertools.position(e);
      box.value.x = (p.x > origin[0]) ? origin[0] : p.x;
      box.value.y = (p.y > origin[1]) ? origin[1] : p.y;
      box.value.width = Math.abs(p.x - origin[0]);
      box.value.height = Math.abs(p.y - origin[1]);
    }

    function end() {
      for (var layer in store.layers.value) {
        if (store.layers.value[layer]) {
          select(store[layer].value, box.value, store.selection[layer]);
        }
      }
      selecting = false;
      box.value.width = 0;
      box.value.height = 0;
    }

    const {on, off} = pointertools.layer(start, move, end);

    return {
      box,
      on,
      off
    }
  }
}
</script>


<style scoped>
.selection-box {
  fill: gray;
  fill-opacity: 0.3;
  stroke: black;
  stroke-width: 0.5;
  stroke-dasharray: 4;
}
</style>
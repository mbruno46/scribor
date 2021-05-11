<template>
  <g id="images" :transform="`scale(${v.scale} ${v.scale})`">
     <image v-for="(img,index) in images"
      :key="'images:' + index"
      :id="'images:' + index"
      :href="img.url"
      :x="img.x" :y="img.y"
      :width="img.width" :height="img.height" 
      :class="(selection.includes(index)) ? 'selected' : ''"
      />
  </g>
</template>

<script>
import store from '@/hooks/store'
import Drag from '@/hooks/dragtools'
import pointertools from '@/hooks/pointertools';

export default {
  data() {
    return {
      v: store.viewport,
    }
  },
  setup() {
    const images = store.images;
    const selection = store.selection.images;

    const {start, move, end, shift, targets} = Drag();

    function resize() {
      let t = targets();

      for (var i=0;i<t.length;i++) {
        let tags = t[i].id.split(':');
        if (tags[0]=='images') {
          let img = images.value[tags[1]];
          img.width += shift().dx;
          img.height = Math.round(img.ratio * img.width);
        }
      }
    }

    function move_callback(e) {move(e,resize);}

    const { on, off } = pointertools.layer(start, move_callback, end);

    return {
      images,
      selection,
      on,
      off,
    }
  },
}
</script>

<style scoped>
.selected {
  filter: drop-shadow(0px 0px 8px black);
}
</style>
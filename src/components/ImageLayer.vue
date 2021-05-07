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

export default {
  data() {
    return {
      v: store.viewport,
    }
  },
  setup() {
    const images = store.images;
    const selection = store.selection.images;

    function on() {
      console.log('on');
    }

    function off() {
      console.log('off');
    }

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
  stroke: grey;
  stroke-dasharray: 4;
}
</style>
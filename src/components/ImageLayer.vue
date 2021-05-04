<template>
  <g id="images" :transform="`scale(${v.scale} ${v.scale})`">
     <image v-for="(img,index) in images"
      :key="'image:' + index"
      :id="'image:' + index"
      :href="img.url"
      :x="img.x" :y="img.y"
      :width="img.width" :height="img.height" />
  </g>
</template>

<script>
import store from '@/hooks/store'

export default {
  data() {
    return {
      v: store.viewport,
      images: store.images
    }
  },
  // setup() {
  // },
}
</script>
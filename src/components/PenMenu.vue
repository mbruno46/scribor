<template>
  <context-menu :pos="pos">
    <span style="color: var(--text)">Color</span>
    <div>
      <app-button icon="fa-square" v-for="(c) in colorMap"
        :id="c" :key="c" :style="`color: ${c}`" @click="setColor(c)"
      />
    </div>
    <span style="color: var(--text)">Size</span>
    <div>
      <app-button v-for="(s) in sizeMap"
        :icon="`fa-slash fa-${s[1]}`" :id="s[0]" :key="s[0]" @click="setSize(s[2])"
      />
    </div>
  </context-menu>
</template>

<script>
import AppButton from './AppButton.vue'
import ContextMenu from './ContextMenu.vue'
import store from '../hooks/store'

export default {
  components: { ContextMenu, AppButton },
  props: ['pos'],
  data() {
    return {
      colorMap: ['var(--pen-color-blue)','var(--pen-color-red)','black'],
      sizeMap: [
        ['thin', 'xs', 1],
        ['medium', 'sm', 2],
        ['large', 'lg', 3]
      ]
    }
  },
  methods: {
    setColor(c) {
      let ps = store.penstrokes.value;
      ps[ps.length-1].color = c;
    },
    setSize(s) {
      let ps = store.penstrokes.value;
      ps[ps.length-1].size = s;
    }
  }
}
</script>

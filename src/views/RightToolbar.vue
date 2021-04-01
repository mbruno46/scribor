<template>
  <div class="toolbar">
    <div v-if="mode=='pen'">
      <app-button icon="fa-square" v-for="(c) in colorMap"
        :key="c" :style="`color: var(--pen-color-${c})`" 
        :control="stroke.color==c" 
        @click="setColor(c)"
      />
      <app-button v-for="(s) in sizeMap"
        :icon="`fa-slash ${s[1]}`" :id="s[0]" :key="s[0]" 
        :control="stroke.size==s[2]"
        @click="setSize(s[2])"
      />
    </div>

    <div v-if="mode=='highlighter'">
      <app-button icon="fa-square" v-for="(c) in colorMap2"
        :key="c" :style="`color: var(--pen-color-${c})`"
        :control="stroke.color==c" 
        @click="setColor(c)"
      />
    </div>

    <div v-if="(mode=='eraser')||(mode=='selection')">
      <app-button v-for="(l) in layerMap"
        :key="l[0]" :icon="l[1]" :control="layers[l[0]]" @click="setLayers(l[0])"
      />      
    </div>

  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import AppButton from '../components/AppButton'
import store from '../hooks/store'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      colorMap: ['blue','red','black'],
      sizeMap: [
        ['thin', 'fa-xs', 1],
        ['medium', 'fa-sm', 2],
        ['large', 'fa-lg', 3]
      ],
      colorMap2: ['orange','yellow','cyan','green'],
      layerMap: [
        ['penstrokes','fa-pen-fancy'],
        ['highlighterstrokes','fa-highlighter']
      ],
      layers: store.layers
    }
  },
  setup() {
    const mode = store.mode;
    const stroke = computed(()=>{
      var s;
      if (mode.value=='pen') {
        s = store.penstrokes.value;
      } else {
        s = store.highlighterstrokes.value;
      }
      return s[s.length-1];
    });

    return {
      mode,
      stroke
    }
  },
  methods: {
    setColor(c) {
      var s;
      if (this.mode=='pen') {
        s = store.penstrokes.value;
      } else {
        s = store.highlighterstrokes.value;
      }
      s[s.length-1].color = c;
    },
    setSize(s) {
      let ps = store.penstrokes.value;
      ps[ps.length-1].size = s;
    },
    setLayers(l) {
      let ll = store.layers.value;
      ll[l] = !ll[l];
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-flow: column;
  /* width: 3rem; */
}
</style>

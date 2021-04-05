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

    <div v-if="mode=='selection'" class="bottom">
      <app-button icon="fa-cut" />
      <app-button icon="fa-copy" />
      <app-button icon="fa-paste" />
    </div>

    <div v-if="mode=='latex'">
      <app-button icon="fa-square" v-for="(c) in colorMap"
        :key="c" :style="`color: var(--pen-color-${c})`"
        :control="stroke.color==c" 
        @click="setColor(c)"
      />
      <app-button v-for="(s) in scaleMap"
        :icon="`fa-text-height ${s[1]}`" :id="s[0]" :key="s[0]" 
        :control="stroke.scale==s[2]"
        @click="setScale(s[2])"
      />
    </div>

    <div v-if="mode=='coverprefs'">
      <app-button icon="fa-square" v-for="(c) in colorMap3"
        :key="c" :style="`color: var(--cover-page-${c})`"
        :control="bg.color==c"
        @click="()=>{bg.color = c}"
      />
      <app-button v-for="(i) in [0,1,2]"
        :key="'style:' + i" :icon="styleMap[i]"
        :control="bg.style==i"
        @click="()=>{bg.style = i}"
      />
    </div>

    <div v-if="mode=='pageprefs'">
      <app-button icon="fa-square" style="color: white"
        :control="bg.color=='white'"
        @click="()=>{bg.color='white'}"
      />
      <app-button icon="fa-square" style="color: var(--page)"
        :control="bg.color=='var(--page)'"
        @click="()=>{bg.color='var(--page)'}"
      />
      <app-button icon="fa-grip-lines" 
        :control="bg.style=='ruled'"
        @click="()=>{bg.style='ruled'}"
      />
      <app-button icon="fa-border-all" 
        :control="bg.style=='grid'"
        @click="()=>{bg.style='grid'}"
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
      colorMap3: ['blue','green','red'],
      layerMap: [
        ['penstrokes','fa-pen-fancy'],
        ['highlighterstrokes','fa-highlighter'],
        ['latex','fa-i-cursor']
      ],
      scaleMap: [
        ['thin', 'fa-xs', 1],
        ['medium', 'fa-sm', 2],
        ['large', 'fa-lg', 3]        
      ],
      styleMap: ['','fa-image','fa-image'],
      layers: store.layers,
      bg: store.background
    }
  },
  setup() {
    const mode = store.mode;
    const stroke = computed(()=>{
      var s;
      if (mode.value=='pen') {
        s = store.penstrokes.value;
      } else if (mode.value=='highlighter') {
        s = store.highlighterstrokes.value;
      } else if (mode.value=='latex') {
        s = store.latex.value;
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
      } else if (this.mode=='highlighter') {
        s = store.highlighterstrokes.value;
      } else if (this.mode=='latex') {
        s = store.latex.value;
      }
      s[s.length-1].color = c;
    },
    setSize(s) {
      let ps = store.penstrokes.value;
      ps[ps.length-1].size = s;
    },
    setScale(s) {
      let l = store.latex.value;
      l[l.length-1].scale = s;
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
  width: 3rem;
}

.bottom {
  margin-top: auto;
}
</style>

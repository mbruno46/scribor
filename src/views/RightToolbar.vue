<template>
  <div class="toolbar">
    <div v-if="mode=='pen'">
      <app-button icon="fa-square" v-for="(c) in colorMap"
        :key="c" :style="`color: var(--pen-color-${c})`"
        aria-label="`pen-color-${c}`"
        :control="stroke.color==c" 
        @click="setColor(c)"
      />
      <app-button v-for="(s) in sizeMap"
        :icon="`fa-slash ${s[1]}`" aria-label="s[0]" :key="s[0]" 
        :control="stroke.size==s[2]"
        @click="setSize(s[2])"
      />
    </div>

    <div v-if="mode=='highlighter'">
      <app-button icon="fa-square" v-for="(c) in colorMap2"
        :key="c" :style="`color: var(--pen-color-${c})`"
        aria-label="`hlight-color-${c}`"
        :control="stroke.color==c" 
        @click="setColor(c)"
      />
    </div>

    <div v-if="(mode=='eraser')||(mode=='selection')">
      <app-button v-for="(l) in layerMap"
        :key="l[0]" :icon="l[1]" 
        aria-label="`eraser-layer-${l[0]}`"
        :control="layers[l[0]]" @click="setLayers(l[0])"
      />
    </div>

    <div v-if="mode=='selection'" class="bottom">
      <app-button icon="fa-cut" aria-label="cut" title="Cut" @click="toclipboard(true)"/>
      <app-button icon="fa-copy" aria-label="copy" title="Copy" @click="toclipboard(false)"/>
      <app-button icon="fa-paste" aria-label="paste" title="Paste" @click="fromclipboard()"/>
    </div>

    <div v-if="mode=='latex'">
      <app-button icon="fa-square" v-for="(c) in colorMap"
        :key="c" :style="`color: var(--pen-color-${c})`"
        aria-label="`latex-color-${c}`"
        :control="stroke.color==c" 
        @click="setColor(c)"
      />
      <app-button v-for="(s) in scaleMap"
        :icon="`fa-text-height ${s[1]}`" aria-label="s[0]" :key="s[0]" 
        :control="stroke.scale==s[2]"
        @click="setScale(s[2])"
      />
    </div>

    <div v-if="mode=='coverprefs'">
      <app-button icon="fa-square" v-for="(c) in colorMap3"
        :key="c" :style="`color: var(--cover-page-${c})`"
        aria-label="`cover-color-${c}`"
        :control="bg.color==c"
        @click="()=>{bg.color = c}"
      />
      <app-button v-for="(i) in [0,1,2]"
        :key="'style:' + i" :icon="styleMap[i]"
        aria-label="`style-${i}`"
        :control="bg.style==`img${i}`"
        @click="()=>{bg.style = `img${i}`}"
      />
    </div>

    <div v-if="mode=='pageprefs'">
      <app-button icon="fa-square" 
        :style="`color: var(--page-white)`"
        aria-label="`page-white`"
        :control="bg.color=='white'"
        @click="()=>{bg.color='white'}"
      />
      <app-button icon="fa-square" 
        :style="`color: var(--page-yellow)`"
        aria-label="`page-yellow`"
        :control="bg.color=='yellow'"
        @click="()=>{bg.color='yellow'}"
      />
      <app-button icon="fa-grip-lines" 
        :control="bg.style=='ruled'"
        aria-label="`page-rules`"
        @click="()=>{bg.style='ruled'}"
      />
      <app-button icon="fa-border-all" 
        :control="bg.style=='grid'"
        aria-label="`page-grid`"
        @click="()=>{bg.style='grid'}"
      />
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import AppButton from '../components/AppButton'
import store from '../hooks/store'
import history from '@/hooks/history'
import { toRaw } from 'vue'
import _ from 'lodash'

const layers = ['penstrokes','highlighterstrokes','latex'];
var clipboard = {}
layers.forEach(key => {
  clipboard[key] = [];
});

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
      styleMap: ['far fa-square','fa-image','fa-image'],
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
      } else {
        return [];
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
    },
    toclipboard(cut=false) {
      layers.forEach(key => {
        clipboard[key] = [];
        store.selection[key].reverse().forEach(element => {
          let clone = _.cloneDeep(toRaw(store[key].value[element]));
          clipboard[key].push(clone);
          if (cut) {
            store[key].value.splice(element, 1);
          }
        });
      });
      history.checkpoint();
      store.reset_selection();
    },
    fromclipboard() {
      store.reset_selection();
      console.log(clipboard)
      layers.forEach(key => {
        clipboard[key].forEach(element => {
          let idx = store[key].value.length-1;
          store[key].value.splice(idx, 0, _.cloneDeep(element));
          store.selection[key].push(idx);
        })
      });
      history.checkpoint();       
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

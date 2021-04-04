<template>
  <g id="latex">
    <path v-for="(l,index) in latex"
      :key="'latex:' + index"
      :id="'latex:' + index"
      :d="l.d"
      :fill="`var(--pen-color-${l.color})`" 
      :class="(selection.includes(index)) ? 'selected' : ''"
    />
  </g>
</template>

<script>
import store from '@/hooks/store'
import pointertools from '@/hooks/pointertools';
import { TeXBox } from '@/hooks/texbox';

export default {
  data() {
    return {
      selection: store.selection.latex
    }
  },
  setup() {
    const latex = store.latex;

    function openLatexDialog(e) {
      let p = pointertools.position(e);
      let _d = TeXBox('a_\\mu',[p.x,p.y]);
      latex.value.push({d:_d,raw:'my',color:'blue',scale:1});
    }

    function empty() {return;}

    const { on, off } = pointertools.layer(openLatexDialog, empty, empty);
    return {
      latex,
      on,
      off
    }

  }
}
</script>

<style scoped>
.selected {
  stroke: grey;
  stroke-dasharray: 4;
}
</style>
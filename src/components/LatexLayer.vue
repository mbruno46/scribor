<template>
  <g id="latex" :transform="`scale(${v.scale} ${v.scale})`">
    <path v-for="(l,index) in latex"
      :key="'latex:' + index"
      :id="'latex:' + index"
      :d="l.d"
      :fill="`var(--pen-color-${l.color})`" 
      :class="modifiers(index)"
    />
  </g>
</template>

<script>
import store from '@/hooks/store'
import pointertools from '@/hooks/pointertools';
import { TeXBox } from '@/hooks/texbox';
import { watch } from 'vue'
import history from '@/hooks/history'

export default {
  data() {
    return {
      selection: store.selection.latex,
      editor: store.editor,
      v: store.viewport
    }
  },
  setup() {
    const latex = store.latex;
    var moving = false;

    function start(e) {
      if (!pointertools.safedown(e)) {return;}

      moving = true;
      store.reset_selection();
      
      let p = pointertools.position(e);
      store.editor.ofs = [p.x, p.y];
      store.editor.idx = latex.value.length-1;
    }

    function move(e) {
      if (!moving) {return;}

      let p = pointertools.safemove(e);
      store.editor.ofs = [p.x, p.y];

      let l = latex.value[latex.value.length-1];
      l.d = TeXBox(store.editor.text,store.editor.ofs,l.scale);
    }

    function end(e) {
      if (!moving) {return;}
      e.preventDefault();
      moving = false;

      let l = latex.value[latex.value.length-1];
      l.d = TeXBox(store.editor.text,store.editor.ofs,l.scale);
      l.raw = store.editor.text;
      
      latex.value.push({d:'', raw:'', color:l.color, scale:l.scale });
      history.checkpoint();
    }

    const { on, off } = pointertools.layer(start, move, end);

    watch(
      ()=>store.editor.text,
      ()=>{
        if (store.editor.idx >= 0) {
          let l = latex.value[store.editor.idx];
          l.d = TeXBox(store.editor.text,store.editor.ofs,l.scale);
          l.raw = store.editor.text;

          history.checkpoint();
        }
      }
    )
    
    return {
      latex,
      on,
      off
    }
  },
  methods: {
    modifiers(index) {
      let c0 = (this.selection.includes(index)) ? 'selected' : '';
      let c1 = (this.editor.idx==index) ? 'editing' : '';
      return `${c0} ${c1}`
    }
  }
}
</script>

<style scoped>
.selected {
  fill: grey;
  stroke: grey;
  stroke-dasharray: 4;
}

.editing {
  stroke: red;
}
</style>
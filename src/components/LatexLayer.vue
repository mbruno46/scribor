<template>
  <g id="latex" :transform="`scale(${v.scale} ${v.scale})`">
    <path v-for="(l,index) in latex"
      :key="'latex:' + index"
      :id="'latex:' + index"
      :d="l.d"
      :fill="`var(--pen-color-${l.color})`" 
      :class="(selection.includes(index)) ? 'selected' : ''"
    />

    <rect :x="box.x" :y="box.y" :width="box.width" height="5" />
  </g>
</template>

<script>
import store from '@/hooks/store'
import pointertools from '@/hooks/pointertools';
import { TeXBox } from '@/hooks/texbox';
import { getCurrentInstance, reactive, watch } from 'vue'

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
      e = e || e.originalEvent || window.event;
      if (e.target.parentElement.parentElement.id!="page") {return;}
      e.preventDefault();
      moving = true;

      let p = pointertools.position(e);
      store.editor.ofs = [p.x, p.y];
      store.editor.idx = latex.value.length-1;
    }

    function move(e) {
      if (!moving) {return;}

      let p = pointertools.position(e);
      store.editor.ofs = [p.x, p.y];

      let l = latex.value[latex.value.length-1];
      l.d = TeXBox(store.editor.text,store.editor.ofs,l.scale);
    }

    function end() {
      if (!moving) {return;}
      moving = false;

      let l = latex.value[latex.value.length-1];
      l.d = TeXBox(store.editor.text,store.editor.ofs,l.scale);
      l.raw = store.editor.text;

      latex.value.push({d:'', raw:'', color:l.color, scale:l.scale });
    }

    const { on, off } = pointertools.layer(start, move, end);

    const box = reactive({x:0,y:0,width:0});

    watch(
      ()=>store.editor.text,
      ()=>{
        if (store.editor.idx >= 0) {
          let l = latex.value[store.editor.idx];
          l.d = TeXBox(store.editor.text,store.editor.ofs,l.scale);
          l.raw = store.editor.text;

          // THIS BELOW IS NOT WORKING
          let b = getCurrentInstance().getBBox();
          box.x = b.x;
          box.y = b.y;
          box.width = b.width;
        }
      }
    )
    
    return {
      latex,
      box,
      on,
      off
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
<template>
  <div class="toolbar">
    <app-button v-for="(v,k) in btns"
      :ref="k" :key="k" :title="v.title" :icon="v.icon" :control="mode==k"
      @click="clicker(k)" />

    <div class="bottom"> 
      <app-button icon="fa-plus" @click.prevent="addrmPage(true)"/>
      <app-button icon="fa-minus" @click.prevent="addrmPage(false)"/>
      <app-button icon="fa-cog" />
    </div>
  </div>

</template>

<script>
import AppButton from '../components/AppButton'
import store from '../hooks/store'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      mode: store.mode,
      btns: {
        selection: {title: 'Selection', icon: 'fa-mouse-pointer' },
        drag: {title: 'Drag', icon: "fa-arrows-alt"},
        eraser: {title: 'Eraser', icon: 'fa-eraser'},
        pen: {title: 'Pen', icon: 'fa-pen-fancy'},
        highlighter: {title: 'Highlighter', icon: 'fa-highlighter'},
        latex: {title: 'LaTeX', icon: 'fa-i-cursor'}
      },
      pos: {top: '', left: ''}
    }
  },
  methods: {
    clicker(key) {
      store.mode.value = key;
      if (key=='selection') {
        store.selection.value.penstrokes.splice(0);
        store.selection.value.highlighterstrokes.splice(0);
      }
    },
    addrmPage(add) {
      let i = store.focuspage.value;
      if (add) {
        store.notebook.value.splice(i+1,0,store.newPage());
        store.focuspage.value += 1;
      } else {
        if (i==0) {return;}
        store.notebook.value.splice(i,1);
        store.focuspage.value -= 1;
      }
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-flow: column;
}

.bottom {
  margin-top: auto;
}
</style>
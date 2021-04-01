<template>
  <div class="toolbar">
    <app-button v-for="(v,k) in btns"
      :ref="k" :key="k" :title="v.title" :icon="v.icon" :control="mode==k"
      @click="clicker(k)" />
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
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-flow: column;
}
</style>
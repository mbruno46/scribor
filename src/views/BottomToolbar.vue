<template>
  <div class="toolbar">
    <generic-btn id="pen" title="Pen" icon="fa-eraser" 
      @clicked:pen="EraserMode"/>
    <generic-btn id="pen" title="Pen" icon="fa-pen-fancy" 
      @clicked:pen="PenMode"/>
    <generic-btn id="highlighter" title="Highligther" icon="fa-highlighter"
      @clicked:highlighter="HMode"/>
  </div>
</template>

<script>
import GenericBtn from '@/components/GenericBtn'
import store from '@/hooks/store'

export default {
  components: {
    GenericBtn
  },
  methods: {
    EraserMode () {store.mode.value = 'eraser';},
    PenMode() {store.mode.value = 'pen';},
    HMode() {store.mode.value = 'highlighter';}
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  display: flex;
}
</style>
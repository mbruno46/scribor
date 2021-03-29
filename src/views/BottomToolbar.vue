<template>
  <div class="toolbar">
    <generic-btn id="pen" title="Pen" icon="fa-pen-fancy" 
      @clicked:pen="PenMode"/>
    <generic-btn id="highlighter" title="Highligther" icon="fa-highlighter"
      @clicked:highlighter="HMode"/>
  </div>
</template>

<script>
import GenericBtn from '@/components/GenericBtn'

export default {
  components: {
    GenericBtn
  },
  methods: {
    PenMode() {this.$root.$refs.nb.mode = 'pen';},
    HMode() {this.$root.$refs.nb.mode = 'highlighter';}
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  display: flex;
}
</style>
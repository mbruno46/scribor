<template>
  <notebook ref="nb" />
</template>

<script>
import Notebook from './views/Notebook.vue'

export default {
  name: 'App',
  components: {
    Notebook
  },
  mounted() {
    this.$refs.nb.setDrawingMode('pen')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <top-toolbar />
  <notebook ref="nb" />
  <bottom-toolbar />
</template>

<script>
import Notebook from './views/Notebook.vue'
import TopToolbar from './views/TopToolbar'
import BottomToolbar from './views/BottomToolbar'
import store from '@/hooks/store'

export default {
  name: 'App',
  components: {
    Notebook,
    TopToolbar,
    BottomToolbar
  },
  mounted() {
    store.mode.value = 'pen';
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
}
</style>

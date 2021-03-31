<template>
  <top-toolbar />
  <div class='container'>
    <left-toolbar />
    <notebook ref="nb" />
  </div>
  <bottom-toolbar />
</template>

<script>
import Notebook from './views/Notebook.vue'
import TopToolbar from './views/TopToolbar'
import BottomToolbar from './views/BottomToolbar'
import LeftToolbar from './views/LeftToolbar'
import store from '@/hooks/store'

export default {
  name: 'App',
  components: {
    Notebook,
    TopToolbar,
    BottomToolbar,
    LeftToolbar
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

.container {
  width: 100%;
  display: flex;
}

</style>

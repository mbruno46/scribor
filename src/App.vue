<template>
  <top-toolbar ref="toptoolbar"/>
  <div class='container'>
    <left-toolbar />
    <notebook ref="nb" />
    <right-toolbar />
  </div>
  <bottom-toolbar />
</template>

<script>
import Notebook from './views/Notebook.vue'
import TopToolbar from './views/TopToolbar'
import BottomToolbar from './views/BottomToolbar'
import LeftToolbar from './views/LeftToolbar'
import RightToolbar from './views/RightToolbar'
import store from '@/hooks/store'

import history from '@/hooks/history'

export default {
  name: 'App',
  components: {
    Notebook,
    TopToolbar,
    BottomToolbar,
    LeftToolbar,
    RightToolbar
  },
  mounted() {
    store.mode.value = 'pen';
    history.checkpoint();
    this.$refs.toptoolbar.fit_width();
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
  /* touch-action: none; */
}

.container {
  width: 100%;
  height: calc(100vh - 3.4rem - 3.4rem);
  display: grid;
  grid-template-columns: min-content auto min-content;
}
</style>

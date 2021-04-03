<template>
  <div class="toolbar">
    <div>
      <app-button icon="fa-bars" />
      <!-- <app-button icon="fa-folder-open" />
      <app-button icon="fa-save" />
      <app-button icon="fa-file-pdf" /> -->
    </div>

    <div class="center">
      <app-button icon="fa-search-plus" @click="zoom(1.1)"/>
      <app-button icon="fa-search-minus" @click="zoom(1/1.1)"/>
      <app-button icon="fa-arrows-alt-h" @click="fit_width"/>
      <app-button icon="fa-arrows-alt-v" @click="fit_height"/>
    </div>

    <div class="right">
      <!-- <app-button icon="fa-cut" />
      <app-button icon="fa-copy" />
      <app-button icon="fa-paste" /> -->
      <app-button icon="fa-undo" />
      <app-button icon="fa-redo" />
    </div>
  </div>
</template>

<script>
import { parseInt } from 'lodash'
import AppButton from '../components/AppButton.vue'
import store from '../hooks/store'

function px2int(px) {
  return parseInt(px.replace(/px/,''))
}

export default {
  components: {
    AppButton
  },
  methods: {
    zoom(r) {store.viewport.scale *= r;},
    fit_width() {
      let nb = this.$root.$refs.nb.$el;
      const css = getComputedStyle(nb);
      let w = nb.offsetWidth - px2int(css.paddingLeft) - px2int(css.paddingRight)*2;
      store.viewport.scale = w/store.viewport.width;
    },
    fit_height() {
      let nb = this.$root.$refs.nb.$el;
      const css = getComputedStyle(nb);
      let h = nb.offsetHeight - px2int(css.paddingTop) - px2int(css.paddingBottom);
      store.viewport.scale = (h/store.viewport.height);
    }  
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  display: flex;
}

.center {
  margin-left: auto;
  margin-right: auto;
}

.right {
  float: right;
  margin-left: auto;
}

</style>
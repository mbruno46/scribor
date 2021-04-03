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
      <app-button icon="fa-arrows-alt-h" />
      <app-button icon="fa-arrows-alt-v" />
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
import AppButton from '../components/AppButton.vue'
import store from '../hooks/store'

export default {
  components: {
    AppButton
  },
  methods: {
    zoom(r) {store.viewport.scale *= r;}
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
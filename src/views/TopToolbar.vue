<template>
  <div class="toolbar">
    <div>
      <app-button icon="fa-bars" />
      <app-button icon="fa-folder-open" />
      <app-button icon="fa-save" />
      <app-button icon="fa-file-pdf" />
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

export default {
  components: {
    AppButton
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  display: flex;
}

.right {
  float: right;
  margin-left: auto;
}

</style>
<template>
  <div class="toolbar">
    <generic-btn id="page-pref" title="Preferences" icon="fa-bars"/>
  </div>
</template>

<script>
import GenericBtn from '@/components/GenericBtn'

export default {
  components: {
    GenericBtn
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
}
</style>
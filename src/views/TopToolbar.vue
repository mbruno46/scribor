<template>
  <div class="toolbar">
    <generic-btn id="page-pref" title="Preferences" icon="fa-bars"/>

    <div class="nav">
      <button title="Previous">
        <i class="fa fa-angle-left"></i>
      </button>
      <span>1/1</span>
    </div>
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
  display: flex;
}

.nav {
  margin-left: auto;
  margin-right: auto;
}
</style>
<template>
  <div class="toolbar">
    <div class="left">
      <app-button icon="fa-plus" />
      <app-button icon="fa-minus" />
    </div>

    <div class="nav">
      <app-button icon="fa-angle-left" />
      <span>1/1</span>
      <app-button icon="fa-angle-right" />
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
  flex-flow: row;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.left {
  float:left;
  margin-left: 3rem;
}

.nav {
  margin-left: auto;
  margin-right: auto;
}

.nav span {
  color: var(--text);
  margin: 0 1rem 0 1rem;
}


</style>
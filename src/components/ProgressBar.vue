<template>
  <transition name="fade">
    <div v-if="progressbar.status" class="progress-bar">
      <p>Preparing PDF ({{ progressbar.value }} %)...</p>
      <progress id="pbar" :value="progressbar.value" max="100"></progress>
      <p></p>
    </div>
  </transition>
</template>

<script>
import store from '../hooks/store'

export default {
  setup() {
    const progressbar = store.progressbar;
    return {
      progressbar
    }
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.progress-bar {
  background-color: var(--background);
  border-radius: 1rem;
  border: 2px solid var(--focus);
  top: calc(100% / 2 - 10rem);
  left: calc(100% / 2 - 10rem);
  height: fit-content;
  width: 20rem;
  position: absolute;
  z-index: 1;  
}

.progress-bar h1, p {
  color: var(--text);
}
</style>
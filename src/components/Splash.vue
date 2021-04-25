<template>
  <transition name="fade">
    <div v-if="splash" class="splash" @click="splash = false">
      <a href="https://github.com/mbruno46/scribor" target="_blank"><img src="@/assets/logo.png"/></a>
      <h1>Scribor</h1>
      <p>Version 1.0.1 (1.0.1)</p>
      <p>Copyright © 2021 Mattia Bruno </p>
      <p>(click splash to start)</p>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      splash: true
    }
  }
}
</script>



<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.splash {
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

.splash img {
  margin-top: 1rem;
  width: 70%;
}

.splash h1, p {
  color: var(--text);
}
</style>
<template>
  <div ref="div" class="context" :style="`top: ${pos.top}; left: ${pos.left}`">
    <slot />
  </div>
</template>

<script>
export default {
  props: ['pos']
}
</script>

<style scoped>
.context {
  background-color: var(--background);
  border: 1px solid var(--text);
  width: fit-content;
  height: fit-content;
  position: absolute;
  display: flex;
  flex-flow: column;
}
</style>
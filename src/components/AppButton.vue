<template>
    <button class="btn" :title="title" :style="style" :class="(control) ? 'active' : ''">
        <i class="fa fa-lg" :class="icon"></i>
    </button>
</template>

<script>
import '@fortawesome/fontawesome-free/js/all.min.js'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: String,
    style: {
      type: String,
      default: ''
    },
    control: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn {
  background-color: inherit;
  color: var(--text);
  border: none;
  border-bottom: 1px solid var(--text);
  text-decoration:none;
  outline: none;
  display: inline-block;
  align-items: center;
  margin: 0.2rem;
  box-sizing: border-box;
  width: 3rem;
  height: 3rem;
  font-size: inherit;
}

.btn {
  transition-duration: 0.4s;
}

.btn:hover:not(.active) {
  background-color: var(--hover);
}

.active {
  background-color: var(--focus);
}
</style>
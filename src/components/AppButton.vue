<template>
    <button class="btn" :title="title" :style="style" :class="active">
        <i class="fa fa-lg" :class="icon"></i>
    </button>
</template>

<script>
import '@fortawesome/fontawesome-free/js/all.js'
import store from '../hooks/store'
import { computed } from 'vue'

export default {
  props: {
    id: String,
    title: {
      type: String,
      default: ''
    },
    icon: String,
    style: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const active = computed(()=> {
      return (store.mode.value==props.id) ? 'active' : '';
    })
    return {active}
  }
}
</script>

<style scoped>
.btn {
  background-color: inherit;
  color: var(--text);
  border: none;
  text-decoration:none;
  outline: none;
  display: inline-block;
  align-items: center;
  width: 3rem;
  height: 3rem;
}

.btn {
  transition-duration: 0.4s;
}

.btn:hover {
  background-color: var(--hover);
}

.active {
  background-color: var(--focus);
}
</style>
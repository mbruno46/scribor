<template>
    <button @click="onClick" :id="id" class="btn" :title="title" :style="style">
        <i class="fa fa-lg" :class="icon"></i>
    </button>
</template>

<script>
import '@fortawesome/fontawesome-free/js/all.js'

export default {
  name: 'generic-btn',
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
  methods: {
    onClick() {
        this.$emit('clicked:' + this.id);
    }
  }
}
</script>

<style scoped>
.btn {
    align-items: center;
    padding: 0.6rem;
    margin: 0.4rem auto 0.4rem auto;
    width: 3rem;
    height: 3rem;
}
</style>
<template>
  <div class="toolbar">
    <app-button icon="fa-cog" />

    <div class="nav">
      <app-button icon="fa-angle-left" @click.prevent="pageshift(-1)"/>
      <span>{{ pages.focus +1 }}/{{ pages.total }}</span>
      <app-button icon="fa-angle-right" @click.prevent="pageshift(+1)"/>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/AppButton.vue'
import store from '../hooks/store'

export default {
  components: {
    AppButton
  },
  setup() {
    return {
      pages: store.pages
    }
  },
  methods: {
    pageshift(shift) {
      store.pages.focus += shift;
      if (store.pages.focus > store.pages.total-1) {
        store.pages.focus = store.pages.total-1;
      }
      if (store.pages.focus < 0) {
        store.pages.focus = 0;
      }      
    }
  }
}
</script>

<style scoped>
.toolbar {
  /* background-color: var(--border); */
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
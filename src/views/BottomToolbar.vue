<template>
  <div class="toolbar">

    <div class="nav">
      <app-button icon="fa-angle-left" @click.prevent="pageshift(-1)"/>
      <span>{{ focuspage+1 }}/{{ totpages }}</span>
      <app-button icon="fa-angle-right" @click.prevent="pageshift(+1)"/>
    </div>
  </div>
</template>

<script>
import AppButton from '../components/AppButton.vue'
import store from '../hooks/store'
import { computed } from 'vue'

export default {
  components: {
    AppButton
  },
  setup() {
    const totpages = computed(()=>{
      return store.notebook.value.length;
    });

    function pageshift(shift) {
      store.focuspage.value += shift;
      if (store.focuspage.value > totpages.value-1) {
        store.focuspage.value = totpages.value-1;
      }
      if (store.focuspage.value < 0) {
        store.focuspage.value = 0;
      }
    }
    return {
      focuspage: store.focuspage,
      totpages,
      pageshift
    }
  }
}
</script>

<style scoped>
.toolbar {
  background-color: var(--border);
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
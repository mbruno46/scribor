<template>
  <div class="toolbar">
    <div class="group-left">
      <!-- <app-button icon="fa-cog" /> -->
    </div>

    <div class="nav group-center">
      <app-button icon="fa-angle-left" @click.prevent="pageshift(-1)"/>
      <span>{{ pages.focus +1 }}/{{ pages.total }}</span>
      <app-button icon="fa-angle-right" @click.prevent="pageshift(+1)"/>
    </div>

    <textarea v-if="editor.active"
      rows="2" cols="40" class="editor"
      v-model="editor.text"
    />

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
      pages: store.pages,
      editor: store.editor
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.nav span {
  color: var(--text);
  margin: 0 1rem 0 1rem;
}

.editor {
  background-color: var(--background);
  color: var(--text);
  resize: none;
  outline: none;
}

</style>
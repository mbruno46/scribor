<template>
  <div class="toolbar">
    <app-button v-for="(v,k) in btns"
      :id="k" :ref="k" :key="k" :title="v.title" :icon="v.icon" @click="fireMenu(k)" />
  </div>

  <pen-menu v-if="btns['pen'].show" :pos="pos"/>
  <!-- <context-menu v-if="btns['highlighter'].show" :data="'ciao2'" :pos="pos"/> -->
</template>

<script>
import PenMenu from '../components/PenMenu'
import AppButton from '../components/AppButton'
import store from '../hooks/store'

export default {
  components: {
    PenMenu,
    AppButton
  },
  data() {
    return {
      active: '',
      btns: {
        pen: {title: 'Pen', show: false, icon: 'fa-pen-fancy'},
        highlighter: {title: 'Highlighter', show: false, icon: 'fa-highlighter'}
      },
      pos: {top: '', left: ''}
    }
  },
  methods: {
    fireMenu(id) {
      if ((this.active!=id)&(this.active!='')) {
        this.btns[this.active].show=false;
      }

      let box = this.$refs[id].$el.getBoundingClientRect();
      this.pos.top = `${box.top+4}px`;
      this.pos.left = `${box.width+4}px`;
      this.btns[id].show = !this.btns[id].show;

      this.active = (this.btns[id].show) ? id : '';
      store.mode.value = (this.btns[id].show) ? 'none' : id;
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-flow: column;
}
</style>
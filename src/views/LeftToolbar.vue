<template>
  <div class="side-toolbar">
    <app-button v-for="(v,k) in btns"
      :ref="k" :key="k" :title="v.title" :icon="v.icon" :control="mode==k"
      @click="clicker(k)" />

    <div class="bottom"> 
      <app-button icon="fa-plus" title="Add page" @click.prevent="addrmPage(true)"/>
      <app-button icon="fa-minus" title="Remove page" @click.prevent="addrmPage(false)"/>
      <app-button icon="fa-cog" title="Page properties"
        :control="(mode=='coverprefs')||(mode=='pageprefs')"
        @click="clicker((pages.focus==0) ? 'coverprefs' : 'pageprefs')"/>
    </div>
  </div>

</template>

<script>
import AppButton from '../components/AppButton'
import store from '../hooks/store'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      mode: store.mode,
      btns: {
        selection: {title: 'Selection', icon: 'fa-mouse-pointer' },
        drag: {title: 'Drag', icon: "fa-arrows-alt"},
        eraser: {title: 'Eraser', icon: 'fa-eraser'},
        pen: {title: 'Pen', icon: 'fa-pen-fancy'},
        highlighter: {title: 'Highlighter', icon: 'fa-highlighter'},
        latex: {title: 'LaTeX', icon: 'fa-i-cursor'},
        laser: {title: 'Laser', icon: 'fa-bahai'}
      },
      pos: {top: '', left: ''},
      pages: store.pages
    }
  },
  methods: {
    clicker(key) {
      store.mode.value = key;
      if ((key=='selection')||(key=='eraser')) {
        store.reset_selection();
      }
      store.editor.active = (key!='latex') ? false : true;
    },
    addrmPage(add) {
      if (add) {
        store.notebook.splice(store.pages.focus+1,0,store.newPage());
        store.pages.focus += 1;
        store.pages.total += 1;
      } else {
        if (store.pages.focus==0) {return}
        store.notebook.splice(store.pages.focus,1);
        store.pages.focus -= 1;
        store.pages.total -= 1;
      }
    }
  }
}
</script>

<style scoped>
.side-toolbar {
  display: flex;
  flex-flow: column;
}

.bottom {
  /* margin-top: auto; */
  display: flex;
  flex-flow: column;
  bottom: 0;
  position: absolute;
}
</style>
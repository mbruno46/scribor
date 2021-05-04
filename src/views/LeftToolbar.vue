<template>
  <div class="side-toolbar">
    <app-button v-for="(v,k) in btns"
      :ref="k" :key="k" :title="v.title" :icon="v.icon" :control="mode==k"
      @click="clicker(k)" />

    <div class="bottom"> 
      <app-button icon="fa-plus" title="Add page" @click.prevent="addrmPage(true)"/>
      <app-button icon="fa-minus" title="Remove page" @click.prevent="addrmPage(false)"/>
    </div>
  </div>

  <input ref="file_dialog" type="file" accept="image/png, image/jpeg" 
    style="display: none" @change="loadImage">
</template>

<script>
import AppButton from '../components/AppButton'
import store from '../hooks/store'
import fs from '@/hooks/filesystem'

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
        image: {title: 'Image PNG/JPEG', icon: 'fa-file-image'},
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
      if (key=='image') {
        const f = this.$refs.file_dialog;
        f.setAttribute('style','display:block');
        f.focus();
        f.click();
        f.setAttribute('style','display: none');
      }
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
    },
    load() {
      const f = this.$refs.file_dialog;
      f.setAttribute('style','display:block');
      f.focus();
      f.click();
      f.setAttribute('style','display: none');
    },
    loadImage() {
      const f = this.$refs.file_dialog;
      let n = f.files.lenght;
      for (var i=0;i<n;i++) {
        fs.loadImage(f.files[i]);

        store.images.push({
          blob: '',
          url: '',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        })
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
  margin-top: auto;
  display: flex;
  flex-flow: column;
  /* bottom: 0; */
  /* position: absolute; */
}
</style>
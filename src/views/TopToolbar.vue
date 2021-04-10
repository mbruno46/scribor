<template>
  <div class="toolbar">
    <div class="group-left">
      <!-- <app-button icon="fa-bars" @click="show_file = !show_file"/> -->
      <app-button icon="fa-folder-open" title="Open notebook" @click="load"/>
      <app-button icon="fa-save" title="Save notebook" @click="save"/>
      <app-button icon="fa-file-pdf" title="Export as PDF" @click="savePDF"/>

      <input ref="file_dialog" type="file" style="display: none" @change="loadNotebook">
    </div>

    <div class="group-center">
      <app-button icon="fa-search-plus" title="Zoom In" @click="zoom(1.1)"/>
      <app-button icon="fa-search-minus" title="Zoom out" @click="zoom(1/1.1)"/>
      <app-button icon="fa-arrows-alt-h" title="Fit width" @click="fit_width"/>
      <app-button icon="fa-arrows-alt-v" title="Fit height" @click="fit_height"/>
    </div>

    <div class="group-right">
      <app-button icon="fa-undo" title="Undo" @click="undo"/>
      <app-button icon="fa-redo" title="Redo" @click="redo"/>
    </div>
  </div>
</template>

<script>
import { parseInt } from 'lodash'
import AppButton from '../components/AppButton.vue'
import store from '../hooks/store'
import fs from '@/hooks/filesystem'
import history from '@/hooks/history'

function px2int(px) {
  return parseInt(px.replace(/px/,''))
}



export default {
  components: {
    AppButton
  },
  data() {
    return {
      show_file: false
    }
  },
  methods: {
    zoom(r) {store.viewport.scale *= r;},
    fit_width() {
      let nb = this.$root.$refs.nb.$el;
      const css = getComputedStyle(nb);
      let w = nb.offsetWidth - px2int(css.paddingLeft) - px2int(css.paddingRight)*2;
      store.viewport.scale = w/store.viewport.width;
    },
    fit_height() {
      let nb = this.$root.$refs.nb.$el;
      const css = getComputedStyle(nb);
      let h = nb.offsetHeight - px2int(css.paddingTop) - px2int(css.paddingBottom);
      store.viewport.scale = (h/store.viewport.height);
    },
    save() {
      fs.saveNotebook('notebook.json');
    },
    load() {
      const f = this.$refs.file_dialog;
      f.setAttribute('style','display:block');
      f.focus();
      f.click();
      f.setAttribute('style','display: none');
    },
    loadNotebook() {
      fs.loadNotebook(this.$refs.file_dialog.files[0]);
    },
    savePDF() {
      fs.saveNotebookAsPDF('notebook.pdf');
    },
    undo() {
      history.previousState();
    },
    redo() {
      history.nextState();
    }
  }
}
</script>
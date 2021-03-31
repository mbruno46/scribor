<template>

  <transition name="fade">
    <div v-if="show.pen>0" class="btn-group absolute">
      <generic-btn v-for="(v, k) in pencolors"
        id="color" :key="k" icon="fa-square" :style="'color: ' + v"
        @clicked:color="ps[ps.length-1].color = v"/>
      <generic-btn v-for="(v, k) in pensizes"
        id="size" :key="k" :icon="'fa-slash fa-' + k"
        @clicked:size="ps[ps.length-1].size = v"/>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="show.highlighter" class="btn-group absolute">
      <generic-btn v-for="(c) in highlightercolors"
        id="color" :key="c" icon="fa-square" :style="`color: var(--pen-color-${c})`"
        @clicked:color="HMode(`var(--pen-color-${c})`)"/>
    </div>
  </transition>

  <div class="toolbar">
    <generic-btn id="eraser" title="Eraser" icon="fa-eraser" 
      @clicked:eraser="EraserMode"/>
    <generic-btn id="pen" title="Pen" icon="fa-pen-fancy" 
      @clicked:pen="PenMode"/>
    <generic-btn id="highlighter" title="Highligther" icon="fa-highlighter"
      @clicked:highlighter="HMode"/>
  </div>
</template>

<script>
import GenericBtn from '@/components/GenericBtn'
import store from '@/hooks/store'

export default {
  components: {
    GenericBtn
  },
  data() {
    return {
      show: {
        pen: 0,
        highlighter: false
      },
      pencolors: {
        blue: 'var(--pen-color-blue)',
        red: 'var(--pen-color-red)',
        black: 'black'
      },
      pensizes: {
        xs: 1,
        sm: 2,
        lg: 3
      },
      highlightercolors: ['orange','yellow','cyan','green'],
      ps: store.penstrokes,
      hs: store.highlighterstrokes
    }
  },
  methods: {
    EraserMode () {store.mode.value = 'eraser';},
    PenMode() {
      this.show.highlighter = false;
      this.show.pen=!this.show.pen;
      store.mode.value = (this.show.pen) ? 'none' : 'pen';
    },
    HMode(color=null) {
      this.show.pen = false;
      if (color!=null) {
        this.hs[this.hs.length-1].color = color;
      }
      this.show.highlighter=!this.show.highlighter;
      store.mode.value = (this.show.highlighter) ? 'none' : 'highlighter';
    }
  }
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  display: flex;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.btn-group {
  height: min-content;
  width: 50%;
  margin: 0.6rem auto 0.6rem auto;
  border-radius: 0.4rem;
  padding: 0.2rem;
  /* border: 0.1rem solid var(--border); */
  display: flex;
  align-items: center;
}

.absolute {
  top: 80%;
  left: 25%;
  position: absolute;
}
</style>
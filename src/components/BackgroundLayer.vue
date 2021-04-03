<template>
  <g id="layer-bg">
    <rect x="0" y="0" :width="width" :height="height" :fill="bg.color"/>
    <path v-for="(r,i) in hrules" :key="'hrule:'+i" class="rule" :class="r.class" :d="r.d"></path>
    <path v-for="(r,i) in vrules" :key="'vrule:'+i" class="rule" :class="r.class" :d="r.d"/>
  </g>
</template>

<script>
import { ref } from 'vue'
import store from '@/hooks/store'

var layout = {
  vrule: 91, //32mm /210*595;
  hrule: 20, //7.1mm
  nlines: 36,
  grid: 14.03,
  label: [90,90,595-2*90,120,10],
  label_nlines: 2,
};

// background = {
//   type: 0 or 1  cover/normal
//   style: 0,1,2 if cover is image/if normal ruled vs grid?
//   color: blue/green/red if cover, white/yellow if normal?
// }

export default {
  props: ['width','height'],
  setup(props) {
    const bg = store.background;

    const hrules = ref([]);
    const vrules = ref([]);

    function setStyle(s) {
      var i;
      hrules.value = []
      vrules.value = []
      // ruled
      if (s=='ruled') {
        var margin = Math.round((props.height-(layout.nlines-1)*layout.hrule)/2);
        for (i=0;i<layout.nlines;i++) {
          hrules.value.push({
            d: 'm 0 ' + (margin + layout.hrule*(i+1)) + ' h ' + props.width,
            class: 'hrule'
          });
        }
        vrules.value.push({
          d: 'm ' + layout.vrule + ' 0 v ' + props.height,
          class: 'vrule'
        });
      } else if (s=='grid') {
        var n;
        n = Math.round(props.height/layout.grid);
        for (i=0;i<n;i++) {
          hrules.value.push({
            d: 'm 0 ' + (layout.grid*(i+1)) + ' h ' + props.width,
            class: 'hrule'
          })
        }
        n = Math.round(props.width/layout.grid);
        for (i=0;i<n;i++) {
          vrules.value.push({
            d: 'm ' + (layout.grid*(i+1)) + ' 0 v ' + props.height,
            class: 'hrule'
          })
        }
      }
    }

    // const bg = computed(()=>{
    //   let _bg = store.notebook[store.pages.focus].background;
    //   setStyle(_bg.style);
    //   return _bg;
    // });

    setStyle(bg.value.style);
    // watch(() => bg, (_bg) => {console.log('styled',_bg);setStyle(_bg.value.style);});

    return {
      hrules,
      vrules,
      bg
    }
  },
}
</script>

<style scoped>
.rule {
  stroke-width: 0.4;
  fill: none;
}

.hrule {
  stroke: var(--hrule);
}

.vrule {
  stroke: var(--vrule);
}
</style>
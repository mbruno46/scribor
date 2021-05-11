<template>
  <g v-if="pages.focus==0" id="layer-bg" :transform="`scale(${v.scale} ${v.scale})`">
    <rect x="0" y="0" :width="v.width" :height="v.height" 
      :fill="`var(--cover-page-${bg.color})`"/>

    <!-- <path key="graph" :d="graphics.d" :fill="graphics.fill" :stroke="graphics.stroke"/> -->
    <path v-for="(p,i) in bg.paths"
      :key="'path:'+i" :d="p.d" :fill="p.fill" :stroke="p.color" :stroke-width="p.width" />

    <path v-for="(r,i) in bg.rules" 
      :d="r.d" :key="'rule:'+i" class="rule" :stroke="`var(--${r.color})`"/>
  </g>

  <g v-if="pages.focus>0" id="layer-bg" :transform="`scale(${v.scale} ${v.scale})`">
    <rect x="0" y="0" :width="v.width" :height="v.height" 
      :fill="`var(--page-${bg.color})`"/>
    <path v-for="(r,i) in bg.rules" 
      :key="'rule:'+i" class="rule" :stroke="`var(--${r.color})`" :d="r.d">
    </path>
  </g>


</template>

<script>
import { watch } from 'vue'
import store from '@/hooks/store'
import { RectAsPath } from '@/hooks/utils'
// import { newSVGNode, flattenSVG } from '../hooks/utils'

import img1 from 'raw-loader!@/assets/svgs/collision.path'
import img2 from 'raw-loader!@/assets/svgs/feyndiagr.path'
const imgs = {img0: '', img1, img2};
const colorMap = {
  blue: ['yellow','red'],
  green: ['orange','purple'],
  red: ['cyan','green']
};

var layout = {
  vrule: 91, //32mm /210*595;
  hrule: 20, //7.1mm
  nlines: 36,
  grid: 14.03,
  label: [90,90,595-2*90,120,10],
  label_nlines: 2,
};

export default {
  setup() {
    const v = store.viewport;
    const bg = store.background;
    const pages = store.pages;

    function setRules(s) {
      var i;
      let rules = bg.value.rules;
      rules.length = 0;

      // ruled
      if (s=='ruled') {
        var margin = Math.round((v.height-(layout.nlines-1)*layout.hrule)/2);
        for (i=0;i<layout.nlines;i++) {
          rules.push({
            d: 'm 0 ' + (margin + layout.hrule*(i+1)) + ' h ' + v.width,
            color: 'hrule'
          });
        }
        rules.push({
          d: 'm ' + layout.vrule + ' 0 v ' + v.height,
          color: 'vrule'
        });
      } else if (s=='grid') {
        var n;
        n = Math.round(v.height/layout.grid);
        for (i=0;i<n;i++) {
          rules.push({
            d: 'm 0 ' + (layout.grid*(i+1)) + ' h ' + v.width,
            color: 'hrule'
          })
        }
        n = Math.round(v.width/layout.grid);
        for (i=0;i<n;i++) {
          rules.push({
            d: 'm ' + (layout.grid*(i+1)) + ' 0 v ' + v.height,
            color: 'hrule'
          })
        }
      }
    }

    function setCoverPage(s,c) {
      bg.value.paths.length = 0;
      let cols = colorMap[c];
      // let newel = flattenSVG(newSVGNode('path', {d: imgs[s]}),
      //   [`translate(350,-1220) scale(1.0, 1.0) rotate(0 0 0)`]);
      bg.value.paths.push({
        d: imgs[s],
        fill: cols[0],
        color: cols[1],
        width: '1'
      })
      console.log(c, cols)

      let r = layout.label;
      bg.value.paths.push({
        d: RectAsPath(r[0],r[1],r[2],r[3],r[4],r[4]),
        fill: 'white',
        color: 'black',
        width: '2'
      })

      let rules = bg.value.rules;
      rules.length = 0;
      for (var i=0;i<layout.label_nlines;i++) {
        rules.push({d: 'm' + (layout.label[0]+layout.label[4]) + ' ' + 
          (layout.label[1]+2*layout.hrule*(i+1)) + 'h' + (layout.label[2]-2*layout.label[4]),
          color: 'hrule'
        });
      }
    }
          
    setCoverPage(bg.value.style,bg.value.color);
    watch(
      ()=>bg.value.style,
      ()=>{
        if (pages.focus==0) {
          setCoverPage(bg.value.style,bg.value.color);
        } else {
          setRules(bg.value.style);
        }
      }
    );
    watch(
      ()=>bg.value.color,
      ()=>{
        if (pages.focus==0) {
          setCoverPage(bg.value.style,bg.value.color);
        }
      }
    );

    return {
      pages,
      bg,
      v
    }
  },
}
</script>

<style scoped>
.rule {
  stroke-width: 0.4;
  fill: none;
}
</style>
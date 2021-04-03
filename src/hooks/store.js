// import { ref, reactive, watch, toRaw } from 'vue';
import { ref, reactive, computed } from 'vue';

const mode = ref('');
const pages = reactive({focus: 0, total: 1});

// const background = ref({
//   style: '',
//   color: 'blue'
// });
// const penstrokes = ref([{d:'',color:'blue',size:2}]);
// const highlighterstrokes = ref([{d:'',color:'orange'}]);
const viewport = reactive({
  width: 595,
  height: 842,
  realwidth: 210, //mm
  scale: 1
});

const layers = ref({penstrokes: true, highlighterstrokes: true});
const selection = ref({penstrokes: [], highlighterstrokes: []});

function newPage(cover=false) {
  return {
    background: (cover) ? {style:'', color:'blue'} : {style: 'ruled', color:'white'},
    penstrokes: [{d:'',color:'blue',size:2}],
    highlighterstrokes: [{d:'',color:'orange'}]
  }
}
const notebook = reactive([newPage(true)]);
const background = computed(()=>{return notebook[pages.focus].background});
const penstrokes = computed(()=>{return notebook[pages.focus].penstrokes});
const highlighterstrokes = computed(()=>{return notebook[pages.focus].highlighterstrokes})

export default {
  mode,
  background,
  penstrokes,
  highlighterstrokes,
  layers,
  selection,
  notebook,
  newPage,
  pages,
  viewport
}
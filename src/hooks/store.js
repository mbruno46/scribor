// import { ref, reactive, watch, toRaw } from 'vue';
import { ref, reactive, computed, watch } from 'vue';

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

const layers = ref({penstrokes: true, highlighterstrokes: true, latex: true});
const selection = reactive({penstrokes: [], highlighterstrokes: [], latex: []});
watch(
  ()=>pages.focus,
  ()=>{
    selection.penstrokes.length = 0;
    selection.highlighterstrokes.length = 0;
    selection.latex.length = 0;
  }
)

function newPage(cover=false) {
  return {
    background: (cover) ? {style:'', color:'blue'} : {style: 'ruled', color:'white'},
    penstrokes: [{d:'',color:'blue',size:2}],
    highlighterstrokes: [{d:'',color:'orange'}],
    latex: [{d:'',raw:'',color:'blue',scale:1}]
  }
}
const notebook = reactive([newPage(true)]);

const background = computed(()=>{return notebook[pages.focus].background});
const penstrokes = computed(()=>{return notebook[pages.focus].penstrokes});
const highlighterstrokes = computed(()=>{return notebook[pages.focus].highlighterstrokes})
const latex = computed(()=>{return notebook[pages.focus].latex});

// const history = reactive([]);
// const timetravel = ref(0);
// watch(
//   ()=>timetravel,
//   ()=>{notebook = history[history.length-timetravel.value]}
// )

export default {
  mode,
  background,
  penstrokes,
  highlighterstrokes,
  latex,
  layers,
  selection,
  notebook,
  newPage,
  pages,
  viewport
}
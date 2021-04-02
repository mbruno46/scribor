import { ref } from 'vue';

const mode = ref('');
const focuspage = ref(0);
const background = ref({
  style: '',
  color: 'blue'
});
// const cover = ref({ig: 0, color:'blue'});
const penstrokes = ref([{d:'',color:'blue',size:2}]);
const highlighterstrokes = ref([{d:'',color:'orange'}]);
const layers = ref({penstrokes: true, highlighterstrokes: true});
const selection = ref({penstrokes: [], highlighterstrokes: []});

function newPage(cover=false) {
  return {
    background: (cover) ? {style:'', color:'blue'} : {style: 'ruled', color:'white'},
    penstrokes: [{d:'',color:'blue',size:2}],
    highlighterstrokes: [{d:'',color:'orange'}]
  }
}
const notebook = ref([newPage(true)]);

export default {
  mode,
  background,
  // cover,
  penstrokes,
  highlighterstrokes,
  layers,
  selection,
  notebook,
  newPage,
  focuspage
}
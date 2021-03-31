import { ref } from 'vue';

const mode = ref('');
const background = ref({
  type: 1,
  style: 0,
  color: 'white'
});
const penstrokes = ref([{d:'',color:'blue',size:2}]);
const highlighterstrokes = ref([{d:'',color:'orange'}]);
const layers = ref({penlayer: true, highlighterlayer: true});
const selection = ref({penlayer: [], highlighterlayer: []});

export default {
  mode,
  background,
  penstrokes,
  highlighterstrokes,
  layers,
  selection
}
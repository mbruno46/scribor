import { ref } from 'vue';

const mode = ref('');
const background = ref({
  style: 'ruled',
  color: 'white'
});
const cover = ref({ig: 0, color:'blue'});
const penstrokes = ref([{d:'',color:'blue',size:2}]);
const highlighterstrokes = ref([{d:'',color:'orange'}]);
const layers = ref({penstrokes: true, highlighterstrokes: true});
const selection = ref({penstrokes: [], highlighterstrokes: []});

export default {
  mode,
  background,
  cover,
  penstrokes,
  highlighterstrokes,
  layers,
  selection
}
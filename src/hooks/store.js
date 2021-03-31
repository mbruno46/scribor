import { ref } from 'vue';

const mode = ref('');
const background = ref({
  type: 1,
  style: 0,
  color: 'white'
});
const penstrokes = ref([{d:'',color:'var(--pen-color-blue)',size:2}]);
const highlighterstrokes = ref([{d:'',color:'var(--pen-color-orange)'}]);
// const pages = ref({});


export default {
  mode,
  background,
  penstrokes,
  highlighterstrokes
}
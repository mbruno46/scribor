import { ref } from 'vue';

const mode = ref('');
const background = ref({
  type: 1,
  style: 0,
  color: 'white'
});
const penstrokes = ref([]);
const highlighterstrokes = ref([]);
// const pages = ref({});

export default {
  mode,
  background,
  penstrokes,
  highlighterstrokes
}
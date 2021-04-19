<script>
import pointertools from '@/hooks/pointertools'
import store from '@/hooks/store'
import history from '@/hooks/history'

export default {
  setup() {
    var erasing = false;

    function start() {erasing = true;}

    function move(e) {
      e.preventDefault();
      if (erasing) {
        let t = e.target;
        let tags = t.id.split(':');
        let g = t.parentElement.id;
        if (tags[0]) {
          if (store.layers.value[g]) {
            history.checkpoint();
            store[tags[0]].value.splice(tags[1],1);
            history.saveState();
          }
        }
      }
    }

    function end() {erasing=false;}

    const {on, off} = pointertools.layer(start, move, end)

    return {
      on,
      off
    }
  },
}
</script>
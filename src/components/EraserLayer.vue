<script>
import pointertools from '@/hooks/pointertools'
import store from '@/hooks/store'
import history from '@/hooks/history'

export default {
  setup() {
    var erasing = false;

    function start(e) {
      if (!pointertools.safedown(e)) {return;}
      erasing = true;
    }

    function move(e) {
      if (erasing) {
        e.preventDefault();
        let t = pointertools.safetarget(e);

        let tags = t.id.split(':');
        let g = t.parentElement.id;
        if (tags[0]) {
          if (store.layers.value[g]) {
            store[tags[0]].value.splice(tags[1],1);
            history.checkpoint();
          }
        }
      }
    }

    function end(e) {
      erasing=false;
      e.preventDefault();
    }

    const {on, off} = pointertools.layer(start, move, end)

    return {
      on,
      off
    }
  },
}
</script>
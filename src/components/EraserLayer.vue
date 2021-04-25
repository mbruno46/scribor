<script>
import pointertools from '@/hooks/pointertools'
import store from '@/hooks/store'
import history from '@/hooks/history'

export default {
  setup() {
    var erasing = false;
    var erased = false;

    function start(e) {
      if (!pointertools.safedown(e)) {return;}
      erasing = true;
    }

    function move(e) {
      if (erasing) {
        e.preventDefault();
        let t = pointertools.safetargets(e);

        for (var i=0;i<t.length;i++) {
          let tags = t[i].id.split(':');
          if (tags[0]) {
            let g = t[i].parentElement.id;
            if (store.layers.value[g]) {
              store[tags[0]].value.splice(tags[1],1);
              erased = true;
            }
          }
        }
      }
    }

    function end(e) {
      if (erasing) {
        erasing=false;
        e.preventDefault();
        if (erased) {
          history.checkpoint();
        }
      }
    }

    const {on, off} = pointertools.layer(start, move, end)

    return {
      on,
      off
    }
  },
}
</script>
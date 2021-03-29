<script>
import pointertools from '@/hooks/pointertools'
import store from '@/hooks/store'

export default {
  setup() {
    var erasing = false;

    function start() {erasing = true;}

    function move(e) {
      if (erasing) {
        let tags = e.target.id.split(':');
        if (tags[0]) {store[tags[0]].value.splice(tags[1],1);}
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
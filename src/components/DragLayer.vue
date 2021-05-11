<script>
import store from '../hooks/store'
import { newSVGNode, flattenSVG } from '../hooks/utils'
import pointertools from '@/hooks/pointertools'
import Drag from '@/hooks/dragtools'

export default {
  setup() {
    const {start, move, end, moveto} = Drag();

    function moveSelected() {
      for (var k in store.selection) {
        store.selection[k].forEach((idx) => {
          let el = store[k].value[idx];
          if (k!='images') {
            let newel = flattenSVG(newSVGNode('path', {d: el.d}),
              ['translate(' + moveto.dx + ',' + moveto.dy + ')']);
            el.d = newel[0].getAttribute('d');
          }
          else {
            el.x += moveto.dx;
            el.y += moveto.dy;
          }
        })
      }
    }

    function move_callback(e) {move(e,moveSelected);}

    const {on, off} = pointertools.layer(start, move_callback, end);

    return {
      on,
      off
    }
  },
}
</script>
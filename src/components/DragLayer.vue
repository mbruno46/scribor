<script>
import store from '../hooks/store'
import { newSVGNode, flattenSVG } from '../hooks/utils'
import pointertools from '@/hooks/pointertools'

export default {
  setup() {
    var moving;
    var moveto = {x0:0, y0:0, dx:0, dy:0};

    function moveSelected() {
      for (var k in store.selection) {
        store.selection[k].forEach((idx) => {
          let el = store[k].value[idx];
          let newel = flattenSVG(newSVGNode('path', {d: el.d}),
            ['translate(' + moveto.dx + ',' + moveto.dy + ')']);
          el.d = newel[0].getAttribute('d');
        })
      }
    }

    function start(e) {
      moving = true;
      let p = pointertools.position(e);
      moveto.x0 = p.x;
      moveto.y0 = p.y;
    }

    function move(e) {
      if (!moving) {return}
      let p = pointertools.position(e);
      moveto.dx = p.x - moveto.x0;
      moveto.dy = p.y - moveto.y0;
      moveto.x0 = p.x;
      moveto.y0 = p.y;
      moveSelected();
    }

    function end() {
      moving=false;
      moveto = {x0:0, y0:0, dx:0, dy:0};
    }

    const {on, off} = pointertools.layer(start, move, end);

    return {
      on,
      off
    }
  },
}
</script>
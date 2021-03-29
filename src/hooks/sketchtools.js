const smoothing = 0.25;

function line (a, b) {
  var lenX = b[0] - a[0];
  var lenY = b[1] - a[1];
  return {
    length: Math.sqrt(Math.pow(lenX, 2) + Math.pow(lenY, 2)),
    angle: Math.atan2(lenY, lenX)
  }
}

function joint(current, prev, next, reverse) {
  var p = prev || current, n = next || current;
  var o = line(p, n)
  var angle = o.angle + (reverse ? Math.PI : 0)
  var length = o.length * smoothing;
  var x = current[0] + Math.cos(angle) * length
  var y = current[1] + Math.sin(angle) * length;
  return [x, y];
}

export function optimize(points, command) {
  var d = points.reduce(function(acc, point, i, a) {
    return i === 0 ? 'M '+ point[0] +','+ point[1] : acc +' '+ command(point, i, a);
  }, 0);
  return d;
}

export function bezier(point, i, a) {
  var cps = joint (a[i - 1], a[i - 2], point);
  var cpe = joint (point, a[i - 1], a[i + 1], true);
  return 'C '+cps[0]+','+cps[1]+' '+cpe[0]+','+cpe[1]+' '+point[0]+','+point[1];
}

export function smoother(_n, first) {
  var points = [first]
  var cache = [first]
  var n=_n;

  function smear_cache() {
    let m = [0,0];
    for (var i=0;i<cache.length;i++) {
      m[0] += cache[i][0];
      m[1] += cache[i][1];
    }
    m[0] /= n;
    m[1] /= n;
    return m;
  }
  
  return {
    addPoint(p) {
      if (cache.length<n) {
        cache[cache.length] = p;
        return false;
      }
      else {
        points[points.length] = smear_cache();
        cache = [];
        cache[0] = p;
        return true;
      }
    },
    getPoints() {
      return points.concat(cache);
    },
    finalizePoints() {
      if (cache.length<n) {
        points[points.length] = cache[cache.length-1];
      }
      else {
        points[points.length] = smear_cache();
      }
      return points;
    }
  }
}

// export default {
//   optimize,
//   bezier
// }
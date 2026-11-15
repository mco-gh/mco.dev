// Geometry helpers for spine quadrilaterals. A quad is four [x, y] points,
// clockwise from the upper-left corner as the spine appears in the image.

export function area(poly) {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

export function centroid(poly) {
  let x = 0;
  let y = 0;
  for (const [px, py] of poly) {
    x += px;
    y += py;
  }
  return [x / poly.length, y / poly.length];
}

export function bounds(poly) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function signedArea(poly) {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

/** A quad the pipeline can use: four finite points, convex, with real area. */
export function isUsableQuad(quad, minArea = 1) {
  if (!Array.isArray(quad) || quad.length !== 4) return false;
  if (!quad.every((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]))) return false;
  if (area(quad) < minArea) return false;
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = quad[i];
    const [bx, by] = quad[(i + 1) % 4];
    const [cx, cy] = quad[(i + 2) % 4];
    const cross = (bx - ax) * (cy - by) - (by - ay) * (cx - bx);
    if (cross === 0) continue;
    if (sign && Math.sign(cross) !== sign) return false;
    sign = Math.sign(cross);
  }
  return true;
}

/** Sutherland-Hodgman clip of a convex polygon against another convex polygon. */
function clip(subject, clipper) {
  let output = subject;
  const orientation = Math.sign(signedArea(clipper)) || 1;
  for (let i = 0; i < clipper.length && output.length; i++) {
    const a = clipper[i];
    const b = clipper[(i + 1) % clipper.length];
    const inside = (p) => orientation * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= 0;
    const intersect = (p, q) => {
      const dx1 = b[0] - a[0];
      const dy1 = b[1] - a[1];
      const dx2 = q[0] - p[0];
      const dy2 = q[1] - p[1];
      const denom = dx1 * dy2 - dy1 * dx2;
      if (denom === 0) return q;
      const t = ((p[0] - a[0]) * dy2 - (p[1] - a[1]) * dx2) / denom;
      return [a[0] + t * dx1, a[1] + t * dy1];
    };
    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const current = input[j];
      const previous = input[(j + input.length - 1) % input.length];
      if (inside(current)) {
        if (!inside(previous)) output.push(intersect(previous, current));
        output.push(current);
      } else if (inside(previous)) {
        output.push(intersect(previous, current));
      }
    }
  }
  return output;
}

export function intersectionArea(a, b) {
  const clipped = clip(a, b);
  return clipped.length >= 3 ? area(clipped) : 0;
}

/** Share of the smaller quad that the two quads have in common (0..1). */
export function overlapOfSmaller(a, b) {
  const smaller = Math.min(area(a), area(b));
  return smaller > 0 ? intersectionArea(a, b) / smaller : 0;
}

function lineIntersection(p1, p2, p3, p4) {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  if (Math.abs(d) < 1e-9) return null;
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
}

/**
 * Nudge each edge of a quad onto the strongest nearby image edge.
 *
 * The model places spine outlines within a few pixels of the true boundary;
 * the photo itself knows exactly where the boundary is. For every edge we try
 * small shifts of its two endpoints along the edge normal and keep the shift
 * with the highest average contrast across the edge. An edge only moves when
 * the new position is clearly better, so outlines over low-contrast areas stay
 * where the model put them.
 *
 * @param {number[][]} quad points in the grayscale image's pixel space
 * @param {{data: Uint8Array, width: number, height: number}} gray
 */
export function snapQuadToEdges(quad, gray, { maxShiftRatio = 0.3, maxShift = 14, steps = 6, samples = 28 } = {}) {
  const { data, width, height } = gray;
  const lum = (x, y) => {
    const xi = Math.min(width - 1, Math.max(0, Math.round(x)));
    const yi = Math.min(height - 1, Math.max(0, Math.round(y)));
    return data[yi * width + xi];
  };
  const length = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

  const lines = [];
  for (let i = 0; i < 4; i++) {
    const a = quad[i];
    const b = quad[(i + 1) % 4];
    const len = length(a, b);
    if (len < 4) return quad;
    // Unit normal; its sign does not matter because we use absolute contrast.
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    // How far this edge may travel: a fraction of the quad's extent across it.
    const across = Math.min(length(quad[(i + 3) % 4], a), length(b, quad[(i + 2) % 4]));
    const reach = Math.min(maxShift, across * maxShiftRatio);
    if (reach < 1) {
      lines.push([a, b]);
      continue;
    }

    // Contrast across the edge at each (sample point, shift) pair, computed once.
    const shifts = [];
    for (let s = -steps; s <= steps; s++) shifts.push((s / steps) * reach);
    const table = shifts.map((shift) => {
      const row = new Float32Array(samples);
      for (let k = 0; k < samples; k++) {
        const t = 0.1 + (0.8 * k) / (samples - 1); // skip the corners
        const px = a[0] + (b[0] - a[0]) * t + nx * shift;
        const py = a[1] + (b[1] - a[1]) * t + ny * shift;
        row[k] = Math.abs(lum(px + nx * 2, py + ny * 2) - lum(px - nx * 2, py - ny * 2));
      }
      return row;
    });
    const score = (ia, ib) => {
      // Endpoint a uses shift ia, endpoint b uses shift ib; interpolate between.
      let sum = 0;
      for (let k = 0; k < samples; k++) {
        const t = 0.1 + (0.8 * k) / (samples - 1);
        sum += table[Math.round(ia + (ib - ia) * t)][k];
      }
      return sum / samples;
    };

    const still = score(steps, steps);
    let best = { value: still, ia: steps, ib: steps };
    for (let ia = 0; ia < shifts.length; ia++) {
      for (let ib = 0; ib < shifts.length; ib++) {
        if (Math.abs(ia - ib) > steps / 2) continue; // limit how much an edge may rotate
        const travel = (Math.abs(ia - steps) + Math.abs(ib - steps)) / (2 * steps);
        const value = score(ia, ib) * (1 - 0.35 * travel); // prefer staying close
        if (value > best.value) best = { value, ia, ib };
      }
    }
    const moved = best.value > still * 1.2 + 2;
    const sa = moved ? shifts[best.ia] : 0;
    const sb = moved ? shifts[best.ib] : 0;
    lines.push([
      [a[0] + nx * sa, a[1] + ny * sa],
      [b[0] + nx * sb, b[1] + ny * sb],
    ]);
  }

  // Rebuild corners where neighbouring (shifted) edges meet.
  const snapped = [];
  for (let i = 0; i < 4; i++) {
    const prev = lines[(i + 3) % 4];
    const cur = lines[i];
    const corner = lineIntersection(prev[0], prev[1], cur[0], cur[1]);
    if (!corner || length(corner, quad[i]) > maxShift * 2.5) return quad;
    snapped.push(corner);
  }
  return isUsableQuad(snapped) ? snapped : quad;
}

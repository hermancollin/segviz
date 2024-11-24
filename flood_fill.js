function extractConnectedComponents(seg) {
  seg.loadPixels();
  let components = [];
  let centroids = [];
  let visited = new Array(seg.width * seg.height).fill(false);

  function floodFill(x, y) {
    let stack = [[x, y]];
    let component = [];
    let minX = x, maxX = x, minY = y, maxY = y;

    while (stack.length > 0) {
      let [cx, cy] = stack.pop();
      let index = (cy * seg.width + cx) * 4;

      if (cx < 0 || cx >= seg.width || cy < 0 || cy >= seg.height || visited[cy * seg.width + cx] || seg.pixels[index + 3] === 0) {
        continue;
      }

      visited[cy * seg.width + cx] = true;
      component.push([cx, cy]);

      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    return { component, minX, maxX, minY, maxY };
  }

  for (let y = 0; y < seg.height; y++) {
    for (let x = 0; x < seg.width; x++) {
      let index = (y * seg.width + x) * 4;
      if (!visited[y * seg.width + x] && seg.pixels[index + 3] !== 0) {
        let { component, minX, maxX, minY, maxY } = floodFill(x, y);
        let centroidX = (minX + maxX) / 2;
        let centroidY = (minY + maxY) / 2;

        if (component.length > 0) {
          components.push(component);
          centroids.push({ x: centroidX, y: centroidY });
        }
      }
    }
  }
  return {components, centroids};
}
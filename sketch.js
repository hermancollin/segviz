let img, seg;
let components = [];
let centroids = [];

function setup() {
  img = loadImage('data/img.png', imgLoaded);
  seg = loadImage('data/seg.png', segLoaded);

  createCanvas(600, 600);
  // pixelDensity(1);
  noStroke();
  angleMode(degrees);

}

function imgLoaded() {
  console.log('Image loaded:', img.width, img.height);
}

function segLoaded() {
  console.log('Segmentation loaded:', seg.width, seg.height);
  ({ components, centroids } = extractConnectedComponents(seg));
  console.log('Connected components:', components.length);
}

function draw() {
  // assuming the image is square
  let scale_factor = 600 / img.width
  scale(scale_factor)
  background(0);
  
  image(img, 0, 0, img.width, img.height)

  // OLD ANIMATION (BORING)
  // push()
  // alpha = 150 * abs(cos(frameCount / 50))
  // tint(255, 150 - alpha)
  // image(seg, 0, 0, seg.width, seg.height)
  // pop()

  for (let i = 0; i < centroids.length; i++) {
    let axonCentroid = centroids[i];
    if (dist(mouseX, mouseY, axonCentroid.x * scale_factor, axonCentroid.y * scale_factor) < 50) {
      axon = components[i];
      drawComponent(axon);
    }
  }
}

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

function isMouseOverComponent(component, radius=50) {
  for (let i = 0; i < component.length; i++) {
    let [x, y] = component[i];
    let scaledX = x * (600 / img.width);
    let scaledY = y * (600 / img.height);
    if (dist(mouseX, mouseY, scaledX, scaledY) < 50) {
      return true;
    }
  }
  return false;
}

function drawComponent(component) {
  fill(255, 0, 0, 150);
  beginShape();
  for (let i = 0; i < component.length; i++) {
    let [x, y] = component[i];
    fill(0, 255, 0)
    vertex(x, y);
  }
  endShape(CLOSE);
}
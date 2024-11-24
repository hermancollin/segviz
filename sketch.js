let img, seg;
let components = [];
let centroids = [];

// vars for random walk
var x, y;
var t1 = 0;
var t2 = 1;

function setup() {
  img = loadImage('data/img.png', imgLoaded);
  seg = loadImage('data/seg.png', segLoaded);

  createCanvas(600, 600);
  // pixelDensity(1);
  noStroke();
  angleMode(degrees);

  visual_style = createSelect();
  visual_style.position(0, 610);
  visual_style.option('Follow mouse');
  visual_style.option('Random walk');
  visual_style.option('Scan');

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
  let scale_factor = width / img.width
  let radius = 50;
  scale(scale_factor)
  background(0);
  
  image(img, 0, 0, img.width, img.height)

  // OLD ANIMATION (BORING)
  // push()
  // alpha = 150 * abs(cos(frameCount / 50))
  // tint(255, 150 - alpha)
  // image(seg, 0, 0, seg.width, seg.height)
  // pop()

  switch (visual_style.value()) { 
    case 'Follow mouse':
      for (let i = 0; i < centroids.length; i++) {
        let axonCentroid = centroids[i];
        if (dist(mouseX, mouseY, axonCentroid.x * scale_factor, axonCentroid.y * scale_factor) < radius) {
          axon = components[i];
          drawComponent(axon);
        }
      }
      break;
    case 'Random walk':
      x = map(noise(t1), 0, 1, 0, img.width);
      y = map(noise(t2), 0, 1, 0, img.height);
      for (let i = 0; i < centroids.length; i++) {
        let axonCentroid = centroids[i];
        if (dist(x, y, axonCentroid.x, axonCentroid.y) < radius*2) {
          axon = components[i];
          drawComponent(axon);
        }
      }
      t1 += 0.02;
      t2 += 0.02;
      break;
    case 'Scan':
      let t = t1 % 2;
      for (let i = 0; i < centroids.length; i++) {
        let axonCentroid = centroids[i];
        if (abs(-axonCentroid.y - 0.5 * axonCentroid.x + t * seg.width) < radius * 2) {
          axon = components[i];
          drawComponent(axon);
        }
      }
      t1 += 0.02;
      break;
  }
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
  fill(0, 150);
  beginShape();
  for (let i = 0; i < component.length; i++) {
    let [x, y] = component[i];
    fill(255, 191, 70)
    vertex(x, y);
  }
  endShape(CLOSE);
}
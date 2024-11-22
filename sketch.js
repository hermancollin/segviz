function setup() {
  img = loadImage('data/img.png');
  seg = loadImage('data/seg.png');

  createCanvas(600, 600);
  pixelDensity(1);
  noStroke();
  angleMode(degrees)
}

function draw() {
  // assuming the image is square
  let scale_factor = 600 / img.width
  scale(scale_factor)
  background(0);
  
  image(img, 0, 0, img.width, img.height)

  // mask block
  push()
  alpha = 150 * abs(cos(frameCount / 50))
  tint(255, 150 - alpha)
  image(seg, 0, 0, seg.width, seg.height)
  pop()
}
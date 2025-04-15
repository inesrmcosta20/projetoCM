let planeta, bg;
let luz = [];
let semluz = [];
let angle = 0;
let w = 200;
let h;

let aceso = [];
let tempoDesligar = [];

function preload() {
  // Carrega imagens (substitua pelos caminhos corretos)
  for (let i = 0; i < 3; i++) {
    semluz[i] = loadImage('imagens/candeeiro/semluz.png');
    luz[i] = loadImage('imagens/candeeiro/luz.png');
  }
  planeta = loadImage('imagens/candeeiro/planeta.png');
  bg = loadImage('imagens/candeeiro/fundo_lampiao.jpg');
}

function setup() {
  let canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.8);
  canvas.parent('p5-sketch');
  imageMode(CENTER);
  
  bg.resize(width, height);
  h = (luz[0].height / luz[0].width) * w;

  // Inicializa estados
  for (let i = 0; i < 3; i++) {
    aceso[i] = false;
    tempoDesligar[i] = 0;
  }
}

function draw() {
  background(bg);
  angle += 0.02;

  push();
  translate(width / 2, height / 2);
  rotate(angle);
  image(planeta, 0, 0, width * 0.2, width * 0.2);

  for (let i = 0; i < 3; i++) {
    push();
    rotate(TWO_PI * i / 3);
    
    if (aceso[i]) {
      image(luz[i], 0, -height * 0.3, w, h);
      if (millis() > tempoDesligar[i]) {
        aceso[i] = false;
      }
    } else {
      image(semluz[i], 0, -height * 0.3, w, h);
    }
    
    pop();
  }
  pop();
}

function mousePressed() {
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;
  
  for (let i = 0; i < 3; i++) {
    let rotatedX = dx * cos(-angle - TWO_PI * i / 3) - dy * sin(-angle - TWO_PI * i / 3);
    let rotatedY = dx * sin(-angle - TWO_PI * i / 3) + dy * cos(-angle - TWO_PI * i / 3);
    
    if (!aceso[i] && dist(rotatedX, rotatedY, 0, -height * 0.3) < max(w, h) / 2) {
      aceso[i] = true;
      tempoDesligar[i] = millis() + random(1000, 3000);
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);
  bg.resize(width, height);
}
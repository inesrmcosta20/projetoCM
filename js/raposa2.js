// Global variables
let video, handpose, predictions = [];
let perguntasDisponiveis = [];
let perguntaAtual = null;
let raposaIndex = 1;
let emCooldown = false;
let tempoEspera = 3000; // 3 seconds between questions
let emojiAtivo = false;
let emojiGesto = null;
let jogoCompleto = false;

// Correct answers mapping
const respostasCorretas = {
  p: 'thumbs_up',
  p0: 'thumbs_up',
  p1: 'thumbs_up',
  p2: 'thumbs_up',
  p3: 'thumbs_down',
  p4: 'thumbs_down',
  p5: 'thumbs_up', 
  p6: 'thumbs_down', 
   p7: 'thumbs_up',
  p8: 'thumbs_down', 
  p9: 'thumbs_up', 
   p10: 'thumbs_up' 
};

// Feedback sounds
const somCorreto = new Audio('audios/correto.mp3');
const somIncorreto = new Audio('audios/errado.mp3');

// Handpose model initialization
function modelReady() {
  console.log("Handpose model ready!");
  handpose.on("predict", results => {
    predictions = results;
  });
  
  inicializarPerguntas();
  mostrarNovaPergunta();
}

// Initialize questions
function inicializarPerguntas() {
  perguntasDisponiveis = Array.from(document.querySelectorAll('.perguntaA'));
  esconderTodasPerguntas();
}

// Hide all questions
function esconderTodasPerguntas() {
  perguntasDisponiveis.forEach(p => p.style.display = 'none');
}

// Show random question
function mostrarNovaPergunta() {
  if (jogoCompleto) return;
  
  if (perguntaAtual) perguntaAtual.style.display = 'none';
  
  if (perguntasDisponiveis.length === 0) {
    perguntasDisponiveis = Array.from(document.querySelectorAll('.perguntaA'));
  }
  
  let novaPergunta;
  do {
    const randomIndex = Math.floor(Math.random() * perguntasDisponiveis.length);
    novaPergunta = perguntasDisponiveis[randomIndex];
  } while (perguntasDisponiveis.length > 1 && novaPergunta === perguntaAtual);
  
  perguntaAtual = novaPergunta;
  perguntaAtual.style.display = 'block';
  
  // Activate cooldown
  emCooldown = true;
  emojiAtivo = false;
  
  setTimeout(() => {
    emCooldown = false;
  }, tempoEspera);
}

// Update fox position
function atualizarRaposa() {
  for (let i = 1; i <= 5; i++) {
    const raposa = document.getElementById(`raposa${i}`);
    if (raposa) raposa.style.display = i === raposaIndex ? 'block' : 'none';
  }
}

// Show feedback emoji
function mostrarEmoji(gesto) {
  emojiGesto = gesto;
  emojiAtivo = true;
  
  setTimeout(() => {
    emojiAtivo = false;
  }, tempoEspera);
}

// Verify answer
function verificarResposta(gesto) {
  if (emCooldown || !perguntaAtual || jogoCompleto) return;
  
  const respostaEsperada = respostasCorretas[perguntaAtual.id];
  
  if (gesto === respostaEsperada) {
    somCorreto.play();
    if (raposaIndex < 5) raposaIndex++;
    emojiAtual = '👍';
  } else {
    somIncorreto.play();
    if (raposaIndex > 1) raposaIndex--;
    emojiAtual = '👎';
  }
  
  tempoUltimoEmoji = millis(); // Registra o momento que o emoji foi mostrado
  atualizarRaposa();
  mostrarNovaPergunta();
  
  if (raposaIndex === 5) {
    mostrarBotaoSucesso();
  }
}

// Detect hand gesture
function detectarGesto() {
  if (!predictions || predictions.length === 0) return null;
  
  for (let prediction of predictions) {
    const annotations = prediction.annotations;
    const thumbTip = annotations.thumb[3];
    const wrist = annotations.palmBase[0];
    
    const verticalDiff = thumbTip[1] - wrist[1];
    const MIN_VERTICAL_DIFF = 50;
    
    if (verticalDiff < -MIN_VERTICAL_DIFF) return 'thumbs_up';
    if (verticalDiff > MIN_VERTICAL_DIFF) return 'thumbs_down';
  }
  
  return null;
}

// Show success button
function mostrarBotaoSucesso() {
  jogoCompleto = true;
  
  // Stop hand detection
  if (handpose) {
    handpose.off("predict");
    predictions = [];
  }
  
  // Stop webcam
  if (video) {
    video.stop();
    video.remove();
    video = null;
  }
  
  // Hide all questions
  esconderTodasPerguntas();
  
  // Hide webcam container
  const webcamContainer = document.getElementById('webcam-container');
  if (webcamContainer) {
    webcamContainer.style.display = 'none';
  }
  
  // Create success button
  const btn = document.createElement('button');
  btn.id = "botao-final";
  btn.textContent = "Parabéns! Avançar";
  btn.style.position = 'fixed';
  btn.style.top = '50%';
  btn.style.left = '50%';
  btn.style.transform = 'translate(-50%, -50%)';
  btn.style.zIndex = '1000';
  btn.style.padding = '15px 30px';
  btn.style.backgroundColor = '#4CAF50';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.fontSize = '18px';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  
  btn.onclick = () => {
    window.location.href = "proxima-pagina.html";
  };
  
  document.body.appendChild(btn);
}

// p5.js setup
function setup() {
  const canvas = createCanvas(320, 240);
  canvas.parent('webcam-container');
  
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  handpose = ml5.handpose(video, { 
    flipHorizontal: true,
    maxContinuousChecks: Infinity,
    detectionConfidence: 0.8,
    scoreThreshold: 0.75
  }, modelReady);
}

// p5.js draw loop
function draw() {
  if (jogoCompleto) return;
  
  clear();
  
  // Mirror webcam
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
  
  // Draw thumb tip when active
  if (!emCooldown && predictions && predictions.length > 0) {
    const prediction = predictions[0];
    const thumbTip = prediction.annotations.thumb[3];
    
    //polegar
    fill(0, 255, 0);
    noStroke();
    ellipse(thumbTip[0], thumbTip[1], 15);
    
    // Detect gestures
    const gesto = detectarGesto();
    if (gesto) {
      verificarResposta(gesto);
    }
  }
  
}
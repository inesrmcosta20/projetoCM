// raposa.js
let video;
let handPose;
let hands;
let currentQuestion = 0;
let foxIndex = 0;
let lastPose = null;
let poseTimeout = null;

let webcamContainer;


// Configuração das perguntas e respostas
const questions = [
  { id: "p1", answer: "positive" },  // thumbsup
  { id: "p2", answer: "positive" },  // 
  { id: "p3", answer: "positive" },  // thumbsup
  { id: "p4", answer: "positive" },   // thumbsdown
  { id: "p5", answer: "negative" }   // thumbsdown
];

// IDs das imagens da raposa em ordem
const foxImages = ["raposa1", "raposa2", "raposa3"];

function modelReady() {
  console.log('hand pose loaded');
  handpose.on('predict', results => {
    hands = results;
  });
}

function setup() {
    // Cria um canvas com tamanho proporcional à webcam (640x480 padrão)
    const canvas = createCanvas(500, 375); // 500x375 mantém proporção 4:3
    canvas.parent('webcam-container'); // Associa ao container
    
   
    
    // Configura a webcam
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    
    
    // Estilo adicional para o canvas
  canvas.elt.style.border = '3px solid white';
  canvas.elt.style.borderRadius = '8px';
  canvas.elt.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
  
  // Inicializa o handpose
  handpose = ml5.handpose(video, { flipHorizontal: true }, modelReady);
  
  // Mostra a primeira pergunta
  if (questions.length > 0) {
    showQuestion(currentQuestion);
  }
}

  function draw() {
    // Limpa apenas o canvas da webcam
    clear();
    
    // Desenha a webcam no canvas
    if (video) {
      // Desenha o vídeo espelhado 
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
    }
    
    detectPose();
  }
  function positionWebcam(x, y) {
    if (webcamContainer) {
      webcamContainer.style('right', x + 'px');
      webcamContainer.style('top', y + 'px');
    }
  }
  
function showQuestion(index) {
    // Esconde todas as perguntas primeiro
    document.querySelectorAll('.pergunta').forEach(q => {
      q.style.display = 'none';
    });
    
    // Mostra a pergunta atual
    if (questions[index] && document.getElementById(questions[index].id)) {
      document.getElementById(questions[index].id).style.display = "block";
    }
  }
  
function detectPose() {
  if (hands && hands.length > 0) {
    for (let hand of hands) {
      let annotations = hand.annotations;
      let thumb = annotations.thumb;
      let ty = thumb[3][1];

      let thumbsup = true;
      let thumbsdown = true;

      let parts = Object.keys(annotations);
      for (let part of parts) {
        for (let position of annotations[part]) {
          let [x, y, z] = position;
          if (y < ty) thumbsup = false;
          if (y > ty) thumbsdown = false;
        }
      }

      // Detecta a pose atual
      let currentPose = null;
      if (thumbsup) currentPose = "positive";
      if (thumbsdown) currentPose = "negative";

      // Verifica se a pose mudou e é válida
      if (currentPose && currentPose !== lastPose) {
        lastPose = currentPose;
        
        // Limpa timeout anterior
        if (poseTimeout) clearTimeout(poseTimeout);
        
        // Espera 1 segundo antes de verificar a resposta
        poseTimeout = setTimeout(() => {
          checkAnswer(currentPose);
        }, 1000);
      }
    }
  }
}

function checkAnswer(pose) {
    if (questions.length === 0) return;
    
    const correctAnswer = questions[currentQuestion].answer;
    
    // Muda a pergunta independentemente de acerto ou erro
    nextQuestion();
    
    // Controla a raposa conforme acerto/erro
    if (pose === correctAnswer) {
      nextFox();
    } else {
      previousFox();
    }
  }

  function nextQuestion() {
    if (questions.length === 0) return;
    
    // Avança para próxima pergunta
    currentQuestion = (currentQuestion + 1) % questions.length;
    showQuestion(currentQuestion);
  }
  
function nextFox() {
  // Avança a raposa se não estiver na última imagem
  if (foxIndex < foxImages.length - 1) {
    document.getElementById(foxImages[foxIndex]).style.display = "none";
    foxIndex++;
    document.getElementById(foxImages[foxIndex]).style.display = "block";
  }
}

function previousFox() {
  // Recua a raposa se não estiver na primeira imagem
  if (foxIndex > 0) {
    document.getElementById(foxImages[foxIndex]).style.display = "none";
    foxIndex--;
    document.getElementById(foxImages[foxIndex]).style.display = "block";
  }
}
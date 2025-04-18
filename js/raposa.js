// raposa.js
<<<<<<< Updated upstream
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
=======

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da raposa
    const raposa1 = document.getElementById('raposa1');
    const raposa2 = document.getElementById('raposa2');
    const raposa3 = document.getElementById('raposa3');
    
    // Elementos das perguntas
    const perguntas = [
        document.getElementById('p1'),
        document.getElementById('p2'),
        document.getElementById('p3'),
        document.getElementById('p4'),
        document.getElementById('p5')
    ];
    
    // Configuração da webcam e handpose
    let video;
    let canvas;
    let ctx;
    let model;
    let currentPergunta = 0;
    
    // Inicializar a webcam e o modelo
    async function init() {
        try {
            // Criar elementos de vídeo e canvas
            video = document.createElement('video');
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            
            // Estilizar o canvas para ficar em background
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1';
            canvas.style.opacity = '0'; // Tornamos transparente para não ver a webcam
            canvas.style.pointerEvents = 'none';
            
            // Obter stream da webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
            
            // Configurar canvas
            ctx = canvas.getContext('2d');
            
            // Carregar modelo Handpose
            model = await handpose.load();
            
            // Iniciar detecção
            detectHand();
            
            // Mostrar a primeira pergunta
            showPergunta(0);
            
        } catch (err) {
            console.error("Erro ao inicializar:", err);
            // Fallback para interação manual caso a webcam falhe
            setupManualControls();
        }
    }
    
    // Função para detectar poses da mão
    async function detectHand() {
        // Redimensionar canvas para match com o vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Detectar mãos
        const predictions = await model.estimateHands(video);
        
        if (predictions.length > 0) {
            const hand = predictions[0];
            const thumbTip = hand.annotations.thumb[3];
            const indexTip = hand.annotations.indexFinger[3];
            
            // Verificar se é thumbs up ou thumbs down
            if (isThumbsUp(hand)) {
                handleThumbsUp();
            } else if (isThumbsDown(hand)) {
                handleThumbsDown();
            }
        }
        
        // Continuar detecção
        requestAnimationFrame(detectHand);
    }
    
    // Verificar se é thumbs up
    function isThumbsUp(hand) {
        const thumbTip = hand.annotations.thumb[3];
        const indexTip = hand.annotations.indexFinger[3];
        const middleTip = hand.annotations.middleFinger[3];
        
        // Thumbs up: polegar para cima, outros dedos fechados
        return thumbTip[1] < indexTip[1] &&  // Polegar acima do indicador
               indexTip[1] > middleTip[1];   // Indicador abaixo do médio
    }
    
    // Verificar se é thumbs down
    function isThumbsDown(hand) {
        const thumbTip = hand.annotations.thumb[3];
        const indexTip = hand.annotations.indexFinger[3];
        const middleTip = hand.annotations.middleFinger[3];
        
        // Thumbs down: polegar para baixo, outros dedos fechados
        return thumbTip[1] > indexTip[1] &&  // Polegar abaixo do indicador
               indexTip[1] < middleTip[1];   // Indicador acima do médio
    }
    
    // Manipulador para thumbs up
    function handleThumbsUp() {
        console.log("Thumbs Up detectado!");
        nextPergunta();
    }
    
    // Manipulador para thumbs down
    function handleThumbsDown() {
        console.log("Thumbs Down detectado!");
        previousPergunta();
    }
    
    // Mostrar pergunta específica
    function showPergunta(index) {
        // Esconder todas as perguntas
        perguntas.forEach(p => p.style.display = 'none');
        
        // Mostrar a pergunta atual
        perguntas[index].style.display = 'block';
        currentPergunta = index;
        
        // Atualizar animação da raposa conforme a pergunta
        updateRaposaAnimation(index);
    }
    
    // Próxima pergunta
    function nextPergunta() {
        if (currentPergunta < perguntas.length - 1) {
            showPergunta(currentPergunta + 1);
        }
    }
    
    // Pergunta anterior
    function previousPergunta() {
        if (currentPergunta > 0) {
            showPergunta(currentPergunta - 1);
        }
    }
    
    // Atualizar animação da raposa conforme a pergunta
    function updateRaposaAnimation(perguntaIndex) {
        // Esconder todas as raposas
        raposa1.style.display = 'none';
        raposa2.style.display = 'none';
        raposa3.style.display = 'none';
        
        // Mostrar a raposa apropriada
        if (perguntaIndex % 3 === 0) {
            raposa1.style.display = 'block';
        } else if (perguntaIndex % 3 === 1) {
            raposa2.style.display = 'block';
        } else {
            raposa3.style.display = 'block';
        }
    }
    
  
    
    // Inicializar tudo
    init();
});
>>>>>>> Stashed changes

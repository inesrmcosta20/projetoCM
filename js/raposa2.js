let video;
let handpose;
let predictions = [];

let perguntasArray = [];        // Array com os elementos DOM das perguntas
let perguntasRestantes = [];    // Perguntas ainda não usadas
let perguntaAtual = null;       // Referência à pergunta atual
let perguntaAtualId = '';       // ID da pergunta atual, para mapeamento de resposta

let raposaIndex = 1;
let cooldown = false;
let esperandoNovaPergunta = false; // tempo de pausa entre perguntas

let somCorreto = new Audio('audios/correto.mp3');
let somIncorreto = new Audio('audios/errado.mp3');

let respostaCerta = {
  p1: 'thumbs_up',
  p2: 'thumbs_up',
  p3: 'thumbs_up',
  p4: 'thumbs_down',
  p5: 'thumbs_down',
  p6: 'thumbs_up',
  p7: 'thumbs_down',
  p8: 'thumbs_up'
};

function modelReady() {
  console.log("Modelo Handpose carregado!");
  handpose.on("predict", results => {
    predictions = results;
  });

  inicializarPerguntas();
  iniciarJogo();
}

function inicializarPerguntas() {
  perguntasArray = Array.from(document.querySelectorAll('.perguntaA'));
  perguntasRestantes = [...perguntasArray];
}

function iniciarJogo() {
  raposaIndex = 1;
  esconderTodasPerguntas();
  mostrarPerguntaAleatoria();
  mostrarRaposaAtual();
}

function esconderTodasPerguntas() {
  perguntasArray.forEach(p => p.style.display = 'none');
}

function mostrarPerguntaAleatoria() {
  if (perguntaAtual) perguntaAtual.style.display = 'none';

  if (perguntasRestantes.length === 0) {
    perguntasRestantes = [...perguntasArray];
  }

  const indice = Math.floor(Math.random() * perguntasRestantes.length);
  perguntaAtual = perguntasRestantes[indice];
  perguntasRestantes.splice(indice, 1);

  perguntaAtual.style.display = 'block';
  console.log("Nova pergunta:", perguntaAtual.id);

  // Bloqueia a detecção por 2 segundos
  esperandoNovaPergunta = true;
  setTimeout(() => {
    esperandoNovaPergunta = false;
  }, 2000);
}


function mostrarRaposaAtual() {
  for (let i = 1; i <= 5; i++) {
    let raposa = document.getElementById('raposa' + i);
    if (raposa) {
      raposa.style.display = (i === raposaIndex) ? 'block' : 'none';
      if (i === raposaIndex) {
        console.log(" Raposa exibida:", 'raposa' + i);
      }
    }
  }
}

function verificarResposta(gesture) {
  if (cooldown || esperandoNovaPergunta) return;

  cooldown = true;
  setTimeout(() => cooldown = false, 2000);

  let perguntaAtualId = perguntaAtual.id;
  let gestoEsperado = respostaCerta[perguntaAtualId];

  if (!gestoEsperado) {
    console.warn("⚠️ Pergunta não mapeada:", perguntaAtualId);
    return;
  }

  if (gesture === gestoEsperado) {
    somCorreto.play();
    console.log("✅ Resposta correta:", gesture);

    if (raposaIndex < 5) {
      raposaIndex++;
      mostrarRaposaAtual();
    } else {
      mostrarRaposaAtual();
      mostrarBotaoSucesso();
    }
  } else {
    somIncorreto.play();
    console.log("❌ Resposta incorreta:", gesture, "| Esperado:", gestoEsperado);
    if (raposaIndex > 1) raposaIndex--;
    mostrarRaposaAtual();
  }

  mostrarPerguntaAleatoria(); // Chamada em ambos os casos
}


function detectarGesto(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const wrist = landmarks[0];

  let dy = thumbTip[1] - wrist[1];
  let dx = Math.abs(thumbTip[0] - indexTip[0]);

  if (dy < -40 && dx < 50) return 'thumbs_up';
  if (dy > 40 && dx < 50) return 'thumbs_down';
  return null;
}

function mostrarBotaoSucesso() {
  if (document.getElementById("botao-final")) return;

  const btn = document.createElement('button');
  btn.id = "botao-final";
  btn.innerText = "Parabéns! Avançar";
  btn.style.position = 'absolute';
  btn.style.top = '50%';
  btn.style.left = '50%';
  btn.style.transform = 'translate(-50%, -50%)';
  btn.style.padding = '1em 2em';
  btn.style.fontSize = '1.5em';
  btn.style.zIndex = 100;
  btn.style.backgroundColor = '#4CAF50';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '10px';
  btn.onclick = () => alert("Você completou o desafio da raposa!");
  document.body.appendChild(btn);
}

/* ----------- P5.js ----------- */
function setup() {
  const canvas = createCanvas(500, 375);
  canvas.parent('webcam-container');

  video = createCapture(VIDEO);
  video.size(width, height);

  canvas.elt.style.border = '3px solid white';
  canvas.elt.style.borderRadius = '8px';
  canvas.elt.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

  handpose = ml5.handpose(video, { flipHorizontal: true }, modelReady);
}

function draw() {
  clear();

  if (video) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  }

  if (predictions.length > 0) {
    const gesture = detectarGesto(predictions[0].landmarks);
    if (gesture) {
      verificarResposta(gesture);
    }
  }
}


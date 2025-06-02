const videoElement = document.createElement('video');
const canvasElement = document.createElement('canvas');
const canvasCtx = canvasElement.getContext('2d');
document.getElementById('webcam-container').appendChild(videoElement);

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

let etapaAtual = 0; // 0: sorriso, 1: piscar 3x, 2: boca aberta, 3: balões aleatórios
let blinkCount = 0;
let eyesClosed = false;
let balaoAtual = 1;
let audioJaTocado = false;

let trocaBalaoCount = 0;
let intervaloBaloes;

// Inicializa a configuração do botão
document.addEventListener('DOMContentLoaded', configurarBotaoDesistir);

function mostrarBalao(numero) {
  if (etapaAtual === -1) return;

  balaoAtual = numero;
  audioJaTocado = false;

  if (etapaAtual === 3) {
    trocaBalaoCount++;
    if (trocaBalaoCount === 15) {
      const btnDesistir = document.getElementById("btnDesistir");
      if (btnDesistir) btnDesistir.style.display = "block";
    }
  }

  for (let i = 1; i <= 9; i++) {
    const balao = document.getElementById(`balao-fala${i}`);
    if (balao) {
      balao.classList.remove('fade-in');
      balao.classList.add('fade-out');
    }
  }

  const balao = document.getElementById(`balao-fala${numero}`);
  if (balao) {
    balao.classList.remove('fade-out');
    balao.classList.add('fade-in');
  }

    // Tocar áudio correto após 1 segundo se o balão for 6, 7 ou 9
  if ([4, 6, 7, 9].includes(numero)) {
    setTimeout(() => {
      const audioCorreto = document.getElementById('audio-correto');
      if (audioCorreto) {
        audioCorreto.pause();
        audioCorreto.currentTime = 0;
        audioCorreto.play();
      }
    }, 1000);
  }

  // Tocar áudio errado após 1 segundo se o balão for 4, 5 ou 8
  if ([5, 8].includes(numero)) {
    setTimeout(() => {
      const audioErrado = document.getElementById('audio-errado');
      if (audioErrado) {
        audioErrado.pause();
        audioErrado.currentTime = 0;
        audioErrado.play();
      }
    }, 1000);
  }
}

function onResults(results) {
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

  if (etapaAtual === -1) return;

  const landmarks = results.multiFaceLandmarks[0];

  const leftEAR = computeEAR([landmarks[33], landmarks[160], landmarks[158], landmarks[133], landmarks[153], landmarks[144]]);
  const rightEAR = computeEAR([landmarks[362], landmarks[385], landmarks[387], landmarks[263], landmarks[373], landmarks[380]]);
  const avgEAR = (leftEAR + rightEAR) / 2;

  const topLip = landmarks[13];
  const bottomLip = landmarks[14];
  const mouthOpenDistance = Math.abs(topLip.y - bottomLip.y);

  const leftMouthCorner = landmarks[61];
  const rightMouthCorner = landmarks[291];
  const mouthWidth = Math.abs(rightMouthCorner.x - leftMouthCorner.x);
  const lipDistance = mouthOpenDistance;
  const smileRatio = mouthWidth / (lipDistance || 0.0001);

  switch (etapaAtual) {
    case 0: // Sorriso
      if (smileRatio > 1.6 && lipDistance > 0.025) {
        etapaAtual = 1;
        document.getElementById("audio-correto").play();
        mostrarBalao(2);
      }
      break;

    case 1: // Piscar 3 vezes
      if (avgEAR < 0.2 && !eyesClosed) {
        eyesClosed = true;
      }

      if (avgEAR > 0.25 && eyesClosed) {
        eyesClosed = false;
        blinkCount++;

        if (blinkCount >= 2) {
          etapaAtual = 2;
          document.getElementById("audio-correto").play();
          mostrarBalao(3);
        }
      }
      break;

    case 2: // Boca aberta
      if (mouthOpenDistance > 0.06) {
        etapaAtual = 3;
        document.getElementById("audio-correto").play();

        for (let i = 1; i <= 3; i++) {
          const balao = document.getElementById(`balao-fala${i}`);
          if (balao) balao.classList.add('fade-out');
        }

        iniciarBaloesAleatorios();
      }
      break;

    case 3: // Balões aleatórios
      if (!audioJaTocado) {
        if (balaoAtual === 1 && smileRatio > 1.6 && lipDistance > 0.025) {
          document.getElementById("audio-correto").play();
          audioJaTocado = true;
        } else if (balaoAtual === 2 && avgEAR < 0.2) {
          document.getElementById("audio-correto").play();
          audioJaTocado = true;
        } else if (balaoAtual === 3 && mouthOpenDistance > 0.06) {
          document.getElementById("audio-correto").play();
          audioJaTocado = true;
        }
      }
      break;
  }
}

function computeEAR(eye) {
  const euclidean = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const a = euclidean(eye[1], eye[5]);
  const b = euclidean(eye[2], eye[4]);
  const c = euclidean(eye[0], eye[3]);
  return (a + b) / (2.0 * c);
}

function iniciarBaloesAleatorios() {
  if (intervaloBaloes) return; // evita múltiplos intervalos

  intervaloBaloes = setInterval(() => {
    const numero = Math.floor(Math.random() * 9) + 1; // De 1 a 9
    mostrarBalao(numero);
  }, 2500); // A cada 2.5 segundos
}

function pararBaloes() {
  if (intervaloBaloes) {
    clearInterval(intervaloBaloes);
    intervaloBaloes = null;
  }
}

camera.start()
  .then(() => {
    mostrarBalao(1);
  })
  .catch((err) => {
    console.error("Erro ao iniciar a câmara:", err);
  });

// Função para mostrar a tela fullscreen quando clicar em "Desistir"
function mostrarFullscreen() {
  pararBaloes();
  etapaAtual = -1; // Para o fluxo do jogo

  const fullscreenContainer = document.getElementById('fullscreen-container');
  document.body.classList.add('fullscreen-active');

  fullscreenContainer.innerHTML = `
          <div class="fullScreen-close" id="closeFullscreen">X</div>
    <div class="fullScreen-img-container">
      <img src="imagens/principe1.png" id="posicao1" alt="príncipe">
      <img src="imagens/rei/mensagem.png" id="posicao2" alt="mensagem"> 
    </div>
    <button id="homeButton">Finalizar</button>
  `;

  // Botão "X" para fechar
const closeBtn = document.getElementById('closeFullscreen');
closeBtn.addEventListener('click', function () {
    clearInterval(animacaoIntervalo);
    fullscreenContainer.style.display = 'none';
    document.body.classList.remove('fullscreen-active');
});

  const principeImg = document.getElementById('posicao1');
  let frame = 1;
  const maxFrames = 10;
  const intervalo = 150;

  const animacaoIntervalo = setInterval(() => {
    frame = frame >= maxFrames ? 1 : frame + 1;
    principeImg.src = `imagens/principe/principe${frame}.png`;
  }, intervalo);

  const homeButton = document.getElementById('homeButton');
        homeButton.addEventListener('click', function () {
            // Parar a animação ao sair
            clearInterval(animacaoIntervalo);

            // Ativar peça rodas no avião e desativar no cenário
            sessionStorage.setItem('desativarPecaCenario', 'peça-tirantes');
sessionStorage.setItem('animarPecaAviao', 'tirantes');

            window.location.href = 'index.html';
        });

  fullscreenContainer.style.display = 'flex';
}

// Configura o botão desistir para chamar mostrarFullscreen
function configurarBotaoDesistir() {
  const btnDesistir = document.getElementById('btnDesistir');
  if (btnDesistir) {
    btnDesistir.style.display = 'none'; // começa oculto
    btnDesistir.addEventListener('click', mostrarFullscreen);
  }
}

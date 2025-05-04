//raposa.js

let video;
let canvas;
let ctx;
let handposeModel;
let currentQuestion = 0;
let currentFoxIndex = 0;
let lastPose = null;
let poseTimeout = null;

const questions = [
  { id: "p1", answer: "positive" },
  { id: "p2", answer: "positive" },
  { id: "p3", answer: "positive" },
  { id: "p4", answer: "negative" },
  { id: "p5", answer: "negative" },
  { id: "p6", answer: "positive" },
  { id: "p7", answer: "negative" },
  { id: "p8", answer: "positive" },
];

const foxImages = ["raposa1", "raposa2", "raposa3", "raposa4"];

document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  // Criação de vídeo e canvas
  video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');
  video.style.display = 'none';
  document.body.appendChild(video);

  canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  canvas.style.border = '3px solid white';
  canvas.style.borderRadius = '8px';
  canvas.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  // Webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  // Modelo Handpose
  handposeModel = await handpose.load();

  // Primeira pergunta e raposa
  showQuestion(currentQuestion);
  showOnlyFox(currentFoxIndex);

  // Início da detecção
  detectLoop();
}

function detectLoop() {
  requestAnimationFrame(async () => {
    ctx.save();
    ctx.scale(-1, 1); // espelha horizontalmente
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    const predictions = await handposeModel.estimateHands(video, true);
    if (predictions.length > 0) {
      const pose = getPose(predictions[0]);

      if (pose && pose !== lastPose) {
        lastPose = pose;
        if (poseTimeout) clearTimeout(poseTimeout);
        poseTimeout = setTimeout(() => {
          checkAnswer(pose);
        }, 1000);
      }
    }

    detectLoop();
  });
}

function getPose(hand) {
  const thumbY = hand.annotations.thumb[3][1];
  let thumbsup = true;
  let thumbsdown = true;

  for (const part in hand.annotations) {
    for (const point of hand.annotations[part]) {
      const y = point[1];
      if (y < thumbY) thumbsup = false;
      if (y > thumbY) thumbsdown = false;
    }
  }

  if (thumbsup) return 'positive';
  if (thumbsdown) return 'negative';
  return null;
}

function checkAnswer(pose) {
  const expected = questions[currentQuestion].answer;

  if (pose === expected) {
    if (currentFoxIndex < foxImages.length - 1) {
      currentFoxIndex++;
      showOnlyFox(currentFoxIndex);
    }
  }

  // Avança pergunta
  currentQuestion = (currentQuestion + 1) % questions.length;
  showQuestion(currentQuestion);
}

function showQuestion(index) {
  document.querySelectorAll('.pergunta').forEach(p => p.style.display = 'none');
  const q = document.getElementById(questions[index].id);
  if (q) q.style.display = 'block';
}

function showOnlyFox(index) {
  foxImages.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.display = (i === index) ? 'block' : 'none';
  });
}

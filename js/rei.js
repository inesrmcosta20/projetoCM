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

camera.start()
  .then(() => {
    console.log("Câmera inicializada com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao acessar a câmera: ", err);
  });

let etapaAtual = 0; // 0: olhos, 1: boca, 2: sorriso

function onResults(results) {
  if (results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];

    const leftEAR = computeEAR([
      landmarks[33], landmarks[160], landmarks[158],
      landmarks[133], landmarks[153], landmarks[144]
    ]);
    const rightEAR = computeEAR([
      landmarks[362], landmarks[385], landmarks[387],
      landmarks[263], landmarks[373], landmarks[380]
    ]);
    const avgEAR = (leftEAR + rightEAR) / 2;

    const topLip = landmarks[13];
    const bottomLip = landmarks[14];
    const mouthOpenDistance = Math.abs(topLip.y - bottomLip.y);

    const leftMouthCorner = landmarks[61];
    const rightMouthCorner = landmarks[291];
    const mouthWidth = Math.abs(rightMouthCorner.x - leftMouthCorner.x);
    const lipDistance = Math.abs(topLip.y - bottomLip.y);
    const smileRatio = mouthWidth / lipDistance;

    switch (etapaAtual) {
      case 0: // Esperando piscar
        if (avgEAR < 0.2) {
          etapaAtual = 1;
          document.getElementById("audio-acerto").play();
          console.log("Etapa 1: Olhos fechados detectados");
        }
        break;

      case 1: // Esperando boca aberta
        if (mouthOpenDistance > 0.04) {
          etapaAtual = 2;
          document.getElementById("audio-acerto").play();
          console.log("Etapa 2: Boca aberta detectada");
        }
        break;

      case 2: // Esperando sorriso
        if (smileRatio > 2.0 && lipDistance > 0.04) {
          etapaAtual = 3;
          document.getElementById("audio-acerto").play();
          console.log("Etapa 3: Sorriso detectado. Sequência completa!");
          // Aqui você pode adicionar qualquer ação final, tipo mudar de tela ou mostrar algo.
        }
        break;

      default:
        break;
    }
  }
}

function computeEAR(eye) {
  const euclidean = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const a = euclidean(eye[1], eye[5]);
  const b = euclidean(eye[2], eye[4]);
  const c = euclidean(eye[0], eye[3]);
  return (a + b) / (2.0 * c);
}

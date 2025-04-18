// raposa.js

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
// candeeiros.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const luzes = [
        document.getElementById('luz1'),
        document.getElementById('luz2'),
        document.getElementById('luz3')
    ];
    const planeta = document.getElementById('planeta');
    const acendedor = document.getElementById('acendedor');
    const pau = document.getElementById('pau');
    const canvas = document.body;

    // Configuração do pau
    const MAX_ANGLE = 10; // Ângulo máximo (80° para cada lado)
    const MIN_ANGLE = -180; // Ângulo mínimo
    let anchorPoint = { x: 0, y: 0 }; // Será calculado dinamicamente

    // Áudios
    const lightOn = new Audio('audios/lightOn.mp3');
    const lightOff = new Audio('audios/lightOff.mp3');
    lightOn.volume = lightOff.volume = 1;

    // Estados e controle
    const aceso = [true, true, false];
    const tempoDesligar = [0, 0, 0];
    
    // Controle de animação
    let currentRotation = 0;
    let lastTimestamp = null;
    let animationId = null;
    const baseSpeed = 20; // Velocidade constante
    
    // Inicializa a animação dos candeeiros
    startAnimation();

    // Caminhos das imagens
    const imgLuzAcesa = 'imagens/candeeiro/luz.png';
    const imgLuzApagada = 'imagens/candeeiro/semluz.png';

    // ===== FUNÇÕES DOS CANDEIROS =====
    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        currentRotation += (deltaTime / 1000) * (360 / baseSpeed);
        
        planeta.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        luzes[0].style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        luzes[1].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 120}deg)`;
        luzes[2].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 240}deg)`;
        
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationId) {
            animationId = requestAnimationFrame(animate);
        }
    }

    function updateLights() {
        const now = Date.now();
        for (let i = 0; i < 3; i++) {
            if (aceso[i] && now > tempoDesligar[i]) {
                aceso[i] = false;
                luzes[i].src = imgLuzApagada;
                lightOff.currentTime = 0;
                lightOff.play().catch(e => console.error("Erro no som:", e));
            }
        }
        requestAnimationFrame(updateLights);
    }

    // ===== FUNÇÕES DO PAU =====
    function calculateAnchorPoint() {
        const rect = pau.getBoundingClientRect();
        // Ponto de ancoragem na base do pau (ajuste os valores conforme necessário)
        return {
            x: rect.left + rect.width / 2,
            y: rect.bottom - (rect.height * 0.1) // Ajuste este valor para o ponto correto
        };
    }

    function updatePauPosition(e) {
        anchorPoint = calculateAnchorPoint();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calcula o ângulo baseado na posição do mouse
        let angle = Math.atan2(mouseY - anchorPoint.y, mouseX - anchorPoint.x) * (180 / Math.PI);
        
        // Ajusta o ângulo para o sistema de coordenadas (0° = vertical para cima)
        angle = 90 - angle;
        
        // Limita o ângulo e inverte a direção se necessário
        angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, angle));
        
        pau.style.transform = `rotate(${angle}deg)`;
    }

    function initPau() {
        // Posição inicial
        pau.style.transform = 'rotate(90deg)';
        // Atualiza o ponto de ancoragem inicial
        anchorPoint = calculateAnchorPoint();
    }

    // ===== INICIALIZAÇÃO =====
    luzes.forEach((luz, index) => {
        luz.src = imgLuzApagada;
        luz.style.pointerEvents = 'auto';
        luz.addEventListener('click', function() {
            if (!aceso[index]) {
                aceso[index] = true;
                luz.src = imgLuzAcesa;
                lightOn.currentTime = 0;
                lightOn.play();
                tempoDesligar[index] = Date.now() + 1000 + Math.random() * 2000;
            }
        });
    });

    // Inicializa o pau
    initPau();
    
    // Event listeners
    document.addEventListener('mousemove', updatePauPosition);
    window.addEventListener('resize', initPau); // Recalcula ao redimensionar
    
    updateLights();
});
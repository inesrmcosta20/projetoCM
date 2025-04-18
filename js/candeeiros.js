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
    let baseSpeed = 20; // segundos para uma rotação completa (valor inicial)
    let currentSpeed = baseSpeed;
    const minSpeed = 3; // velocidade máxima (tempo mínimo por rotação)
    
    startAnimation(); // Inicia animação lenta imediatamente

    // Caminhos das imagens
    const imgLuzAcesa = 'imagens/candeeiro/luz.png';
    const imgLuzApagada = 'imagens/candeeiro/semluz.png';

    // Função de animação principal
    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        // Atualiza a rotação baseada no tempo e velocidade
        currentRotation += (deltaTime / 1000) * (360 / currentSpeed);
        
        // Aplica as transformações
        planeta.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        luzes[0].style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        luzes[1].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 120}deg)`;
        luzes[2].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 240}deg)`;
        
        animationId = requestAnimationFrame(animate);
    }

    // Função para atualizar a velocidade
    function updateSpeed(newSpeed) {
        currentSpeed = newSpeed;
        console.log(`Velocidade atualizada: ${currentSpeed}s por rotação`);
    }

    // Função para aumentar a velocidade gradualmente
    function increaseSpeed() {
        if (currentSpeed > minSpeed) {
            updateSpeed(currentSpeed - 1);
            return true;
        }
        return false;
    }

    // Inicia a animação quando ocorre a primeira interação
    function startAnimation() {
        if (!animationId) {
            animationId = requestAnimationFrame(animate);
        }
    }

    // Registra interação e inicia o aumento progressivo de velocidade
    function registerInteraction() {
        startAnimation();
        
        // Aumenta a velocidade a cada 5 segundos após 15 segundos iniciais
        setTimeout(() => {
            if (increaseSpeed()) {
                const speedInterval = setInterval(() => {
                    if (!increaseSpeed()) {
                        clearInterval(speedInterval);
                    }
                }, 5000);
            }
        }, 15000);
    }

    // Atualização do estado das lâmpadas
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

    // Event listeners para as luzes
    luzes.forEach((luz, index) => {
        luz.addEventListener('click', function() {
            if (!aceso[index]) {
                aceso[index] = true;
                luz.src = imgLuzAcesa;
                
                lightOn.currentTime = 0;
                lightOn.play().catch(e => console.error("Erro no som:", e));
                tempoDesligar[index] = Date.now() + 2000 + Math.random() * 4000;
                
                registerInteraction();
            }
        });
    });

    // Inicialização
    luzes.forEach(luz => {
        luz.src = imgLuzApagada;
        luz.style.pointerEvents = 'auto';
    });
    
    updateLights();
});
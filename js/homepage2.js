//homepage2.js
document.addEventListener("DOMContentLoaded", function () {
    // Variáveis de controle
    let animationRunning = false;
    let animationStartTime = null;
    const animationDuration = 5000; // 5 segundos

    // Elementos
    const aviao = document.getElementById('aviao');
    const aviao2 = document.getElementById('aviao2');
    const pecasCenario = document.querySelector('.peças-cenario');

    // Posições e transformações para cada etapa da animação
    const keyframes = [
        { time: 0,    top: -10, left: 100, rotate: 10,   scale: 0 },
        { time: 500,  top: 10,  left: 90,  rotate: 15,   scale: 0.5 },
        { time: 1000, top: 15,  left: 85,  rotate: 20,   scale: 1 },
        { time: 1500, top: 25,  left: 75,  rotate: 45,   scale: 1.5 },
        { time: 2000, top: 25,  left: 70,  rotate: 180,  scale: 2 },
        { time: 2500, top: 35,  left: 60,  rotate: 360,  scale: 3 },
        { time: 5000, top: 70,  left: 45,  rotate: 385,  scale: 4 }
    ];

    // Verificar se a animação já foi executada nesta sessão
    const animationAlreadyPlayed = sessionStorage.getItem('animationPlayed');
    
    if (!animationAlreadyPlayed) {
        console.log("Animação será executada (primeira vez nesta sessão)");
        startAnimation();
    } else {
        console.log("Animação já foi executada nesta sessão - pulando");
        // Mostrar estado final (avião como sombra e peças visíveis)
        aviao.style.display = 'none';
        aviao2.style.display = 'block';
        pecasCenario.style.opacity = "1";
        pecasCenario.classList.add("active");
    }

    function startAnimation() {
        if (animationRunning) return;
        
        animationRunning = true;
        animationStartTime = performance.now();
        aviao.style.display = 'block';
        aviao2.style.display = 'none';
        
        requestAnimationFrame(animate);
    }

    function stopAnimation() {
        animationRunning = false;
    }

    function animate(currentTime) {
        if (!animationRunning) return;
        
        if (!animationStartTime) animationStartTime = currentTime;
        const elapsedTime = currentTime - animationStartTime;
        
        // Encontrar os keyframes atual e próximo
        let currentFrame, nextFrame;
        for (let i = 0; i < keyframes.length - 1; i++) {
            if (elapsedTime >= keyframes[i].time && elapsedTime < keyframes[i+1].time) {
                currentFrame = keyframes[i];
                nextFrame = keyframes[i+1];
                break;
            }
        }
        
        // Se chegou ao final
        if (elapsedTime >= animationDuration) {
            const finalFrame = keyframes[keyframes.length - 1];
            applyTransform(finalFrame);
            
            // Trocar avião pela sombra
            aviao.style.display = 'none';
            aviao2.style.display = 'block';
            animationRunning = false;
            
            // Mostrar peças do cenário
            setTimeout(() => {
                pecasCenario.style.opacity = "1";
                pecasCenario.classList.add("active");
            }, 300);
            
            // Marcar na sessão que a animação já foi executada
            sessionStorage.setItem('animationPlayed', 'true');
            console.log("Animação terminada - marcando como executada nesta sessão");
            
            return;
        }
        
        // Interpolar entre os keyframes
        if (currentFrame && nextFrame) {
            const progress = (elapsedTime - currentFrame.time) / (nextFrame.time - currentFrame.time);
            const interpolatedFrame = {
                top: currentFrame.top + (nextFrame.top - currentFrame.top) * progress,
                left: currentFrame.left + (nextFrame.left - currentFrame.left) * progress,
                rotate: currentFrame.rotate + (nextFrame.rotate - currentFrame.rotate) * progress,
                scale: currentFrame.scale + (nextFrame.scale - currentFrame.scale) * progress
            };
            
            applyTransform(interpolatedFrame);
        }
        
        requestAnimationFrame(animate);
    }

    function applyTransform(frame) {
        aviao.style.top = `${frame.top}%`;
        aviao.style.left = `${frame.left}%`;
        aviao.style.transform = `rotate(${frame.rotate}deg) scale(${frame.scale})`;
    }

    // Mostrar ou esconder peças do avião com base no localStorage
    const imagemIdMostrar = localStorage.getItem('imagemParaMostrar');
    const imagemIdEsconder = localStorage.getItem('imagemParaEsconder');

    if (imagemIdMostrar) {
        const imagemParaMostrar = document.getElementById(imagemIdMostrar);
        if (imagemParaMostrar) {
            imagemParaMostrar.style.display = 'block';
        }
        localStorage.removeItem('imagemParaMostrar');
    }

    if (imagemIdEsconder) {
        const imagemParaEsconder = document.getElementById(imagemIdEsconder);
        if (imagemParaEsconder) {
            imagemParaEsconder.style.display = 'none';
        }
        localStorage.removeItem('imagemParaEsconder');
    }

    // Função genérica para controlar peças
    function controlarPeca(pecaId, pecaCenarioId) {
    const peca = document.getElementById(pecaId);
    const pecaCenario = document.getElementById(pecaCenarioId);

    const pecaParaDesativar = sessionStorage.getItem('desativarPecaCenario');
    const pecaParaAnimar = sessionStorage.getItem('animarPecaAviao');

    if (pecaParaDesativar === pecaCenarioId && pecaCenario) {
        pecaCenario.style.display = 'none';
        sessionStorage.setItem(`${pecaId}Desativada`, 'true');
        sessionStorage.removeItem('desativarPecaCenario');
    }

    if (pecaParaAnimar === pecaId && peca) {
        peca.style.display = 'block';
        peca.style.animation = `move${pecaId.charAt(0).toUpperCase() + pecaId.slice(1)} 5s ease-out forwards`;
        
        peca.addEventListener('animationend', function() {
            sessionStorage.setItem(`${pecaId}Animada`, 'true');
            sessionStorage.removeItem('animarPecaAviao');
        });
    } else if (sessionStorage.getItem(`${pecaId}Animada`) && peca) {
        peca.style.display = 'block';
        const posicoes = {
            'corpo': { top: '64%', left: '37.2%', width: '24vw', transform: 'rotate(25deg)', zIndex: '13' },
            'rodas': { top: '79.3%', left: '37%', width: '20vw', transform: 'rotate(385deg)', zIndex: '15' },
            'placaBaixo': { top: '70.8%', left: '30.5%', width: '38vw', transform: 'rotate(385deg)', zIndex: '14' },
            'tirantes': { top: '59%', left: '33%', width: '32.2vw', transform: 'rotate(385deg)', zIndex: '12' },
            'helices': { top: '48%', left: '33.5%', width: '12.4vw', transform: 'rotate(385deg)', zIndex: '16' },
            'placaCima': { top: '54.7%', left: '31.4%', width: '39.3vw', transform: 'rotate(385deg)', zIndex: '11' }
        };
        const posicao = posicoes[pecaId] || {};
        Object.assign(peca.style, posicao);
        peca.style.animation = 'none';
    }

    if (sessionStorage.getItem(`${pecaId}Desativada`) && pecaCenario) {
        pecaCenario.style.display = 'none';
    }
}

    // Controlar todas as peças
    controlarPeca('corpo', 'peça-corpo');
    controlarPeca('rodas', 'peça-rodas');

     controlarPeca('tirantes', 'peça-tirantes');
     controlarPeca('placaBaixo', 'peça-placaBaixo');
     controlarPeca('helices', 'peça-helices');
    controlarPeca('placaCima', 'peça-placaCima');
});
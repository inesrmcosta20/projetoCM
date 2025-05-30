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
        { time: 100,  top: 10,  left: 90,  rotate: 25,   scale: 0.5 },
        { time: 1500, top: 25,  left: 85,  rotate: 40,   scale: 1 },
        { time: 2500, top: 35,  left: 75,  rotate: 100,   scale: 1.5 },
        { time: 3000, top: 45,  left: 70,  rotate: 230,  scale: 2 },
        { time: 4000, top: 55,  left: 60,  rotate: 470,  scale: 3 },
        { time: 5000, top: 70,  left: 45,  rotate: 745,  scale: 4 }
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
       /* const posicoes = {
            'corpo': { top: '64%', left: '37.2%', width: '24vw', transform: 'rotate(25deg)', zIndex: '13' },
            'rodas': { top: '79.3%', left: '37%', width: '20vw', transform: 'rotate(385deg)', zIndex: '15' },
            'placaBaixo': { top: '70.8%', left: '30.5%', width: '38vw', transform: 'rotate(385deg)', zIndex: '14' },
            'tirantes': { top: '59%', left: '33%', width: '32.2vw', transform: 'rotate(385deg)', zIndex: '12' },
            'helices': { top: '48%', left: '33.5%', width: '12.4vw', transform: 'rotate(385deg)', zIndex: '16' },
            'placaCima': { top: '54.7%', left: '31.4%', width: '39.3vw', transform: 'rotate(385deg)', zIndex: '11' }
        };
        const posicao = posicoes[pecaId] || {};*/
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


//animação final - quando todas as peças-avião estão ativas
checkIfGameComplete();
console.log("verifica que já estao todas ativas(check game)"); 

function checkIfGameComplete() {
    const pecas = ['corpo', 'rodas', 'tirantes', 'placaBaixo', 'helices', 'placaCima'];
    const todasMontadas = pecas.every(p => sessionStorage.getItem(`${p}Animada`) === 'true');

    if (todasMontadas) {
        console.log("Todas as peças foram montadas! Iniciando animação final...");

        // Tocar som de sucesso
        const audio = new Audio('sons/FinalSucess.mp3');
        audio.play();

        // Anima cada peça para posição final
        pecas.forEach(p => {
            const pecaElemento = document.getElementById(p);
            if (pecaElemento) {
                pecaElemento.classList.add('posicao-final');
                pecaElemento.style.transition = 'transform 1s ease';
            }
        });

        // Esperar as peças se moverem antes de iniciar decolagem e esconder
        setTimeout(() => {
            iniciarAnimacaoFinalAviao();
        }, 1200); // ajuste conforme tempo da animação das peças
    }
}

function iniciarAnimacaoFinalAviao() {
    // Oculta todas as peças ANTES da decolagem
    const pecas = ['corpo', 'rodas', 'tirantes', 'placaBaixo', 'helices', 'placaCima'];
    pecas.forEach(p => {
        const pecaElemento = document.getElementById(p);
        if (pecaElemento) {
            pecaElemento.style.display = 'none';
        }
    });

    // Esconde avião estático, mostra o que vai decolar
    aviao2.style.display = 'none';
    aviao.style.display = 'block';
    aviao.style.zIndex = '9999';

    // Adiciona keyframes dinamicamente
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes aviaoDecolando {
        0% {
            top: 70%;
            left: 45%;
            transform: rotate(385deg) scale(4);
        }
        30% {
            top: 60%;
            left: 40%;
            transform: rotate(395deg) scale(3);
        }
        70% {
            top: 30%;
            left: 20%;
            transform: rotate(360deg) scale(2);
            opacity: 0.8;
        }
        100% {
            top: 0%;
            left: -10%;
            transform: rotate(360deg) scale(1);
        }
    }
    .animar-decolagem {
        animation: aviaoDecolando 5s ease-in-out forwards;
    }`;
    document.head.appendChild(style);

    // Inicia decolagem
    aviao.classList.add('animar-decolagem');

    // Exibe botão após animação
    setTimeout(() => {
        mostrarBotaoReset();
    }, 3500);
}

function mostrarBotaoReset() {
    const botaoReset = document.createElement('button');
    botaoReset.textContent = "Jogar Novamente";
    botaoReset.style.position = 'fixed';
    botaoReset.style.top = '50%';
    botaoReset.style.left = '50%';
    botaoReset.style.transform = 'translate(-50%, -50%)';
    botaoReset.style.padding = '20px 40px';
    botaoReset.style.fontSize = '2rem';
    botaoReset.style.backgroundColor = '#28a745';
    botaoReset.style.color = '#fff';
    botaoReset.style.border = 'none';
    botaoReset.style.borderRadius = '10px';
    botaoReset.style.cursor = 'pointer';
    botaoReset.style.zIndex = '9999';

    document.body.appendChild(botaoReset);

    botaoReset.addEventListener('click', () => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.reload();
    });
}

// Atalho para modo debug
document.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
        mostrarBotaoAtivarTodasPecas();
    }
});

function mostrarBotaoAtivarTodasPecas() {
    const botao = document.createElement('button');
    botao.textContent = "Ativar todas as peças (DEBUG)";
    botao.style.position = 'fixed';
    botao.style.bottom = '20px';
    botao.style.right = '20px';
    botao.style.padding = '10px 20px';
    botao.style.fontSize = '1rem';
    botao.style.backgroundColor = '#ff5722';
    botao.style.color = '#fff';
    botao.style.border = 'none';
    botao.style.borderRadius = '6px';
    botao.style.cursor = 'pointer';
    botao.style.zIndex = '9999';

    document.body.appendChild(botao);

    botao.addEventListener('click', () => {
        const pecas = ['corpo', 'rodas', 'tirantes', 'placaBaixo', 'helices', 'placaCima'];
     
        pecas.forEach(p => {
            sessionStorage.setItem(`${p}Animada`, 'true');
            sessionStorage.setItem(`${p}Desativada`, 'true');
            const pecaElemento = document.getElementById(p);
            if (pecaElemento) pecaElemento.style.display = 'block';
        });

        checkIfGameComplete();
        botao.remove();
    });
}

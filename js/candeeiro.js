//candeeiro.js
document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const luzes = [
        document.getElementById('luz1'),
        document.getElementById('luz2'),
        document.getElementById('luz3')
    ];
    const planeta = document.getElementById('planeta');

    // Contador de interações
    let interactionCount = 0;
    let baloesAtivados = false;

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
    const baseSpeed = 10; // Velocidade constante

    // Caminhos das imagens
    const imgLuzAcesa = 'imagens/candeeiro/luz.png';
    const imgLuzApagada = 'imagens/candeeiro/semluz.png';

    // Animação contínua dos candeeiros
    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        currentRotation += (deltaTime / 1000) * (360 / baseSpeed);

        if (planeta) planeta.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        if (luzes[0]) luzes[0].style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        if (luzes[1]) luzes[1].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 120}deg)`;
        if (luzes[2]) luzes[2].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 240}deg)`;

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationId) {
            animationId = requestAnimationFrame(animate);
        }
    }

    // Atualização contínua das luzes apagadas automaticamente
    function updateLights() {
        const now = Date.now();
        for (let i = 0; i < 3; i++) {
            if (aceso[i] && now > tempoDesligar[i]) {
                aceso[i] = false;
                if (luzes[i]) luzes[i].src = imgLuzApagada;
                lightOff.currentTime = 0;
                lightOff.play().catch(e => console.error("Erro no som:", e));
            }
        }
        requestAnimationFrame(updateLights);
    }

    // Função para ativar os balões de fala com seleção mais aleatória
    function ativarBaloes() {
        const baloes = {
            A: ["balao-fala1", "balao-fala4", "balao-fala7"],
            B: ["balao-fala2", "balao-fala6", "balao-fala8"],
            C: ["balao-fala3", "balao-fala5", "balao-fala9"]
        };

        // Rastreadores do último balão exibido para cada classe
        const ultimosBalões = {
            A: null,
            B: null,
            C: null
        };

        // Contadores para garantir que todos os balões sejam mostrados
        const contadoresBalões = {
            A: { index: 0, ordem: shuffleArray([...baloes.A]) },
            B: { index: 0, ordem: shuffleArray([...baloes.B]) },
            C: { index: 0, ordem: shuffleArray([...baloes.C]) }
        };

        // Função para embaralhar array
        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function mostrarBalao(classe) {
            const baloesClasse = baloes[classe];
            const contador = contadoresBalões[classe];
            
            // Seleciona o próximo balão na ordem embaralhada
            let balaoId = contador.ordem[contador.index];
            contador.index = (contador.index + 1) % contador.ordem.length;
            
            // Se completou um ciclo, reembaralha
            if (contador.index === 0) {
                contador.ordem = shuffleArray([...baloesClasse]);
            }
            
            // Evita repetir o mesmo balão consecutivamente
            while (balaoId === ultimosBalões[classe] && baloesClasse.length > 1) {
                balaoId = contador.ordem[contador.index];
                contador.index = (contador.index + 1) % contador.ordem.length;
            }
            
            ultimosBalões[classe] = balaoId;
            
            const balao = document.getElementById(balaoId);
            if (!balao) return;

            // Ativar balão
            balao.style.display = "block";
            balao.style.opacity = "1";

            // Tempo de vida entre 4 a 7 segundos antes do fade out
            const tempoDeVida = Math.random() * 3000 + 4000;

            setTimeout(() => {
                // Inicia o fade-out com transition
                balao.style.opacity = "0";

                // Aguarda 2 segundos para esconder o elemento completamente
                setTimeout(() => {
                    balao.style.display = "none";
                    balao.style.opacity = "1"; // Reset para reutilização
                }, 2000);
            }, tempoDeVida);
        }

        // Intervalos desencontrados por classe
        setInterval(() => {
            if (Math.random() < 0.5) mostrarBalao("A");
        }, 5000);

        setInterval(() => {
            if (Math.random() < 0.5) mostrarBalao("B");
        }, 6000);

        setInterval(() => {
            if (Math.random() < 0.5) mostrarBalao("C");
        }, 7000);
    }

    // Inicialização das luzes com clique
    if (luzes && luzes.length > 0) {
        luzes.forEach((luz, index) => {
            if (luz) {
                luz.src = imgLuzApagada;
                luz.style.pointerEvents = 'auto';
                luz.addEventListener('click', function () {
                    if (!aceso[index]) {
                        aceso[index] = true;
                        luz.src = imgLuzAcesa;
                        lightOn.currentTime = 0;
                        lightOn.play();
                        tempoDesligar[index] = Date.now() + 500 + Math.random() * 1000;

                        interactionCount++;
                        console.log(`Interação número: ${interactionCount}`);

                        // Ativar balões após 1 interações
                        if (interactionCount === 1 && !baloesAtivados) {
                            baloesAtivados = true;
                            ativarBaloes();
                        }

                        if (interactionCount === 15) {
                            showButton();
                        }
                    }
                });
            }
        });
    }

       function showButton() {
    const botao = document.querySelector(".desistir");
    if (botao) {
        botao.style.display = "block";
        
        botao.addEventListener('click', function() {
    mostrarFullscreen();
   
});
    }
}


  startAnimation();
    updateLights();

function mostrarFullscreen() {
        const fullscreenContainer = document.getElementById('fullscreen-container');
        document.body.classList.add('fullscreen-active');

        fullscreenContainer.innerHTML = `
        <div class="fullScreen-img-container">
          <img src="imagens/principe1.png" id="posicao1" alt="príncipe">
        <img src="imagens/rosa/mensagem.png" id="posicao2" alt="mensagem"> 
        </div>
        <button id="homeButton">Finalizar</button>
    `;

        // Iniciar animação do príncipe
        const principeImg = document.getElementById('posicao1');
        let frame = 1;
        const maxFrames = 10;
        const intervalo = 150; // ms

        let animacaoIntervalo = setInterval(() => {
            frame = frame >= maxFrames ? 1 : frame + 1;
            principeImg.src = `imagens/principe/principe${frame}.png`;
        }, intervalo);

        // Lidar com clique no botão
        const homeButton = document.getElementById('homeButton');
        homeButton.addEventListener('click', function () {
            // Parar a animação ao sair
            clearInterval(animacaoIntervalo);

            // Ativar peça rodas no avião e desativar no cenário
            sessionStorage.setItem('desativarPecaCenario', 'peça-corpo');
            sessionStorage.setItem('animarPecaAviao', 'corpo');

            window.location.href = 'homepage.html';
        });

        fullscreenContainer.style.display = 'flex';
    }

});

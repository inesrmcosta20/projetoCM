// Animação de estrelas cintilando
const numEstrelas = 40;
const main = document.querySelector(".estrelas");

function criarEstrela() {
    const estrela = document.createElement("img");
    estrela.src = "imagens/rosa/cenario/estrela.png";
    estrela.classList.add("estrela-animada");

    const size = Math.floor(Math.random() * 15) + 10;
    estrela.style.width = `${size}px`;

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    estrela.style.left = `${x}vw`;
    estrela.style.top = `${y}vh`;

    estrela.style.animationDelay = `${Math.random() * 5}s`;

    main.appendChild(estrela);

    // Reposiciona após cada animação
    estrela.addEventListener('animationiteration', function () {
        const newX = Math.random() * 100;
        const newY = Math.random() * 100;
        estrela.style.left = `${newX}vw`;
        estrela.style.top = `${newY}vh`;
    });
}

// Cria várias estrelas
for (let i = 0; i < numEstrelas; i++) {
    criarEstrela();
}

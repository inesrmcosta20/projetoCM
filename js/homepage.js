document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById('aviao');

  aviao.addEventListener('animationend', function () {
    const imagens = [
      'imagens/peças/corpo.png',
      'imagens/peças/helices.png',
      'imagens/peças/placaBaixo.png',
      'imagens/peças/placaCima.png',
      'imagens/peças/rodas.png',
      'imagens/peças/tirantes.png'
    ];

    // Capturar a posição e tamanho do avião antes de removê-lo
    const aviaoRect = aviao.getBoundingClientRect();
    const aviaoX = aviaoRect.left;
    const aviaoY = aviaoRect.top;

    aviao.remove(); // Remove a imagem do avião

    // Criar um contêiner para as peças do avião
    const container = document.createElement('div');
    container.classList.add('aviao-container');
    container.style.position = "absolute";
    container.style.left = `${aviaoX}px`;
    container.style.top = `${aviaoY}px`;

    // Criar e posicionar as imagens das peças
    imagens.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = "Peça do avião";
      img.classList.add('aviao-peça');
      img.style.position = "absolute";
      img.style.left = "0px";
      img.style.top = "0px";

      container.appendChild(img);
    });

    document.body.appendChild(container);
  });
});

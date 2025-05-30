const AREA_SEGURANCA = 100;
const TEMPO_ANIMACAO = 10000;
const INTERVALO_GERACAO = 300;

const imagens = [
  { src: 'imagens/homem-negocios/objetos/estrela.png', alt: 'estrela' },
  { src: 'imagens/homem-negocios/objetos/lua.png', alt: 'lua' },
  { src: 'imagens/homem-negocios/objetos/planeta.png', alt: 'planeta' }
];

const areaObjetos = document.querySelector('.area-objetos');
const areaQueda = document.getElementById('area-queda');
const objetosAtivos = [];
let indiceImagemAtual = 0;
let objetosClicados = 0;
const botaoDesistir = document.getElementById('btnDesistir');

const { Engine, Runner, World, Bodies, Body, Composite, Events } = Matter;
const engine = Engine.create();
const world = engine.world;
const runner = Runner.create();
Runner.run(runner, engine);

function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function atualizarAreaObjetosRect() {
  return areaObjetos.getBoundingClientRect();
}

function atualizarAreaQuedaRect() {
  return areaQueda.getBoundingClientRect();
}

function criarChaoAreaObjetos() {
  const areaRect = atualizarAreaObjetosRect();
  Composite.allBodies(world).forEach(body => {
    if (body.isStatic && body.label === 'chao-objetos') {
      World.remove(world, body);
    }
  });

  const chao = Bodies.rectangle(
    areaRect.x + areaRect.width / 2,
    areaRect.y + areaRect.height + 50,
    areaRect.width,
    100,
    {
      isStatic: true,
      friction: 0.7,
      label: 'chao-objetos',
    }
  );
  World.add(world, chao);
}

function criarChaoNoPote() {
  const areaRect = atualizarAreaQuedaRect();

  Composite.allBodies(world).forEach(body => {
    if (body.isStatic && ['chao-pote', 'parede-esquerda', 'parede-direita'].includes(body.label)) {
      World.remove(world, body);
    }
  });

  const chao = Bodies.rectangle(
    areaRect.x + areaRect.width / 2,
    areaRect.y + areaRect.height + 20,
    areaRect.width,
    40,
    { isStatic: true, friction: 0.7, label: 'chao-pote' }
  );

  const paredeEsquerda = Bodies.rectangle(
    areaRect.x - 20,
    areaRect.y + areaRect.height / 2,
    40,
    areaRect.height,
    { isStatic: true, label: 'parede-esquerda' }
  );

  const paredeDireita = Bodies.rectangle(
    areaRect.x + areaRect.width + 20,
    areaRect.y + areaRect.height / 2,
    40,
    areaRect.height,
    { isStatic: true, label: 'parede-direita' }
  );

  World.add(world, [chao, paredeEsquerda, paredeDireita]);
}

function aplicarFisicaAoObjeto(img, x, y, largura, altura, src, escala = 0.5) {
  largura *= escala;
  altura *= escala;

  const areaRect = atualizarAreaQuedaRect();
  const posX = areaRect.x + areaRect.width / 2;
  const posY = 0 - altura;

  const body = Bodies.rectangle(posX, posY, largura, altura, {
    restitution: 0.1,
    frictionAir: 0.02,
    density: 0.01,
    angle: (Math.random() * 2 - 1),
  });

  World.add(world, body);

  const elem = document.createElement('img');
  elem.src = src;
  elem.style.position = 'absolute';
  elem.style.width = `${largura}px`;
  elem.style.height = `${altura}px`;
  elem.style.pointerEvents = 'none';
  elem.style.zIndex = '6';
  elem.style.left = `${posX - largura / 2}px`;
  elem.style.top = `${posY - altura / 2}px`;

  document.body.appendChild(elem);

  const intervalo = setInterval(() => {
    elem.style.left = `${body.position.x - largura / 2}px`;
    elem.style.top = `${body.position.y - altura / 2}px`;
    elem.style.transform = `rotate(${body.angle}rad)`;
  }, 16);

  setTimeout(() => {
    clearInterval(intervalo);
    World.remove(world, body);
    elem.remove();
  }, 80000);
}

Events.on(engine, "beforeUpdate", () => {
  const areaRect = atualizarAreaQuedaRect();
  const waterLevel = areaRect.y + areaRect.height * 0.05;

  Composite.allBodies(world).forEach(body => {
    if (!body.isStatic) {
      if (
        body.position.x > areaRect.x &&
        body.position.x < areaRect.x + areaRect.width &&
        body.position.y > areaRect.y &&
        body.position.y < areaRect.y + areaRect.height
      ) {
        const depth = body.position.y - waterLevel;
        if (depth > 0) {
          const grav = map(depth, 0, areaRect.height * 0.95, 0.005, 0.002);
          Body.applyForce(body, body.position, { x: 0, y: grav * body.mass });
          body.frictionAir = map(depth, 0, areaRect.height * 0.95, 0.15, 0.3);
        } else {
          body.frictionAir = 0.1;
        }
      }
    }
  });
});

function gerarObjetoBalanceado() {
  const escolhido = imagens[indiceImagemAtual];
  indiceImagemAtual = (indiceImagemAtual + 1) % imagens.length;

  const img = document.createElement('img');
  img.src = escolhido.src;
  img.alt = escolhido.alt;
  img.classList.add('objeto-animado');

  const areaRect = atualizarAreaObjetosRect();
  const areaWidth = areaRect.width;
  const areaHeight = areaRect.height;

  let posX, posY;
  let colisao = true;
  let tentativas = 0;

  while (colisao && tentativas < 10) {
    posX = areaRect.x + Math.random() * (areaWidth - 50);
    posY = areaRect.y + Math.random() * (areaHeight - 50);

    colisao = false;
    for (const obj of objetosAtivos) {
      const dx = obj.x - posX;
      const dy = obj.y - posY;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      if (distancia < AREA_SEGURANCA) {
        colisao = true;
        break;
      }
    }
    tentativas++;
  }

  if (colisao) return;

  img.style.left = `${posX - areaRect.x}px`;
  img.style.top = `${posY - areaRect.y}px`;
  img.style.position = 'absolute';

  areaObjetos.appendChild(img);

  const objetoAtual = { element: img, x: posX, y: posY };
  objetosAtivos.push(objetoAtual);

  img.addEventListener('click', () => {
    const audio = document.getElementById('audio-acerto');
    audio.currentTime = 0; 
    audio.play();
    
    const largura = img.width;
    const altura = img.height;
    aplicarFisicaAoObjeto(img, null, null, largura, altura, img.src, 1);
    img.remove();

    objetosClicados++;
    if (objetosClicados === 25) {
      botaoDesistir.style.display = 'block';
    }

    const index = objetosAtivos.indexOf(objetoAtual);
    if (index !== -1) objetosAtivos.splice(index, 1);
  });
}

function iniciarGeracaoObjetos() {
  criarChaoAreaObjetos();
  criarChaoNoPote();
  setInterval(gerarObjetoBalanceado, INTERVALO_GERACAO);
}

const baloes = document.querySelectorAll('.balao');
const posicoes = [
  { left: '84%', top: '5%' },
  { left: '83%', top: '6%' },
  { left: '82%', top: '7%' },
  { left: '81%', top: '4%' },
];

let indiceBalaoAtual = 0;

function mostrarBalaoSequencial() {
  baloes.forEach(b => b.classList.remove('fade-in', 'fade-out'));

  const balao = baloes[indiceBalaoAtual % baloes.length];
  const pos = posicoes[indiceBalaoAtual % posicoes.length];

  balao.style.left = pos.left;
  balao.style.top = pos.top;

  balao.classList.add('fade-in');

  setTimeout(() => {
    balao.classList.remove('fade-in');
    balao.classList.add('fade-out');
  }, 3000);

  indiceBalaoAtual++;
}

// Guarda o ID do intervalo para podermos parar depois
const baloesIntervalID = setInterval(mostrarBalaoSequencial, 4000);

// Inicia o jogo
iniciarGeracaoObjetos();

botaoDesistir.addEventListener('click', () => {
  // Para o intervalo dos balões
  clearInterval(baloesIntervalID);

  // Mostra fullscreen
  mostrarFullscreen();
});

function mostrarFullscreen() {
  const fullscreenContainer = document.getElementById('fullscreen-container');
  document.body.classList.add('fullscreen-active');

  fullscreenContainer.innerHTML = `
          <div class="fullScreen-close" id="closeFullscreen">X</div>
    <div class="fullScreen-img-container">
      <img src="imagens/principe1.png" id="posicao1" alt="príncipe">
      <img src="imagens/homem-negocios/mensagem.png" id="posicao2" alt="mensagem"> 
    </div>
    <button id="homeButton">Finalizar</button>
  `;

  // Botão "X" para fechar
  const closeBtn = document.getElementById('closeFullscreen');
  closeBtn.addEventListener('click', function () {
    clearInterval(animacaoIntervalo);
    fullscreenContainer.style.display = 'none';
    document.body.classList.remove('fullscreen-active');
  });

  const principeImg = document.getElementById('posicao1');
  let frame = 1;
  const maxFrames = 10;
  const intervalo = 150;

  const animacaoIntervalo = setInterval(() => {
    frame = frame >= maxFrames ? 1 : frame + 1;
    principeImg.src = `imagens/principe/principe${frame}.png`;
  }, intervalo);

  const homeButton = document.getElementById('homeButton');
  homeButton.addEventListener('click', function () {
    // Parar a animação ao sair
    clearInterval(animacaoIntervalo);

    // Ativar peça rodas no avião e desativar no cenário
    sessionStorage.setItem('desativarPecaCenario', 'peça-placaCima');
    sessionStorage.setItem('animarPecaAviao', 'placaCima');

    window.location.href = 'index.html';
  });

  fullscreenContainer.style.display = 'flex';
}

const principeImg = document.getElementById('posicao1');
let frame = 1;
const maxFrames = 10;
const intervalo = 150;

const animacaoIntervalo = setInterval(() => {
  frame = frame >= maxFrames ? 1 : frame + 1;
  principeImg.src = `imagens/principe/principe${frame}.png`;
}, intervalo);

const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', () => {
  clearInterval(animacaoIntervalo);
  window.location.href = 'index.html';
});

document.addEventListener("DOMContentLoaded", function () {
  const music = document.getElementById('background-music');
  const somOn = document.getElementById('som-on');
  const somOff = document.getElementById('som-off');

  somOn.style.display = 'none';
  somOff.style.display = 'inline';

  // Ativa o som
  somOff.addEventListener('click', () => {
    music.muted = false;
    music.play().then(() => {
      somOff.style.display = 'none';
      somOn.style.display = 'inline';
    }).catch((e) => {
      console.warn("Falha ao iniciar áudio:", e);
    });
  });

  // Desativa o som
  somOn.addEventListener('click', () => {
    music.pause();
    music.muted = true;
    somOn.style.display = 'none';
    somOff.style.display = 'inline';
  });
});

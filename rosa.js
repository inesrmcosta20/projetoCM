//seleciona todos os itens da lista (botões)
let topicos = document.querySelectorAll('.topicos ul li');

//seleciona todos os quadrados
let squares = document.querySelectorAll(".square");

let imagesToDownload = [];

function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new Image(); // Cria um novo objeto de imagem
        img.src = src; // Define o caminho da imagem

        // Quando a imagem for carregada com sucesso
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            return img.width, img.height;
        };

        // Caso ocorra algum erro ao carregar a imagem
        img.onerror = () => {
            reject(new Error(Erro ao carregar a imagem: ${src}));
        };
    });
}



function position() {
    const displayContainer = document.querySelector('#fourthScreen');
    const displayRect = displayContainer.getBoundingClientRect(); // Dimensões da div display

    // Para cada quadrado, gerar uma posição aleatória
    for (let i = 0; i < squares.length; i++) {
        // Dimensões do quadrado
        const rect = squares[i].getBoundingClientRect();
        const squareWidth = rect.width;
        const squareHeight = rect.height;

        // Largura e altura total do contêiner
        const displayWidth = displayRect.width / 2;
        const displayHeight = displayRect.height - 180;

        // Gera uma posição aleatória dentro do contêiner
        let randomX = Math.random() * (displayWidth - squareWidth);  // Posição X aleatória
        let randomY = Math.random() * (displayHeight - squareHeight);  // Posição Y aleatória

        // Aplica a posição aleatória ao quadrado
        squares[i].style.left = ${randomX}px;
        squares[i].style.top = ${randomY}px;

        // Salva as posições nos atributos
        squares[i].setAttribute('data-x', randomX);
        squares[i].setAttribute('data-y', randomY);
    }
}

//função dedicada à parte de arrastar os elementos
function mover(square) {
    let posX = 0, posY = 0;
    let arrasta = false;

    //momento em que o rato agarra o quadrado
    square.addEventListener('mousedown', (e) => {
        arrasta = true;
        posX = e.clientX - square.offsetLeft;  //distância até a borda esquerda do quadrado
        posY = e.clientY - square.offsetTop;   //distância até a borda superior do quadrado
        square.style.cursor = 'grabbing';

        e.preventDefault();  //previne que quando se arrasta o texto não fique selecionado

        //momento em que o rato arrasta o quadrado
        const onMouseMove = (e) => {
            if (arrasta) {
                let container = document.querySelector('#fourthScreen');
                let containerRect = container.getBoundingClientRect();  //calcula as dimensões do contentor

                //atualiza a posição de X e Y com base no movimento do rato
                let newPosX = e.clientX - posX;
                let newPosY = e.clientY - posY;

                //restringe os valores para os limites da secção (tela)
                newPosX = Math.max(0, Math.min(newPosX, containerRect.width - square.offsetWidth));
                newPosY = Math.max(0, Math.min(newPosY, containerRect.height - square.offsetHeight));

                //atualiza as posições dos quadrados
                square.style.left = ${newPosX}px;
                square.style.top = ${newPosY}px;
                square.setAttribute('data-x', newPosX);
                square.setAttribute('data-y', newPosY);
            }
        };

        //momento em que o rato larga o quadrado
        const onMouseUp = () => {
            arrasta = false;
            square.style.cursor = 'grab';
            //remove o evento de movimento
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            //calcula a posição de cada quadrado em relação ao contentor
            const rect = square.getBoundingClientRect();

            //seleciona o contentor display e calcula a sua dimensão
            const displayContainer = document.querySelector('#displayDiv');
            const displayRect = displayContainer.getBoundingClientRect();

            const squareRight = rect.left + rect.width;  //posição direita do quadrado
            const squareBottom = rect.top + rect.height;  //posição inferior do quadrado

            //verifica se os quadrados estão dentro do contentor .display
            //Se estiver dentro do .display
            if (rect.left >= displayRect.left && rect.top >= displayRect.top &&
                squareRight <= displayRect.right && squareBottom <= displayRect.bottom) {
                //Se NÃO fizer parte do array imagesToDownload
                if (!imagesToDownload.includes(square)) {
                    imagesToDownload.push(square);
                }
            } else {
                //Se fizer parte do array imagesToDownload
                if (imagesToDownload.includes(square)) {
                    // Remover do array o square
                    imagesToDownload.pop(square);
                }
            }
        };


        //adiciona o evento de movimento
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}


//chamada das funções de interção de clique, arraste e da determinação das posições dos quadrados
adicionarEventosClique();
position();


//função que permite mudar de tópicos, visualizando apenas os quadrados respetivos
function adicionarEventosClique() {

    for (let i = 0; i < topicos.length; i++) {
        topicos[i].addEventListener("click", function () {
            let topicId = topicos[i].id.replace('Btn', ''); // Determina qual é o tópico que vai ser exibido

            //atualiza a cor dos tópicos conforme o selecionado
            atualizarCorTopicos(i);

            for (let j = 0; j < squares.length; j++) {

                //se o quadrado for filho do contentor cujo id é o mesmo que o tópico
                if (squares[j].parentElement.id == topicId) {
                    squares[j].style.display = "block"; //então o quadrado é desenhado
                    mover(squares[j]);  //adiciona o arrastar a cada um dos quadrados
                } else {
                    //calcula a posição de cada quadrado em relação ao contentor
                    const rect = squares[j].getBoundingClientRect();

                    //seleciona o contentor display e calcula a sua dimensão
                    const displayContainer = document.querySelector('#displayDiv');
                    const displayRect = displayContainer.getBoundingClientRect();

                    const squareRight = rect.left + rect.width;  //posição direita do quadrado
                    const squareBottom = rect.top + rect.height;  //posição inferior do quadrado

                    //verifica se os quadrados estão dentro do contentor .display
                    if (rect.left >= displayRect.left && rect.top >= displayRect.top &&
                        squareRight <= displayRect.right && squareBottom <= displayRect.bottom) {
                        squares[j].style.display = "block"; //se estiverem não são apagados
                        // imagesToDownload.push(squares[j]);
                        // console.log(imagesToDownload)
                    } else {
                        squares[j].style.display = "none";//se não estiverem são apagados
                    }
                }
            }
        });

        //simula um clique inicial no tópico da arma para que os quadrados deste possam ser arrastáveis e desenhados logo como default
        if (topicos.length > 0) {
            topicos[0].click();
        }

    }

}


//função que muda a cor dos tópicos consoante aquele que está selecionado
function atualizarCorTopicos(selectedIndex) {
    for (let i = 0; i < topicos.length; i++) {
        if (i === selectedIndex) {
            topicos[i].style.color = "#507650"; // Se estiver selecionado, fica verde
        } else {
            topicos[i].style.color = "#c9c9c9"; // Se não, fica cinza
        }
    }
}
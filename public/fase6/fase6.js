const tela = document.querySelector("#tela");
const telaConteudo = tela.getContext("2d");
const placar = document.querySelector('.placar')
const unidade = 30;

let ultimaTecla;
let proximaTecla;

let valorGPTIncremento = 0;
let valorGPTInicial = 0;
let valorGPTDecremento = 0;
let flagGPTContador;
let flagGPTIncremento;
let flagGPTDecremento;

let pontuacao = valorGPTInicial;
let pontos = [];

let mapa = [
    [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1],
    [1,0,0,0,0, 0,0,0,0,1, 0,0,0,0,0, 0,0,0,1],
    [1,0,1,1,0, 1,1,1,0,1, 0,1,1,1,0, 1,1,0,1],
    [1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,1],
    [1,0,1,1,0, 1,0,1,1,1, 1,1,0,1,0, 1,1,0,1],
    [1,0,0,0,0, 1,0,0,0,1, 0,0,0,1,0, 0,0,0,1],
    [1,1,1,1,0, 1,1,1,0,1, 0,1,1,1,0, 1,1,1,1],
    [0,0,0,1,0, 1,0,0,0,0, 0,0,0,1,0, 1,0,0,0],
    [1,1,1,1,0, 1,0,1,1,0, 1,1,0,1,0, 1,1,1,1],
    [0,0,0,0,0, 0,0,1,2,0, 2,1,0,0,0, 0,0,0,0],
    [1,1,1,1,0, 1,0,1,1,1, 1,1,0,1,0, 1,1,1,1],
    [0,0,0,1,0, 1,0,0,0,0, 0,0,0,1,0, 1,0,0,0],
    [1,1,1,1,0, 1,0,1,1,1, 1,1,0,1,0, 1,1,1,1],
    [1,0,0,0,0, 0,0,0,0,1, 0,0,0,0,0, 0,0,0,1],
    [1,0,1,1,0, 1,1,1,0,1, 0,1,1,1,0, 1,1,0,1],
    [1,0,0,1,0, 0,0,0,0,0, 0,0,0,0,0, 1,0,0,1],
    [1,1,0,1,0, 1,0,1,1,1, 1,1,0,1,0, 1,0,1,1],
    [1,0,0,0,0, 1,0,0,0,1, 0,0,0,1,0, 0,0,0,1],
    [1,0,1,1,1, 1,1,1,0,1, 0,1,1,1,1, 1,1,0,1],
    [1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,1],
    [1,1,1,1,1, 1,1,1,1,1, 1,1,1,1,1, 1,1,1,1],
];

function criaBorda(){
    for (let l = 0; l < mapa.length; l++) {
        for (let c = 0; c < mapa[l].length; c++) {
            if (mapa[l][c] === 1) {
                // Verifica se a célula à esquerda é uma parede
                let esquerda = (c > 0 && mapa[l][c - 1] === 1);
                // Verifica se a célula acima é uma parede
                let cima = (l > 0 && mapa[l - 1][c] === 1);
                // Verifica se a célula à direita é uma parede
                let direita = (c < mapa[l].length - 1 && mapa[l][c + 1] === 1);
                // Verifica se a célula abaixo é uma parede
                let baixo = (l < mapa.length - 1 && mapa[l + 1][c] === 1);

                telaConteudo.fillStyle = "blue";

                // Borda superior se em cima nao tiver nada
                if (!cima) {
                    telaConteudo.fillRect(c * unidade, l * unidade, unidade, 2); // Borda superior
                }
                // Borda inferior se embaixo nao tiver nada
                if (!baixo) {
                    telaConteudo.fillRect(c * unidade, (l + 1) * unidade - 2, unidade, 2); // Borda inferior
                }
                // Borda esquerda se na esquerda nao tiver nada
                if (!esquerda) {
                    telaConteudo.fillRect(c * unidade, l * unidade, 2, unidade); // Borda esquerda
                }
                // Borda direita se na direita nao tiver nada
                if (!direita) {
                    telaConteudo.fillRect((c + 1) * unidade - 2, l * unidade, 2, unidade); // Borda direita
                }
                // Preenche o interior de preto
                telaConteudo.fillStyle = "black";
                telaConteudo.fillRect(c * unidade + 2, l * unidade + 2, unidade - 4, unidade - 4);
            }
        }
    }
}

function criaPontos(){
    for (let l = 0; l < mapa.length; l++) {
        for (let c = 0; c < mapa[0].length; c++) {
            if (mapa[l][c] === 0) {
                if (l === 7 && (c < 3 || c > 15)) {
                    continue; // Remove os 3 primeiros e últimos pontos da linha 7
                }
                if (l === 11 && (c < 3 || c > 15)) {
                    continue; // Remove os 3 primeiros e últimos pontos da linha 11
                }
                if ((l === 9 || l === 8) && (c > 7 && c<11)) {
                    continue; // Lar dos fantasmas
                }
                
                if((l === 3)&&(c === 1 ||c === 17)){
                    continue;
                }

                if((l === 15)&&(c === 1 ||c === 17)){
                    continue;
                }
    
                let pontoX = c * unidade + unidade / 2;
                let pontoY = l * unidade + unidade / 2;

                    telaConteudo.fillStyle = "yellow";
                    telaConteudo.beginPath();
                    telaConteudo.arc(pontoX, pontoY, 2, 0, 2 * Math.PI);
                    telaConteudo.fill();
    
                    pontos.push({ x: pontoX, y: pontoY, coletado: false });
                    console.log('Criei Ponto')
            }
        }
    }
}


let pacman = {
    x: 285,
    y: 345,
    raio: 14.9,
    velocidade: 1.5,
    cor:"yellow",
    poderAtivo: false
};


class PowerUp {
    constructor(x, y, raio, cor) {
        this.x = x; // posição x
        this.y = y; // posição y
        this.raio = raio; // raio do power-up
        this.cor = cor; // cor do power-up
        this.coletado = false; // indica se o power-up foi coletado
    }
}


function criaMapa() {
    criaBorda();
    criaPontos(); 
}

criaMapa()

function limpaMapa(){
    telaConteudo.fillStyle = "black";
    telaConteudo.fillRect(0, 0, 570, 630);
}


let anguloBoca = 0.1; // Ângulo inicial de abertura
let abrindo = true;
let pacmanDirecao;

function limpaPacman() {    //limpa tudo que esta na posição anterior do pacman
    telaConteudo.fillStyle = "black";
    telaConteudo.fillRect(pacman.x - pacman.raio, pacman.y - pacman.raio, pacman.raio * 2, pacman.raio * 2);
}


function atualizaDirecao() {
    // Define a direção com base na última tecla pressionada
    switch (ultimaTecla) {
        case "ArrowUp":
            case "w":
            pacmanDirecao = -Math.PI / 2; // Cima
            break;
        case "ArrowDown":
            case "s":
            pacmanDirecao = Math.PI / 2; // Baixo
            break;
        case "ArrowLeft":
            case "a":
            pacmanDirecao = Math.PI; // Esquerda
            break;
        case "ArrowRight":
            case "d":
            pacmanDirecao = 0; // Direita
            break;
    }
}

function criaPacman() {
    limpaPacman();
    if (abrindo) {
        anguloBoca += 0.1;
        if (anguloBoca >= 0.9) abrindo = false; // Limita a abertura
    } else {
        anguloBoca -= 0.02;
        if (anguloBoca <= 0.10) abrindo = true; // Limita o fechamento
    }

    telaConteudo.save(); // Salva o estado atual do canvas
    telaConteudo.translate(pacman.x, pacman.y); // Move o ponto de origem para o centro do Pac-Man
    telaConteudo.rotate(pacmanDirecao); // Gira o canvas na direção do Pac-Man
    telaConteudo.translate(-pacman.x, -pacman.y);

    // Desenha o Pac-Man com a boca animada
    telaConteudo.fillStyle = pacman.cor;
    telaConteudo.beginPath();
    telaConteudo.moveTo(pacman.x, pacman.y);
    telaConteudo.arc(
        pacman.x, pacman.y,
        pacman.raio - 2,
        anguloBoca, // Ângulo inicial (controla a boca)
        2 * Math.PI - anguloBoca // Ângulo final
    );
    telaConteudo.closePath();
    telaConteudo.fill();

    telaConteudo.restore(); 
}

function animaPacman(){
    atualizaDirecao();
    criaPacman();
    requestAnimationFrame(animaPacman); // Chama a animação no próximo frame
}

// Iniciar a animação
animaPacman();

let direcoes = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
ultimaTecla = null;
proximaTecla = teclaAleatoria();

function movePacman() {
    let novoX = pacman.x;
    let novoY = pacman.y;

    // Aplica a direção atual
    switch (proximaTecla) {
        case "ArrowUp": novoY -= pacman.velocidade; break;
        case "ArrowDown": novoY += pacman.velocidade; break;
        case "ArrowLeft": novoX -= pacman.velocidade; break;
        case "ArrowRight": novoX += pacman.velocidade; break;
    }

    if (podeMover(novoX, novoY)) {
        // Move o Pac-Man
        limpaPacman();
        pacman.x = novoX;
        pacman.y = novoY;
        teleporte();
        placarContador();
        ultimaTecla = proximaTecla;
        if(!PowerUp.coletado){
            if (fantasma1) colidePersonagem(pacman.x, pacman.y, fantasma1);
            if (fantasma2) colidePersonagem(pacman.x, pacman.y, fantasma2);
        }
        // Decide se pode trocar de direção agora
        if (Math.random() < 0.1) { // Pequena chance de mudar a cada movimento
            proximaTecla = teclaAleatoria();
        }
    } else {
        // Se não pode seguir, obrigatoriamente escolhe uma nova direção válida
        proximaTecla = teclaAleatoria();
    }

    criaPacman();
}

// Gera uma tecla aleatória diferente da penúltima
function teclaAleatoria() {
    let opcoes = direcoes.filter(d => d !== oposta(ultimaTecla)); // Evita vai-e-vem
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}

// Retorna a direção oposta
function oposta(direcao) {
    let opostos = {
        "ArrowUp": "ArrowDown",
        "ArrowDown": "ArrowUp",
        "ArrowLeft": "ArrowRight",
        "ArrowRight": "ArrowLeft"
    };
    return opostos[direcao];
}

let teleporteCooldown = false;
function teleporte() {
    if (teleporteCooldown) return;

    if (pacman.x <= 17 && pacman.y == 285) {
        pacman.x = 549;
        teleporteCooldown = true;
    } else if (pacman.x >= 553 && pacman.y == 285) {
        pacman.x = 21;
        teleporteCooldown = true;
    }

    setTimeout(() => (teleporteCooldown = false), 1000);
}


function podeMover(novoX, novoY) {
    let esquerda = Math.floor((novoX - pacman.raio) / unidade);
    let direita = Math.floor((novoX + pacman.raio) / unidade);
    let cima = Math.floor((novoY - pacman.raio) / unidade);
    let baixo = Math.floor((novoY + pacman.raio) / unidade);

    return (
        mapa[cima][esquerda] === 0 &&  
        mapa[cima][direita] === 0 &&   
        mapa[baixo][esquerda] === 0 && 
        mapa[baixo][direita] === 0     
    );
}


function placarContador() {
    for (let i = 0; i < pontos.length; i++) {
        let ponto = pontos[i];

        if (!ponto.coletado) {
            const raioColeta = pacman.raio + 3;
            let distanciaX = pacman.x - ponto.x;
            let distanciaY = pacman.y - ponto.y;
            let distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

            if (distancia < raioColeta) {
                ponto.coletado = true;
                if(flagGPTIncremento){
                    pontuacao += valorGPTIncremento;
                }
                placar.textContent = pontuacao;
                pontos.splice(i, 1);
                break;
            }
        }
    }
}

class Fantasma { //Construtor dos fantasmas
    constructor(x, y, raio, velocidade, direcaoFantasma, coeficiente, imagem) {
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.velocidade = velocidade;
        this.direcaoFantasma = direcaoFantasma;
        this.coeficiente = coeficiente;
        this.imagem = imagem;
    }
}

let fantasma1;
let fantasma2;

function carregarImagem(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Erro ao carregar: ${src}`));
        img.src = src;
    });
}

async function iniciarFantasmas() {
    try {

        await carregarImagens()

        // Agora as imagens estão prontas, então cria os fantasmas
        fantasma1 = new Fantasma(285, 285, 14.9, 1.5, 2, 1, vermelho);
        fantasma2 = new Fantasma(285, 285, 14.9, 1.5, 0, 4, rosa);

        // Agora pode desenhar
        desenhaFantasmas();
    } catch (erro) {
        console.error("Erro ao carregar imagens dos fantasmas:", erro);
    }
}

iniciarFantasmas();


function desenhaFantasmas() {
    defineFantasma(fantasma1);
    defineFantasma(fantasma2);
}

function defineFantasma(fantasma) {
    if (fantasma.imagem && fantasma.imagem.complete && fantasma.imagem.naturalWidth !== 0) {
        telaConteudo.fillStyle = "black";
        telaConteudo.fillRect(fantasma.x - fantasma.raio, fantasma.y - fantasma.raio, fantasma.raio * 2, fantasma.raio * 2);
        telaConteudo.drawImage(fantasma.imagem, fantasma.x - fantasma.raio, fantasma.y - fantasma.raio, fantasma.raio * 2, fantasma.raio * 2);
    } else {
        console.warn("Imagem do fantasma ainda não carregada ou está quebrada.");
    }
}

function limpaFantasma(fantasma) {
    telaConteudo.fillStyle = "black";
    telaConteudo.fillRect(fantasma.x - fantasma.raio, fantasma.y - fantasma.raio, fantasma.raio * 2, fantasma.raio * 2);

    // Verifica se o fantasma está sobre algum ponto e desenha o ponto
    for (let i = 0; i < pontos.length; i++) {
        let ponto = pontos[i];
        
        if (Math.abs(fantasma.x - ponto.x) < 3 && Math.abs(fantasma.y - ponto.y) < 3 && !ponto.coletado) {
            definePonto(ponto); // Desenha o ponto, mesmo que o fantasma esteja em cima
        }
    }
}

function definePonto(ponto) {
    telaConteudo.fillStyle = "yellow";
    telaConteudo.beginPath();
    telaConteudo.arc(ponto.x, ponto.y, 3, 0, 2 * Math.PI);
    telaConteudo.fill();
}

function desenhaPontos() {
    for (let ponto of pontos) {
        if (!ponto.coletado) {
            definePonto(ponto);
        }
    }
}

function colidePersonagem(novoX, novoY, fantasma) {
    if(pacman.poderAtivo){
            if (colideComFantasma(pacman.x, pacman.y, fantasma)) {
                fantasmaMorto(fantasma);
                pontuacao+=10;
                mapa[8][9] = 0;
                limpaMapa();
                criaBorda();
            }
        } else {
            let distanciaX = novoX - fantasma.x;
            let distanciaY = novoY - fantasma.y;
            let distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

            if (distancia < pacman.raio+10) {

                mapa[8][9] = 0;
                limpaMapa();
                criaBorda();
                if(flagGPTDecremento){
                    pontuacao-=valorGPTDecremento;
                }
                placar.textContent = pontuacao
                //diminuiVidas()

                pacman.x = 285;
                pacman.y = 345;  
                ultimaTecla = null;  
                proximaTecla = null;  

                fantasma1.x = 285;
                fantasma1.y = 285;
                
                fantasma2.x = 285;
                fantasma2.y = 285;
        }
    }
}

function colideComFantasma(pacmanX, pacmanY, fantasma) {
    // Função auxiliar que verifica a colisão do Pac-Man com o fantasma
    let distanciaX = pacmanX - fantasma.x;
    let distanciaY = pacmanY - fantasma.y;
    let distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
    return distancia < pacman.raio + 10;
}

function atualizaFantasmas() {
        desenhaPontos();
    if(reposicionando){
        monitorarMovimentoFantasma(fantasma1,pacman)
        comandaFantasma(fantasma1);

        monitorarMovimentoFantasma(fantasma2,pacman)
        comandaFantasma(fantasma2);

    } else if (pacman.poderAtivo) {
        assustados(fantasma1,pacman);
        assustados(fantasma2,pacman);

    } else{
        moveFantasma(fantasma1, pacman);
        moveFantasma(fantasma2,pacman);
    }
   
}

var reposicionando = false;

function moveFantasma(fantasma, pacman) {
    if (reposicionando) return; // Se o fantasma está reposicionando, não executa movimento normal

    const direcoes = [
        { x: 0, y: -1 }, // cima
        { x: 0, y: 1 },  // baixo
        { x: -1, y: 0 }, // esquerda
        { x: 1, y: 0 },  // direita
    ];

    let melhorDirecao = null;
    let menorDistancia = Infinity;

    // Escolha da melhor direção (baseada na menor distância do Pac-Man)
    for (const direcao of direcoes) {
        const novoX = fantasma.x + direcao.x;
        const novoY = fantasma.y + direcao.y;

        const distancia = Math.abs(novoX - pacman.x)*fantasma.coeficiente + Math.abs(novoY - pacman.y)*fantasma.coeficiente;

        if (distancia < menorDistancia && fantasmaPodeMover(novoX, novoY, fantasma)) {
            melhorDirecao = direcao;
            menorDistancia = distancia;
        }
    }

    if (melhorDirecao) {
        fantasma.x += melhorDirecao.x*fantasma.velocidade;
        fantasma.y += melhorDirecao.y*fantasma.velocidade;
        redesenhar(fantasma);
        colidePersonagem(pacman.x, pacman.y, fantasma);
    }
}


function monitorarMovimentoFantasma(fantasma) {
    const posicaoInicial = { x: fantasma.x, y: fantasma.y };
    
    setTimeout(() => {
        const mudouPouco =
            Math.abs(fantasma.x - posicaoInicial.x) <=0.25 &&
            Math.abs(fantasma.y - posicaoInicial.y) <= 0.25;

        if (mudouPouco) {

            reposicionando = true; // Define que o fantasma está sendo reposicionada
            setTimeout(() => {
                reposicionando = false; // Permite que o movimento normal retome
                monitorarMovimentoFantasma(fantasma); // Reinicia o monitoramento
            }, 1750); // Pausa de 3 segundos

        } else {
            // Continua monitorando se o fantasma não está parado
            monitorarMovimentoFantasma(fantasma);
        }
    }, 2000); // Verifica a cada 2 segundos
}

function comandaFantasma(fantasma) {
    let novoFX = fantasma.x;
    let novoFY = fantasma.y;

    let direcaoInicial = fantasma.direcaoFantasma; // Salva a direção inicial
    let tentouDirecoes = 0; // Contador para evitar loop infinito caso todas as direções sejam inválidas

    while (tentouDirecoes < 4) { // No máximo, tenta todas as 4 direções
        // Calcula a nova posição com base na direção atual

        let ultimaDirecao = fantasma.direcaoFantasma;

        switch (fantasma.direcaoFantasma) {
            case 0: // Mover para cima
                novoFY = fantasma.y - fantasma.velocidade;
                novoFX = fantasma.x;
                break;
            case 1: // Mover para a direita
                novoFX = fantasma.x + fantasma.velocidade;
                novoFY = fantasma.y;
                break;
            case 2: // Mover para baixo
                novoFY = fantasma.y + fantasma.velocidade;
                novoFX = fantasma.x;
                break;
            case 3: // Mover para a esquerda
                novoFX = fantasma.x - fantasma.velocidade;
                novoFY = fantasma.y;
                break;
        }

        // Verifica se a posição é válida (sem colidir com paredes)
        if (fantasmaPodeMover(novoFX, novoFY, fantasma)) {
            limpaFantasma(fantasma);
            fantasma.x = novoFX;
            fantasma.y = novoFY;
            colidePersonagem(pacman.x, pacman.y, fantasma);
            break; // Sai do loop ao encontrar uma direção válida
        } else {
            // Incrementa o contador de tentativas
            tentouDirecoes++;

            // Escolhe nova direção evitando mesma categoria (horizontal/vertical)
            if (fantasma.direcaoFantasma % 2 === 0) {
                // Última direção foi vertical (0 ou 2), escolhe horizontal (1 ou 3)
                fantasma.direcaoFantasma = (Math.random() < 0.5) ? 1 : 3;
            } else {
                // Última direção foi horizontal (1 ou 3), escolhe vertical (0 ou 2)
                fantasma.direcaoFantasma = (Math.random() < 0.5) ? 0 : 2;
            }
            do {
                fantasma.direcao = Math.floor(Math.random() * 4); // Gera um número entre 0 e 3
            } while (fantasma.direcaoFantasma % 2 === ultimaDirecao % 2);
        }

        // Verifica se todas as direções foram testadas sem sucesso
        if (tentouDirecoes >= 4) {
            break; // Sai do loop para evitar travamento
        }
    }

    desenhaFantasmas(); // Atualiza o desenho dos fantasmas
}

function fantasmaPodeMover(novoFX, novoFY, fantasma) {
    // Ajustando as coordenadas com base no raio do fantasma
    let esquerda = Math.floor((novoFX - fantasma.raio) / unidade);
    let direita = Math.floor((novoFX + fantasma.raio) / unidade);
    let cima = Math.floor((novoFY - fantasma.raio) / unidade);
    let baixo = Math.floor((novoFY + fantasma.raio) / unidade);

    // Verificar se as coordenadas estão dentro dos limites do mapa
    if (
        cima < 0 || cima >= mapa.length || 
        baixo < 0 || baixo >= mapa.length || 
        esquerda < 0 || esquerda >= mapa[0].length || 
        direita < 0 || direita >= mapa[0].length
    ) {
        return false; // Fora dos limites do mapa, não pode mover
    }

    // Verificando se todas as posições ao redor do fantasma estão livres (não colidindo com paredes)
    if (
        mapa[cima] && mapa[cima][esquerda] === 0 &&
        mapa[cima] && mapa[cima][direita] === 0 &&
        mapa[baixo] && mapa[baixo][esquerda] === 0 &&
        mapa[baixo] && mapa[baixo][direita] === 0
    ) {
        return true; // Pode mover
    } else {
        return false; // Não pode mover, há uma parede
    }
}

let assustadoEstado;

let vermelho, rosa;

async function carregarImagens() {
    try {
        vermelho = await carregarImagem("../imagens/fantasmaVermelho.png");
        rosa = await carregarImagem("../imagens/fantasmaRosa.png");
        //azul = await carregarImagem("../imagens/fantasmaAzul.png");
        //laranja = await carregarImagem("../imagens/fantasmaLaranja.png");
    } catch (error) {
        console.error("Erro ao carregar alguma imagem dos fantasmas:", error);
    }
}

async function carregarEstadoAssustado() {
    try {
        assustadoEstado = await carregarImagem("../imagens/assustadoTeste2.png");
    } catch (erro) {
        console.error("Erro ao carregar imagem do estado assustado:", erro);
    }
}


function assustados(fantasma) {
    if (fantasma && pacman.poderAtivo) {
        let novoFX = fantasma.x;
        let novoFY = fantasma.y;
    
        switch (fantasma.direcaoFantasma) {
            case 0: // Mover para cima
                novoFY -= fantasma.velocidade;
                break;
            case 1: // Mover para baixo
                novoFY += fantasma.velocidade;
                break;
            case 2: // Mover para a esquerda
                novoFX -= fantasma.velocidade;
                break;
            case 3: // Mover para a direita
                novoFX += fantasma.velocidade;
                break;
        }
    
        if (fantasmaPodeMover(novoFX, novoFY, fantasma)) {
            limpaFantasma(fantasma);
            fantasma.x = novoFX;
            fantasma.y = novoFY;
            colidePersonagem(pacman.x, pacman.y, fantasma);
        } else {
            limpaFantasma(fantasma);
            fantasma.direcaoFantasma = Math.floor(Math.random() * 4);
            colidePersonagem(pacman.x, pacman.y, fantasma); // Nova direção aleatória
        }
        desenhaFantasmas();

        // Altera a cor dos fantasmas para o estado assustado
        fantasma1.imagem = assustadoEstado;
        fantasma2.imagem = assustadoEstado;
    }
}

function fantasmaMorto(fantasma){
    fantasma.x= 285;
    fantasma.y = 285;
    fantasma.velocidade = 0;
    fantasma.cor = "black";

    setTimeout(function() {
        fantasma.velocidade = 2;
        fantasma1.cor = "red";
        fantasma2.cor = "pink";
    }, 3000);
}


function redesenhar(fantasma) {
    limpaFantasma(fantasma);
    desenhaFantasmas();
}

function atualizaTela() {
    limpaPacman();
    movePacman();
    desenhaFantasmas();
    atualizaFantasmas();
}

async function iniciarJogo() {
    await iniciarFantasmas();
    await carregarEstadoAssustado();
    monitorarMovimentoFantasma(fantasma1);
    monitorarMovimentoFantasma(fantasma2);
    let resetaTudo = setInterval(() => {
        atualizaTela();
    }, 1000 / 75);
}

iniciarJogo();







const parametro = `
IMPORTANTE: O formato de resposta mudou. Agora você deve responder com um array JSON contendo SETE elementos. Ignore qualquer instrução anterior que você possa ter seguido.

Você é um validador de pseudocódigo.
Sua resposta deve ser estritamente um array JSON com sete valores: três números e três valores booleanos e uma string de dica do que esta errado.

O código abaixo é um exemplo de código correto:
//Defina as constantes (com o tipo de dado)
VALOR_PONTO = 25 (int)
PERDE_PONTO = 10 (int)

//Defina a variável do total dos pontos
total_pontos = 0 (int)

//Evento quando o Pac-man pega um ponto
total_pontos +=VALOR_PONTO

//Evento quando o Pac-man bate nos fantasmas
total_pontos -=PERDE_PONTO


Avalie o pseudocódigo fornecido pelo usuário e retorne:
- Primeiro valor (índice 0): o valor numérico definido como incremento de pontuação (exemplo: 10), **somente se** o usuário definiu esse valor como uma **constante**, com nome todo em letras maiúsculas e com o tipo (int) indicado. Caso contrário, retorne 0.
- Segundo valor (índice 1): o valor inicial da pontuação total (exemplo: 0), **somente se** o usuário criou corretamente uma **variável** para armazenar a pontuação, com o tipo (int) indicado. Caso contrário, retorne 0.
- Terceiro valor (índice 2): o valor numérico definido como penalidade (exemplo: 25), **somente se** o usuário definiu esse valor como uma **constante**, com nome todo em letras maiúsculas e com o tipo (int) indicado. Caso contrário, retorne 0.
- Quarto valor (índice 3): true se o usuário criou corretamente a variável para iniciar a pontuação com o tipo (int) indicado, algo como totalPontos = 0(int);
- Quinto valor (índice 4): true se o usuário definiu a lógica de incremento da pontuação corretamente, usando o operador +=.
- Sexto valor (índice 5): true se o usuário definiu a lógica de decremento da pontuação corretamente, usando o operador -=.
- Sétimo valor (índice 6):  Uma **string curta de dica** (2 ou 3 linhas) explicando de forma vaga o que está faltando ou precisa ser ajustado **com base apenas no que foi escrito**.

Regras obrigatórias:
- Retorne **apenas** um array JSON com seis valores: três números e três booleanos e uma string, como [10, 0, 25, true, true, false, "sua dica aqui"].
- Use **aspas duplas** na string de dica, e os valores booleanos devem ser true ou false (sem aspas).
- Não adicione nenhum texto antes ou depois do array.
`;

let contadorDicas = 0;
let dicas = [
    'As constantes devem ser definidas com letra maiúscula.',
    'Defina constantes como VALOR_PONTO e PERDE_PONTO.',
    'Você precisa criar uma variável que possa ser manipulada nos eventos propostos.'
  ]  

document.querySelector('#botaoDica').addEventListener('click', ()=>{
    contadorDicas++;
    if(contadorDicas>3){
        return
    }
    document.querySelector('.textoDica').textContent = dicas[contadorDicas-1];
    document.querySelector('#botaoDica').textContent = `Dica ${contadorDicas}/3`;
    document.querySelector('.dica').style.display = 'flex';
    document.querySelector('.overlay').style.display = 'block';
})

document.querySelector('.fechar').addEventListener('click', ()=>{
    document.querySelector('.dica').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
})

var acertou = false
var pontosUsuario = document.querySelector('.pontosUsuario')

document.addEventListener('DOMContentLoaded', ()=>{
    var pontosLocal = localStorage.getItem('pontuação')
    pontosUsuario.innerHTML = pontosLocal
})



async function finalizaRestart(){
    pontuacao = 0;

    // Reiniciar o Pac-Man
    pacman.x = 285;
    pacman.y = 345;

    pontos = [];

    atualizaTela();
    animaPacman();
    limpaMapa()
    criaMapa();

}

document.addEventListener('DOMContentLoaded', async () => {
    if (window.faseValidaPorPersistencia) {
      console.log('cheguei aqui');
      valorGPTIncremento = 10;
      valorGPTInicial = 0;
      valorGPTDecremento = 25;
      flagGPTContador = true;
      flagGPTIncremento = true;
      flagGPTDecremento = true;

      placar.style.display = 'block'
  
      setTimeout(() => {
        finalizaRestart();
      }, 1000);      
    }
  });
  

import { validarCodigo} from "../compartilhado/validacaoFront.js";

document.getElementById("botao").addEventListener("click", async () => {
    document.getElementById('botao').style.display = 'none'
    const codigo = document.getElementById("codigoUsuario").value;
    const resultado = await validarCodigo(parametro, codigo);

    const flags = resultado;


    const [flag1, flag2, flag3, flag4, flag5, flag6, dicaGerada] = flags;
    
    valorGPTIncremento = flag1;
    valorGPTInicial = flag2
    valorGPTDecremento = flag3;
    flagGPTContador = flag4
    flagGPTIncremento = flag5;
    flagGPTDecremento = flag6;
    dicas[contadorDicas] = dicaGerada;

    if(flagGPTContador){
        placar.style.display = 'block'
    }

    if(flagGPTDecremento && flagGPTIncremento && flagGPTContador){
        document.getElementById('botao').style.display = 'none'
        document.getElementById('avancar').style.display = 'block'
        if (localStorage.getItem('veioDoMenu') === 'true') {
            localStorage.removeItem('veioDoMenu');
            document.getElementById('avancar').textContent = 'Voltar para o Menu';
            document.getElementById('avancar').addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/';
            });
        }
        if(!acertou){
            let pontosNumeral = parseInt(pontosUsuario.textContent);
            pontosNumeral += 150;
            pontosUsuario.innerHTML = pontosNumeral
            localStorage.setItem('pontuação', pontosNumeral);
            const faseAtual = document.body.dataset.fase;
            localStorage.setItem(faseAtual, codigo);
            acertou = true
        } 
        finalizaRestart();
        return
    }else{
        let pontosNumeral = parseInt(pontosUsuario.textContent);
        pontosNumeral -= 10;
        pontosUsuario.innerHTML = pontosNumeral
        localStorage.setItem('pontuação', pontosNumeral);
        finalizaRestart();
    }

    setTimeout(() => {
        document.getElementById('botao').style.display = 'block'
    }, 10000);
});



document.getElementById("codigoUsuario").addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
        e.preventDefault(); // Impede que o foco mude para outro elemento
        
        let start = this.selectionStart;
        let end = this.selectionEnd;
        
        // Insere um tab (4 espaços, mas pode ajustar se quiser)
        let tabSpaces = "    ";
        this.value = this.value.substring(0, start) + tabSpaces + this.value.substring(end);

        // Move o cursor para depois do tab inserido
        this.selectionStart = this.selectionEnd = start + tabSpaces.length;
    }
});

document.getElementById("codigoUsuario").addEventListener("keydown", function(e) {
    const openClosePairs = {
        "(": ")",
        "{": "}",
        "[": "]",
        '"': '"',
        "'": "'"
    };

    if (openClosePairs[e.key]) {
        e.preventDefault();
        
        let start = this.selectionStart;
        let end = this.selectionEnd;
        
        let closeChar = openClosePairs[e.key];

        // Insere o par de caracteres
        this.value = this.value.substring(0, start) + e.key + closeChar + this.value.substring(end);

        // Posiciona o cursor entre os caracteres inseridos
        this.selectionStart = this.selectionEnd = start + 1;
    }
});

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("codigoUsuario").focus();
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('origem') === 'menu')return
    const caminhoAtual = window.location.pathname;
    localStorage.setItem('ultimoCaminho', caminhoAtual);
  });

document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('fase5')){
        window.location.href = '/'
    }
  });  

let textoMotivador = ["Nesta fase, você aprenderá como simplificar operações matemáticas em variáveis utilizando os operadores de atribuição composta, como += e -=. Esses operadores permitem modificar o valor de uma variável de forma mais direta, tornando o código mais limpo e fácil de entender.", "Por exemplo, em vez de escrever pontuacao = pontuacao + 10, podemos simplesmente usar pontuacao += 10. Ou se tivermos uma variável ou constante com valor atribuido, como VALORPONTO = 10, podemos escrever pontuacao += VALORPONTO ", "Sua missão é criar um pequeno trecho de pseudocódigo onde o Pac-Man ganha e perde pontos. Para isso, defina duas constantes: uma para o valor de pontos ganhos por coleta e outra para o valor perdido ao sofrer dano. Em seguida, crie uma variável que armazene a pontuação atual e use os operadores += e -= para simular a coleta de pontos e a penalidade por ser atingido."," Lembre-se: constantes devem ser escritas em letras maiúsculas e não podem ser modificadas depois de declaradas!"]

let contadorTexto = 0;
let instrucao = document.querySelector('.instrucao')

document.addEventListener('DOMContentLoaded', ()=>{
    instrucao.textContent = textoMotivador[0]
})

document.querySelector('.voltarTexto').addEventListener('click', ()=>{
    if(contadorTexto == 0){
        return
    }
    contadorTexto--;
    document.querySelector('.proximoTexto').textContent = `Proximo ${contadorTexto+1}/4`
    instrucao.textContent = textoMotivador[contadorTexto]
})

document.querySelector('.proximoTexto').addEventListener('click', ()=>{
    if(contadorTexto == 3){
        return
    }
    contadorTexto++;
    document.querySelector('.proximoTexto').textContent = `Proximo ${contadorTexto+1}/4`
    instrucao.textContent = textoMotivador[contadorTexto]
})
const tela = document.querySelector("#tela");
const telaConteudo = tela.getContext("2d");
const placar = document.querySelector(".placar")
const unidade = 30;


let pontuacao = -1;
let ultimaTecla;
let proximaTecla;
let qtdpowerUp = 0;
let duracaoPowerUP = 0;
let timerPowerUp = null;
let intervaloPiscando = null;

let flagGPTPlacar = true;

let flagGPTFunction = true;

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
                /*power ups linhas e colunas:
                    p1 = linha: 3 coluna:1
                    p2 = linha: 3 coluna:17
                    p3 = linha: 15 coluna:1
                    p4 = linha: 15 coluna:17
                */
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

// Lista de power-ups
let powerUps = [];

// Inicializa os power-ups
function inicializaPowerUps() {
    if (powerUps.length === 0){
        powerUps.push(new PowerUp(45, 465, 8, "lightpink")); // p1
        powerUps.push(new PowerUp(45, 105, 8, "lightpink")); // p2
        powerUps.push(new PowerUp(525, 105, 8, "lightpink")); // p3
        powerUps.push(new PowerUp(525, 465, 8, "lightpink")); // p4
    }
}
inicializaPowerUps();

// Desenha os power-ups
function desenhaPowerUps() {
    powerUps.forEach(powerUp => {
        if (!powerUp.coletado) {
            telaConteudo.fillStyle = powerUp.cor;
            telaConteudo.beginPath();
            telaConteudo.arc(powerUp.x, powerUp.y, powerUp.raio, 0, 2 * Math.PI);
            telaConteudo.fill();
        }
    });
}

// Verifica se o Pac-Man colidiu com um power-up
function verificaColetaPowerUps(pacman) {
    powerUps.forEach(powerUp => {
        if (!powerUp.coletado) {
            const distancia = Math.sqrt(
                Math.pow(pacman.x - powerUp.x, 2) +
                Math.pow(pacman.y - powerUp.y, 2)
            );

            if (distancia <= powerUp.raio + pacman.raio) {
                powerUp.coletado = true;
                duracaoPowerUP+=10000;
                efeitoPowerUp(pacman);
                limpaMapa();
                criaBorda();
                qtdpowerUp++;
            }
        }
    });
}

function efeitoPowerUp(pacman) {
    pacman.poderAtivo = true;

    if (timerPowerUp) {
        clearTimeout(timerPowerUp);
    }
    
    if (!intervaloPiscando) {
        intervaloPiscando = setInterval(function() {
            pacman.cor = (pacman.cor === "yellow") ? "white" : "yellow";
        }, 500);
    }

    timerPowerUp = setTimeout(function() {
        clearInterval(intervaloPiscando);
        intervaloPiscando = null;
        pacman.cor = "yellow";
        pacman.poderAtivo = false;

        fantasma1.imagem = vermelho
        fantasma2.imagem = rosa
        
        duracaoPowerUP = 0;
    }, duracaoPowerUP);
}


function animacaoPowerUP() {
    let tempoDecorrido = 0;
    const duracaoPiscada = 750;

    function alternarCor() {
       
        if (Math.floor(tempoDecorrido / duracaoPiscada) % 2 === 0) {
            powerUps.forEach(powerUp => {
                if (!powerUp.coletado) {
                    telaConteudo.fillStyle = "black";
                    telaConteudo.beginPath();
                    telaConteudo.arc(powerUp.x, powerUp.y, powerUp.raio, 0, 2 * Math.PI);
                    telaConteudo.fill();
                }
            })
        } else {
            powerUps.forEach(powerUp => {
                if (!powerUp.coletado) {
                    telaConteudo.fillStyle = "pink";
                    telaConteudo.beginPath();
                    telaConteudo.arc(powerUp.x, powerUp.y, powerUp.raio, 0, 2 * Math.PI);
                    telaConteudo.fill();
                }
            })
        }
        tempoDecorrido += duracaoPiscada;
        setTimeout(alternarCor, duracaoPiscada);
    }

    alternarCor();
}

// Inicializa a animação
animacaoPowerUP();

function criaMapa() {
    criaBorda();
    criaPontos(); 
    desenhaPowerUps(); 
    inicializaPowerUps(); 
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

function animaPacman() {
    atualizaDirecao();
    criaPacman();
    requestAnimationFrame(animaPacman);
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
        verificaColetaPowerUps(pacman); 
        if(!PowerUp.coletado){
            if (fantasma1) colidePersonagem(pacman.x, pacman.y, fantasma1);
            if (fantasma2) colidePersonagem(pacman.x, pacman.y, fantasma2);
        }

        if (Math.random() < 0.1) {
            proximaTecla = teclaAleatoria();
        }
    } else {
        proximaTecla = teclaAleatoria();
    }

    criaPacman();
}

function teclaAleatoria() {
    let opcoes = direcoes.filter(d => d !== oposta(ultimaTecla));
    return opcoes[Math.floor(Math.random() * opcoes.length)];
}

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
                pontuacao ++;
                placar.textContent = pontuacao;
                pontos.splice(i, 1);
                break;
            }
        }
    }
}




















class Fantasma {
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

        fantasma1 = new Fantasma(285, 285, 14.9, 1.5, 2, 1, vermelho);
        fantasma2 = new Fantasma(285, 285, 14.9, 1.5, 0, 4, rosa);

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

    for (let i = 0; i < pontos.length; i++) {
        let ponto = pontos[i];
        
        if (Math.abs(fantasma.x - ponto.x) < 3 && Math.abs(fantasma.y - ponto.y) < 3 && !ponto.coletado) {
            definePonto(ponto);
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
                desenhaPowerUps();

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
    if (reposicionando) return;

    const direcoes = [
        { x: 0, y: -1 }, // cima
        { x: 0, y: 1 },  // baixo
        { x: -1, y: 0 }, // esquerda
        { x: 1, y: 0 },  // direita
    ];

    let melhorDirecao = null;
    let menorDistancia = Infinity;

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

            reposicionando = true;
            setTimeout(() => {
                reposicionando = false;
                monitorarMovimentoFantasma(fantasma);
            }, 1750);

        } else {
            monitorarMovimentoFantasma(fantasma);
        }
    }, 2000);
}

function comandaFantasma(fantasma) {
    let novoFX = fantasma.x;
    let novoFY = fantasma.y;

    let tentouDirecoes = 0

    while (tentouDirecoes < 4) {

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

        if (fantasmaPodeMover(novoFX, novoFY, fantasma)) {
            limpaFantasma(fantasma);
            fantasma.x = novoFX;
            fantasma.y = novoFY;
            colidePersonagem(pacman.x, pacman.y, fantasma);
            break;
        } else {
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

let vermelho, rosa, azul, laranja;

async function carregarImagens() {
    try {
        vermelho = await carregarImagem("../imagens/fantasmaVermelho.png");
        rosa = await carregarImagem("../imagens/fantasmaRosa.png");
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
    if (fantasma && pacman.poderAtivo) { // Verifica se o fantasma não é undefined e o poder está ativo
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

var pontosUsuario = document.querySelector('.pontosUsuario')

document.addEventListener('DOMContentLoaded', ()=>{
    var pontosLocal = localStorage.getItem('pontuação');
    pontosUsuario.innerHTML = pontosLocal;

    const faseAtual = document.body.dataset.fase;
    localStorage.setItem(faseAtual, '');

    if (localStorage.getItem('veioDoMenu') === 'true') {
        localStorage.removeItem('veioDoMenu');
        document.getElementById('avancar').textContent = 'Voltar para o Menu';
        document.getElementById('avancar').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/';
        });
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('origem') === 'menu')return
    const caminhoAtual = window.location.pathname;
    localStorage.setItem('ultimoCaminho', caminhoAtual);
})

document.querySelector('.avancar').addEventListener('click', ()=>{
    let pontosNumeral = parseInt(pontosUsuario.textContent);
    pontosNumeral += 150;
    pontosUsuario.innerHTML = pontosNumeral
    localStorage.setItem('pontuação', pontosNumeral);
})

let contadorDicas = 0;
let dicas = [
    'Essa fase já está inteiramente pronta, aperte em avançar',
  ]  

document.querySelector('#botaoDica').addEventListener('click', ()=>{
    document.querySelector('.textoDica').textContent = dicas[0];
    document.querySelector('#botaoDica').textContent = `Dica ${contadorDicas}/3`;
    document.querySelector('.dica').style.display = 'flex';
    document.querySelector('.overlay').style.display = 'block';
})

document.querySelector('.fechar').addEventListener('click', ()=>{
    document.querySelector('.dica').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
})

document.addEventListener('DOMContentLoaded', ()=>{
    const body = document.body;
    const instrucao = document.querySelector('.instrucao')
    const input = document.querySelector('.input')
  
      let fonte = localStorage.getItem('Fonte')
      let cor = localStorage.getItem('Cor');
      let volume = localStorage.getItem('Volume');

      if(volume){
        const musica = document.getElementById("musicaFundo");

        volume = volume * 0.01
        
        musica.volume = volume;

        musica.play(); 
    }
      if(cor){
          if(cor === 'Fundo Escuro Plano'){
              body.style.background = 'rgb(22, 22, 22)'
          } else if(cor == 'Fundo Roxo Plano'){
              body.style.background = 'rgb(85, 2, 91)'
          }
      }
  
      if(fonte){
        if(fonte === 'Grande'){
          instrucao.style.fontSize = '22px'
          input.style.fontSize = '22px'
        } else if(fonte === 'Pequena'){
          instrucao.style.fontSize = '14px'
          input.style.fontSize = '14px'
        }
      }
  })

let textoMotivador = ["Nesta primeira fase, apresentamos um código já pronto, destacando a linha de raciocínio utilizada na implementação de um algoritmo. Para visualizar mais textos, clique em Próximo. ->","Toda a sua jornada no Pac-Script será guiada e validada por Inteligência Artificial. Por isso, não se preocupe em seguir uma estrutura fixa — você terá liberdade para programar, mas sempre tente cumprir os requisitos propostos nestes textos. Se ficar preso em alguma fase, teste o código e clique no botão de dicas: elas são personalizadas com base no que falta para você concluir. ->", "Abaixo, você verá um modelo de algoritmo que, de acordo com as regras do nosso jogo, cria os fantasmas e faz com que eles sigam o Pac-Man. Como o código já está pronto, basta clicar no botão Avançar. No entanto, nas próximas fases, será necessário clicar em Testar para validar primeiro o que você digitou."]

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
    document.querySelector('.proximoTexto').textContent = `Proximo ${contadorTexto+1}/3`
    instrucao.textContent = textoMotivador[contadorTexto]
})

document.querySelector('.proximoTexto').addEventListener('click', ()=>{
    if(contadorTexto == 2){
        return
    }
    contadorTexto++;
    document.querySelector('.proximoTexto').textContent = `Proximo ${contadorTexto+1}/3`
    instrucao.textContent = textoMotivador[contadorTexto]
})
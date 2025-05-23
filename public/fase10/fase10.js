const tela = document.querySelector("#tela");
const telaConteudo = tela.getContext("2d");
const placar = document.querySelector(".placar");
const jogo = document.querySelector(".jogo__base");
const rodape = document.querySelector(".rodape");
const vidas = document.querySelector(".vidas");
const start = document.querySelector(".start");
const restart = document.querySelector(".restart");
const telaRestart = document.querySelector(".telaRestart")
const titulo = document.querySelector(".titulo");
const vitoria = document.querySelector(".vitoria");
const unidade = 30;
const body = document.querySelector("body");
const alteracoes = document.querySelector(".alteracoes")
const instrucao = document.querySelector(".instrucao")

let corDaBorda = 'blue';
let corDoPacman = 'red';
let valorPonto = 1;

let pontuacao = -1;
let ultimaTecla;
let proximaTecla;
let contaVidas = 3;
let jogoRodando = false;
let ganhou = false;
let qtdpowerUp = 0;
let duracaoPowerUP = 0;
let timerPowerUp = null;  // Armazena o timeout atual
let intervaloPiscando = null;

let pacman = {
    x: 285,
    y: 345,
    raio: 14.9,
    velocidade: 2,
    cor:"yellow",
    poderAtivo: false
};

import { validarCodigo} from "../compartilhado/validacaoFront.js";

start.addEventListener('click', async () =>{
    const inputs = document.querySelectorAll('.alteracao_input');

    let valores = [];

    inputs.forEach(input => {
        valores.push(input.value);
    });
    
    let parametro = `Você esta recebendo uma grande string com 4 valores separados por virgula, cada valor representa um item que você vai ter que retornar tratado.
    Você deve retornar um array contendo 4 elementos, que são os seguintes:

    Primeiro elemento - Índice 0: Na string original, o primeiro elemento, antes da primeira virgula deveria ser uma cor, se for, devolva ela entre aspas, tudo minúsculo e em inglês, e deve ser uma cor válida no css, se não existir exatamente, devolva uma aproximação. Caso não haja uma cor definida, retorne "blue";
    Segundo elemento - Índice 1: Na string original, o segundo elemento, depois da primeira virgula deveria ser uma cor, se for, devolva ela entre aspas, tudo minúsculo e em inglês, e deve ser uma cor válida no css, se não existir exatamente, devolva uma aproximação. Caso não haja uma cor definida, retorne "yellow";
    Terceiro elemento - Índice 2: Na string original, o terceiro elemento, depois da segunda virgula deveria ser um número, se for um número até 1000, devolva ele mesmo, se não, devolva 1;
    Quarto elemento - Índice 3: Na string original, o quarto elemento, depois da terceira virgula deveria ser um número, se for um número até 1000, devolva ele mesmo, se não, devolva 3;
    Regras obrigatórias:
    - Retorne **apenas** um array JSON com quatro valores: duas cores e dois números.
    - Formato ["red", "yellow", 10, 5]
    - **Não** explique, **não** comente, **não** adicione nenhum texto extra. Nenhuma palavra além do array deve ser retornada.
    - Use **aspas duplas** em todas as strings.
    - Não adicione nenhum texto antes ou depois do array.
    `
    let codigo = `${valores[0]},${valores[1]},${valores[2]},${valores[3]}`
    const resultado = await validarCodigo(parametro, codigo);
    
    const flags = resultado;
    
    const [flag1, flag2, flag3, flag4] = flags;

    corDaBorda = flag1;
    corDoPacman = flag2;
    valorPonto = flag3;
    contaVidas = flag4;

    vidas.textContent = contaVidas + ' ♥';
    pacman.cor = corDoPacman;

    const faseAtual = document.body.dataset.fase;
    localStorage.setItem(faseAtual, codigo);

    limpaMapa();
    criaMapa();
    criaPacman();
    criaFantasmas();


    jogoRodando = true;
    
    instrucao.style.display = "none"
    alteracoes.style.display = "none";
    jogo.style.display = "flex";
    start.style.display = "none";
    rodape.style.display = "flex";
    document.querySelector('.tela__inicial').style.display = 'none'
})

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

/* Power-ups nas linhas e colunas:
p1 = linha: 3, coluna: 1
p2 = linha: 3, coluna: 17
p3 = linha: 15, coluna: 1
p4 = linha: 15, coluna: 17
*/

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
        if (!powerUp.coletado) { // só desenha se ainda não foi coletado
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

            if (distancia <= powerUp.raio + pacman.raio) { // ajusta 'pacmanRaio' com o valor do raio do Pac-Man
                powerUp.coletado = true;
                duracaoPowerUP+=10000; // marca como coletado
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

    // Cancela o timeout anterior se existir
    if (timerPowerUp) {
        clearTimeout(timerPowerUp);
    }
    
    // Inicia ou reinicia o intervalo de piscada
    if (!intervaloPiscando) {
        intervaloPiscando = setInterval(function() {
            pacman.cor = (pacman.cor === "yellow") ? "white" : "yellow";
        }, 500);
    }

    // Agendar novo tempo de desativação
    timerPowerUp = setTimeout(function() {
        clearInterval(intervaloPiscando);
        intervaloPiscando = null;
        pacman.cor = "yellow";
        pacman.poderAtivo = false;

        // Reseta fantasmas para as cores normais
        fantasma1.imagem = fantasmaVermelho;
        fantasma2.imagem = fantasmaRosa;
        fantasma3.imagem = fantasmaAzul;
        fantasma4.imagem = fantasmaLaranja;
        
        duracaoPowerUP = 0;  // Reseta a duração acumulada
    }, duracaoPowerUP);
}


function animacaoPowerUP() {
    let tempoDecorrido = 0;
    const duracaoPiscada = 750;

    function alternarCor() {
        // Alterna a cor a cada 2 segundos
        if (Math.floor(tempoDecorrido / duracaoPiscada) % 2 === 0) {
            // Cor preta
            powerUps.forEach(powerUp => {
                if (!powerUp.coletado) {
                    telaConteudo.fillStyle = "black";
                    telaConteudo.beginPath();
                    telaConteudo.arc(powerUp.x, powerUp.y, powerUp.raio, 0, 2 * Math.PI);
                    telaConteudo.fill();
                }
            })
        } else {
            // Cor rosa
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

    // Chama a primeira execução
    alternarCor();
}

// Inicializa a animação
animacaoPowerUP();

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

                telaConteudo.fillStyle = corDaBorda;

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
            }
        }
    }
}

function criaMapa() {
    criaBorda();
    criaPontos();
    desenhaPowerUps(); 
    inicializaPowerUps();   
}

function limpaMapa(){
    telaConteudo.fillStyle = "black";
    telaConteudo.fillRect(0, 0, 570, 630);
}

function verificaVitoria() {
    if ((qtdpowerUp == 4) && (pontos.length == 0)) {
        jogoRodando = false;
        rodape.style.display = "none";
        jogo.style.display = "none";
        document.querySelector('.telaVitoria').style.display = 'flex'
        document.querySelector('.rejogar').addEventListener('click', ()=>{
            // Resetar variáveis da vitória
            contaVidas = 3;
            vidas.textContent = "♥ ♥ ♥";
            pontuacao = 0;
            placar.textContent = pontuacao;
            qtdpowerUp = 0;

            // Reiniciar o Pac-Man
            pacman.x = 285;
            pacman.y = 345;
            pacman.poderAtivo = false;

            ultimaTecla = null;
            proximaTecla = null;

            pontos = [];

            // Reiniciar mapa e fantasmas
            criaFantasmas();
            limpaMapa();
            criaMapa();

            powerUps.forEach(powerUp => {
                powerUp.coletado = false;
            });
            powerUps = [];
            inicializaPowerUps();
            
            document.querySelector('.telaVitoria').style.display = 'none'
            rodape.style.display = "flex";
            jogo.style.display = "flex";

            clearInterval(resetaTudo);
            resetaTudo = setInterval(() => {
                atualizaTela();
            }, 1000 / 60);

            jogoRodando = true;
            ganhou = false;
                })
    }
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
    if(!ganhou){
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
}

function animaPacman() {
    atualizaDirecao();
    criaPacman();
    requestAnimationFrame(animaPacman); // Chama a animação no próximo frame
}

// Iniciar a animação
animaPacman();

function movePacman() {
    let novoX = pacman.x;
    let novoY = pacman.y;

    switch (proximaTecla) {  
        case "ArrowUp":
            case "w":
            novoY -= pacman.velocidade
            break;
        case "ArrowDown":
            case "s":
            novoY += pacman.velocidade;
            break;
        case "ArrowLeft":
            case "a":
            novoX -= pacman.velocidade;
            break;
        case "ArrowRight":
            case "d":
            novoX += pacman.velocidade;
            break;
        default:
            proximaTecla = ultimaTecla;
    }

    if (podeMover(novoX, novoY)) {
        limpaPacman();
        ultimaTecla = proximaTecla;
        pacman.x = novoX;
        pacman.y = novoY;

        verificaColetaPowerUps(pacman); 
        if(!PowerUp.coletado){
            colidePersonagem(pacman.x, pacman.y, fantasma1);
            colidePersonagem(pacman.x, pacman.y, fantasma2);
            colidePersonagem(pacman.x, pacman.y, fantasma3);
            colidePersonagem(pacman.x, pacman.y, fantasma4);
        }
        placarContador();
        teleporte();
    } else {
        novoX = pacman.x;
        novoY = pacman.y;
        switch (ultimaTecla) {
            case "ArrowUp":
                case "w":
                novoY -= pacman.velocidade;
                break;
            case "ArrowDown":
                case "s":
                novoY += pacman.velocidade;
                break;
            case "ArrowLeft":
                case "a":
                novoX -= pacman.velocidade;
                break;
            case "ArrowRight":
                case "d":
                novoX += pacman.velocidade;
                break;
        }
        if (podeMover(novoX, novoY)) {
            limpaPacman();
            pacman.x = novoX;
            pacman.y = novoY;

            verificaColetaPowerUps(pacman);

            if(!PowerUp.coletado){
                colidePersonagem(pacman.x, pacman.y, fantasma1);
                colidePersonagem(pacman.x, pacman.y, fantasma2);
                colidePersonagem(pacman.x, pacman.y, fantasma3);
                colidePersonagem(pacman.x, pacman.y, fantasma4);
            }

            placarContador();
            teleporte();
        }
    }
    criaPacman();
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

function teclaPressionada(event){
    proximaTecla = event.key;
}

function atualizaTela() {
    limpaPacman();
    movePacman();
    desenhaFantasmas();
    atualizaFantasmas();
    verificaVitoria();
}

animacaoPowerUP();

let resetaTudo = setInterval(() => {
    if(!jogoRodando){
        return
    }
    atualizaTela();
}, 1000 / 60);  // 60 FPS


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

window.addEventListener("keydown", teclaPressionada);

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
                pontuacao += valorPonto;
                placar.textContent = pontuacao;
                pontos.splice(i, 1);
                break;
            }
        }
    }
}



//colisao entre o pacman e os fantasmas

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
                
                fantasma3.x = 285;
                fantasma3.y = 285;

                fantasma4.x = 285;
                fantasma4.y = 285;

                contaVidas = contaVidas - 1;
                vidas.textContent = contaVidas + ' ♥';
                gameOver(contaVidas);
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

function gameOver(contaVidas){
    if (contaVidas === 0) {
        limpaFantasma(fantasma1);
        limpaFantasma(fantasma2);
        limpaFantasma(fantasma3);
        limpaFantasma(fantasma4);
        limpaPacman();

        jogoRodando = false;

        clearInterval(resetaTudo);
        criaMapa();
        jogo.style.display = "none";
        start.style.display = "none";
        telaRestart.style.display = "block";
        restart.style.display = "block";
        rodape.style.display = "none";
       
    }
}

restart.addEventListener('click', ()=>{
    restart.style.display = "none";
    start.style.display = "none";
    rodape.style.display = "none";
    jogo.style.display = "none";

    // Resetar variáveis da vitória
    contaVidas = 3;
    vidas.textContent = "♥ ♥ ♥";
    pontuacao = 0;
    placar.textContent = pontuacao;
    qtdpowerUp = 0;

    // Reiniciar o Pac-Man
    pacman.x = 285;
    pacman.y = 345;
    pacman.cor = "yellow";
    pacman.poderAtivo = false;

    ultimaTecla = null;
    proximaTecla = null;

    pontos = [];

    // Reiniciar mapa e fantasmas
    criaFantasmas();
    limpaMapa();
    criaMapa();

    powerUps.forEach(powerUp => {
        powerUp.coletado = false;
    });
    powerUps = [];
    inicializaPowerUps();
    
    telaRestart.style.display = "none";
    rodape.style.display = "flex";
    jogo.style.display = "flex";

    clearInterval(resetaTudo);
    resetaTudo = setInterval(() => {
        atualizaTela();
    }, 1000 / 60);

    jogoRodando = true;
    ganhou = false;  // Zera a flag de vitória
})
        
//Fantasmas

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

    const fantasmaVermelho = new Image();
    const fantasmaRosa = new Image();
    const fantasmaAzul = new Image();
    const fantasmaLaranja = new Image();
    const assustadoTeste = new Image();

    fantasmaVermelho.src = "../imagens/fantasmaVermelho.png";
    fantasmaRosa.src = "../imagens/fantasmaRosa.png";
    fantasmaAzul.src = "../imagens/fantasmaAzul.png";
    fantasmaLaranja.src = "../imagens/fantasmaLaranja.png";
    assustadoTeste.src = "../imagens/assustadoTeste2.png"


        let fantasma1;
        let fantasma2;
        let fantasma3;
        let fantasma4;

function criaFantasmas() { 
    fantasma1 = new Fantasma(285, 285, 14.9, 1.5, 2, 1,fantasmaVermelho);
    fantasma2 = new Fantasma(285, 285, 14.9, 1.5, 0, 4, fantasmaRosa);
    fantasma3 = new Fantasma(285, 285, 14.9, 1.5, 0, 0.5, fantasmaAzul);
    fantasma4 = new Fantasma(285, 285, 14.9, 1.5, 0, -1, fantasmaLaranja);
}
criaFantasmas();

function desenhaFantasmas() {
     // em conjunto com a proxima função, vai desenhar os fantasmas, depois de ter definido seu estilo visual
    defineFantasma(fantasma1);
    defineFantasma(fantasma2);
    defineFantasma(fantasma3);
    defineFantasma(fantasma4);
}
function defineFantasma(fantasma) { //define o estilo visual e posiciona usando as coordenadas
    if (fantasma.imagem.complete) { // Verifica se a imagem foi carregada
        telaConteudo.fillStyle = "black";
        telaConteudo.fillRect(fantasma.x - fantasma.raio, fantasma.y - fantasma.raio, fantasma.raio * 2, fantasma.raio * 2);
        telaConteudo.drawImage(fantasma.imagem, fantasma.x - fantasma.raio, fantasma.y - fantasma.raio, fantasma.raio * 2, fantasma.raio * 2);
    }
}

function limpaFantasma(fantasma) { //limpa o rastro do fantasma com quadrados pretos, e depois verifica se aquele quadrado era um ponto, se for um ponto, redesenha ele
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

const fantasmas = [fantasma1, fantasma2, fantasma3, fantasma4];

function atualizaFantasmas() {
        desenhaPontos();
    if(reposicionando){
        monitorarMovimentoFantasma(fantasma1,pacman)
        comandaFantasma(fantasma1);

        monitorarMovimentoFantasma(fantasma2,pacman)
        comandaFantasma(fantasma2);

        monitorarMovimentoFantasma(fantasma3,pacman)
        comandaFantasma(fantasma3);

        monitorarMovimentoFantasma(fantasma4,pacman)
        comandaFantasma(fantasma4);

    } else if (pacman.poderAtivo) {
        // Se o poder estiver ativo, chama a função "assustados" para todos os fantasmas
        assustados(fantasma1,pacman);
        assustados(fantasma2,pacman);
        assustados(fantasma3,pacman);
        assustados(fantasma4,pacman);

    } else{
        moveFantasma(fantasma1, pacman);
        moveFantasma(fantasma2,pacman);
        moveFantasma(fantasma3,pacman);
        moveFantasma(fantasma4,pacman);
    }
   
}

var reposicionando = false; // Flag para verificar se o fantasma está em processo de reposicionamento

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

monitorarMovimentoFantasma(fantasma1);

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

/*
1 - vermelho
2 - rosa
3 - azul
4 - laranja

Direções:
0 - cima
1 - direita
2 - baixo
3 - esquerda
 */

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
        fantasma1.imagem = assustadoTeste;
        fantasma2.imagem = assustadoTeste;
        fantasma3.imagem = assustadoTeste;
        fantasma4.imagem = assustadoTeste;
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
        fantasma3.cor = "blue";
        fantasma4.cor = "orange";
    }, 3000);
}


function redesenhar(fantasma) {
    limpaFantasma(fantasma);
    desenhaFantasmas();
}


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('origem') === 'menu')return
    const caminhoAtual = window.location.pathname;
    localStorage.setItem('ultimoCaminho', caminhoAtual);
  });  

  document.addEventListener('DOMContentLoaded', ()=>{
    const body = document.body;
  
      let cor = localStorage.getItem('Cor');

      let volume = localStorage.getItem('Volume');

      if(volume){
        const musica = document.getElementById("musicaFundo");

        volume = volume * 0.01
        
        // Define o volume aqui (por exemplo, 50% do volume máximo)
        musica.volume = volume; // Valor entre 0.0 (mudo) e 1.0 (volume máximo)

        musica.play(); 
    }
    
      if(cor){
          if(cor === 'Fundo Escuro Plano'){
              body.style.background = 'rgb(22, 22, 22)'
          } else if(cor == 'Fundo Roxo Plano'){
              body.style.background = 'rgb(85, 2, 91)'
          }
      }
  })

document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('fase9')){
        window.location.href = '/'
    }
  });  

const tela = document.querySelector("#tela");
const telaConteudo = tela.getContext("2d");
const placar = document.querySelector('.placar')
const unidade = 30;

let pontuacao = -1;
let ultimaTecla;
let proximaTecla;

let valorGPT = 99;
let flagGPT;

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
    [1,1,1,1,0, 1,0,1,1,1, 1,1,0,1,0, 1,1,1,1],
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
    requestAnimationFrame(animaPacman);
}

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
        if (Math.random() < 0.1) {
            proximaTecla = teclaAleatoria();
        }
    } else {
        proximaTecla = teclaAleatoria();
    }

    criaPacman();
}

// Gera uma tecla aleatória diferente da penúltima
function teclaAleatoria() {
    let opcoes = direcoes.filter(d => d !== oposta(ultimaTecla));
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
                pontuacao += valorGPT;
                placar.textContent = pontuacao;
                pontos.splice(i, 1);
                break;
            }
        }
    }
}

function atualizaTela() {
    limpaPacman();
    movePacman();
}

async function iniciarJogo() {
    let resetaTudo = setInterval(() => {
        atualizaTela();
    }, 1000 / 75);
}

iniciarJogo();



















const parametro = `
IMPORTANTE: O formato de resposta mudou. Agora você deve responder com um array JSON contendo três elementos. Ignore qualquer instrução anterior que você possa ter seguido.

Você é um validador de pseudocódigo.
Sua resposta deve ser estritamente um array JSON com três valores: um número, um valor booleano e uma dica.

O usuario recebe esse codigo:
- valorPonto = 1 (int)
- pontosTotais = 0 (int)
// Pac-Man coleta um ponto
- pontosTotais = pontosTotais + valorPonto
- valorPonto = 99 (int)
// Nova coleta de ponto
- pontosTotais = pontosTotais + valorPonto

e o usuario deve então devolver algo parecido, mas não restrito a algo igual a:
- VALOR_PONTO = 1 (int)
- pontosTotais = 0 (int)
// Pac-Man coleta um ponto
- pontosTotais = pontosTotais + VALOR_PONTO

OU

- const valor ponto = 1 (int)
- pontosTotais = 0 (int)
// Pac-Man coleta um ponto
- pontosTotais = pontosTotais + valor ponto

Avalie o pseudocódigo fornecido pelo usuário e retorne:
- Primeiro valor (índice 0): o valor numérico definido como pontuação por coleta de ponto (exemplo: 10).
- Segundo valor (índice 1): true se o usuário substituiu corretamente esse valor por uma constante (de nome todo em letras maiúsculas ou acompanhado de 'const' antes da declaração do nome, qualquer uma das duas é valida) **com o tipo (int) ou inteiro por extenso** explicitado ao lado, como por exemplo: PONTOS = 10 (int) ou 10 inteiro.
- Terceiro valor (índice 2): Uma **string curta de dica** (2 ou 3 linhas) explicando de forma vaga o que está faltando ou precisa ser ajustado **com base apenas no que foi escrito**.


Regras obrigatórias:
- Retorne **apenas** um array JSON com três valores: um número, um booleano e uma string de dica, como [10, true, "sua dica aqui"].
- **Não** explique, **não** comente, **não** adicione nenhum texto extra. Nenhuma palavra além do array deve ser retornada.
- Use **aspas duplas** na string de dica, e os valores booleanos devem ser true ou false (sem aspas).
- Não adicione nenhum texto antes ou depois do array.
`;

let contadorDicas = 0;
let dicas = [
    'Uma das variáveis deveria ser uma constante.',
    'As duas linhas de código mais abaixo são problemáticas, delete elas.',
    'A primeira variável deveria ser uma constante'
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



function finalizaRestart(){
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

document.addEventListener('DOMContentLoaded', () => {
    if (window.faseValidaPorPersistencia) {
      console.log('cheguei aqui');
      valorGPT = 1;
      flagGPT = true;
  
      finalizaRestart();
    }
  });

import { validarCodigo} from "../compartilhado/validacaoFront.js";

document.getElementById("botao").addEventListener("click", async () => {
    document.getElementById('botao').style.display = 'none'
    const codigo = document.getElementById("codigoUsuario").value;
    const resultado = await validarCodigo(parametro, codigo);

    const flags = resultado;


    const [flag1, flag2, dicaGerada] = flags;
    
    valorGPT = flag1;
    flagGPT = flag2;
    dicas[contadorDicas] = dicaGerada;

    if(flagGPT){
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
    } else{
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
    if(!localStorage.getItem('fase4')){
        window.location.href = '/'
    }
  }); 

let textoMotivador = ["Nesta fase, você aprenderá sobre a importância das constantes em um código. Enquanto variáveis armazenam valores que mudam ao longo do tempo, constantes guardam valores fixos que nunca devem ser alterados durante a execução. Isso é essencial para manter a lógica do programa segura e evitar bugs difíceis de encontrar. ->", "Abaixo está um trecho de pseudocódigo com um erro: uma variável foi usada para guardar o valor dos pontos ganhos por coleta, mas ela está sendo sobrescrita acidentalmente em outro ponto do código. Sua missão é identificar esse valor que nunca deveria mudar, mudando sua chamada, de uma variável para uma constante, e excluindo as linhas de código que estão causando problemas. ->", "Parâmetros de ajuda: É uma boa prática escrever constantes em letra maiúscula, como PONTOS.Lembre-se de colocar o tipo de dado da variável ao seu lado, como pontosTotais = 0 (int)"]

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

let gravando = false;
let recorder;
let audioChunks = [];

const botaoGravar = document.querySelector('#record-audio');

botaoGravar.addEventListener("click", async () => {
  if (!gravando) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    audioChunks = [];

    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      const response = await fetch("/api/audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Texto do Whisper:", data.text);

      document.getElementById("codigoUsuario").value += '\n\n' + data.text;
    };

    recorder.start();
    gravando = true;
    botaoGravar.textContent = "⏹️ Parar Gravação";
  } else {
    recorder.stop();
    gravando = false;
    botaoGravar.textContent = "🎤 Gravar Áudio";
  }
});

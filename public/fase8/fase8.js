const respostasCorretas = ['&&', '||', '&& !'];

var acertou = false;
var pontosUsuario = document.querySelector('.pontosUsuario');

document.addEventListener('DOMContentLoaded', ()=> {
    var pontosLocal = localStorage.getItem('pontuação');
    pontosUsuario.innerHTML = pontosLocal;
});

document.querySelector('#botao').addEventListener('click', () => {
    const selects = document.querySelectorAll('.options');
    const respostasUsuario = [];

    for (let i = 0; i < selects.length; i++) {
        respostasUsuario.push(selects[i].value);
    }

    let tudoCerto = true;
    let acertouAlguma = false; // NOVO: controla se acertou pelo menos 1

    for (let i = 0; i < selects.length; i++) {
        if (respostasCorretas[i] === respostasUsuario[i]) {
            if (!selects[i].classList.contains('lockado')) {
                // Primeira vez acertando esse campo
                let pontosNumeral = parseInt(pontosUsuario.textContent);
                pontosNumeral += 10;
                pontosUsuario.innerHTML = pontosNumeral;
                localStorage.setItem('pontuação', pontosNumeral);
            }
            selects[i].disabled = true;
            selects[i].classList.add('lockado');
            acertouAlguma = true; // Marcou que acertou pelo menos uma
        } else {
            tudoCerto = false;
            selects[i].value = '';
        }
    }

    // Se não acertou nenhuma resposta
    if (!acertouAlguma) {
        let pontosNumeral = parseInt(pontosUsuario.textContent);
        pontosNumeral -= 10;
        pontosUsuario.innerHTML = pontosNumeral;
        localStorage.setItem('pontuação', pontosNumeral);
    }

    // Se acertou todas as respostas
    if (tudoCerto) {
        document.getElementById('botao').style.display = 'none';
        document.getElementById('avancar').style.display = 'block';
        if (localStorage.getItem('veioDoMenu') === 'true') {
            localStorage.removeItem('veioDoMenu');
            document.getElementById('avancar').textContent = 'Voltar para o Menu';
            document.getElementById('avancar').addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/';
            });
        }
        let pontosNumeral = parseInt(pontosUsuario.textContent);
        pontosNumeral += 150;
        pontosUsuario.innerHTML = pontosNumeral;
        localStorage.setItem('pontuação', pontosNumeral);
        const faseAtual = document.body.dataset.fase;
        localStorage.setItem(faseAtual, true);
        acertou = true;
    }
    
    for (let i = 0; i < selects.length; i++) {
        if (respostasCorretas[i] === respostasUsuario[i]) {
            selects[i].disabled = true;
            selects[i].classList.add('lockado')
        } else {
            selects[i].value = '';
        }
    }
});

let contadorDicas = 0;
let dicas = [
    'Leia a frase em voz alta e tente entender os operadores lógicos utilizados',
    '&& é utilizado quando duas afirmações precisam ser verdadeiras, || é quando uma de duas afirmações precisa ser verdadeira,e o ! é uma negação de algo',
    '&&, ||, && !'
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

//SE (pontosColetados == 180 && powerUpsColetados == 4) || (fantasmasNoMapa == 0 && !vidasAcabaram ) 


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('origem') === 'menu')return
    const caminhoAtual = window.location.pathname;
    localStorage.setItem('ultimoCaminho', caminhoAtual);
  });

  document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('fase7')){
        window.location.href = '/'
    }
  });  

function normalizarOperadores(speech) {
    let code = speech.toLowerCase();

    // Basic logical operators
    code = code.replace(/\band\b/g, "&&");
    code = code.replace(/\bor\b/g, "||");
    code = code.replace(/\bnot\b/g, "!");

    // Combined negation
    code = code.replace(/\band not\b/g, "&& !");
    code = code.replace(/\bor not\b/g, "|| !");

    return code;
}


let gravando = false;
let recorder;
let audioChunks = [];

const botaoGravar = document.querySelector('#record-audio');
let indiceAtual = 0;

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

        // Envia para o backend
        const response = await fetch("/api/audio", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Texto do Whisper:", data.text);

        // Normaliza operadores
        const falaNormalizada = normalizarOperadores(data.text);

        // Preenche os selects automaticamente
        const selects = document.querySelectorAll(".options");

        if (selects[indiceAtual]) {
            selects[indiceAtual].value = falaNormalizada;
            indiceAtual = (indiceAtual + 1) % selects.length;
        }

        botaoGravar.textContent = "🎤 Gravar Áudio";
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

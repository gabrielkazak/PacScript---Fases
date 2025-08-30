const respostasCorretas = ['string', 'int', 'float', 'booleano'];

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
    let acertouAlguma = false;

    for (let i = 0; i < selects.length; i++) {
        if (respostasCorretas[i] === respostasUsuario[i]) {
            if (!selects[i].classList.contains('lockado')) {
                let pontosNumeral = parseInt(pontosUsuario.textContent);
                pontosNumeral += 10;
                pontosUsuario.innerHTML = pontosNumeral;
                localStorage.setItem('pontuação', pontosNumeral);
            }
            selects[i].disabled = true;
            selects[i].classList.add('lockado');
            acertouAlguma = true;
        } else {
            tudoCerto = false;
            selects[i].value = '';
        }
    }

    if (!acertouAlguma) {
        let pontosNumeral = parseInt(pontosUsuario.textContent);
        pontosNumeral -= 10;
        pontosUsuario.innerHTML = pontosNumeral;
        localStorage.setItem('pontuação', pontosNumeral);
    }

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
    'Procure lembrar qual a função de cada tipo de dado.',
    'Nos 4 tipos de dados apresentados, dois são usados exclusivamente pra números, um tem apenas duas opções de valores, e o outro aceita variadas informações.',
    'Float e Int são pra números, booleanos são pra condições de verdadeiro ou falso, e strings são frases'
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


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('origem') === 'menu')return
    const caminhoAtual = window.location.pathname;
    localStorage.setItem('ultimoCaminho', caminhoAtual);
  });  

document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('fase3')){
        window.location.href = '/'
    }
  });  

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

      // Preenche os selects automaticamente
      const fala = data.text.toLowerCase().trim();
      const selects = document.querySelectorAll(".options");
      let valor = "";

      if (fala.includes("string")) valor = "string";
      else if (fala.includes("boolean") || fala.includes("boleano")) valor = "booleano";
      else if (fala.includes("float") || fala.includes("flut")) valor = "float";
      else if (fala.includes("int") || fala.includes("inteiro")) valor = "int";

      if (valor && selects[indiceAtual]) {
        selects[indiceAtual].value = valor;
        indiceAtual = (indiceAtual + 1) % selects.length; // passa pro próximo
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

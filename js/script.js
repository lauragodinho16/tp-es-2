let titulo = document.getElementById('titulo');
let nomeCargo = document.getElementById('cargo');

let cargo = document.querySelector('.display-1-2');
let numerosCaixa = document.querySelector('.display-1-3');
let descricao = document.querySelector('.display-1-4');

let aviso = document.querySelector('.display-2');
let lateral = document.querySelector('.display-1-right');

let senhaAdm = false;

let etapaAtual = 1;
let numeroDigitado = '';
let votoBranco = false;
let votoNulo = false;
let votos = [];
let codigoAdministrador = '';
let tituloEleitorCandidato = '';
let sessionId = '';
let qtdVotacao = 0;
function comecarVotacao() {
    let etapa = etapas.object[etapaAtual];
    let senhaHTML = '';

    // Resetando todas as variáveis relacionadas à votação para seus valores iniciais
    numeroDigitado = '';
    votoBranco = false;
    votoNulo = false;
    votos = [];

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            senhaHTML += '<div class="numero pisca"></div>';
        } else {
            senhaHTML += '<div class="numero"></div>';
        }
    }

    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numerosCaixa.innerHTML = senhaHTML;
}

function votaCandidato() {
    let etapa = etapas.object[etapaAtual];
    let numeroHTML = '';
    numeroDigitado = '';
    votoBranco = false;
    votoNulo = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHTML += '<div class="numero pisca"></div>';
        } else {
            numeroHTML += '<div class="numero"></div>';
        }
    }

    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numerosCaixa.innerHTML = numeroHTML;
}

function atualizaInterface() {
    let etapa = etapas.object[etapaAtual];

    // Limpar valores anteriores
    titulo.textContent = '';
    cargo.innerHTML = '';
    descricao.innerHTML = '';
    lateral.innerHTML = '';
    aviso.style.display = 'none';

    if (etapaAtual === 0) {
        // Mostrar apenas o título para a etapa de administrador
        titulo.textContent = 'ADMINISTRADOR:';
        aviso.style.display = 'block';
        descricao.innerHTML = '';

        // Verificar se o número digitado corresponde a um administrador válido
        let senhaADM = etapa.administradores.find(item => item.senha === numeroDigitado);
        if (senhaADM) {
            descricao.innerHTML = '<div class="aviso--grande">ACESSO LIBERADO</div>';
            senhaAdm = true;
        } else {
            descricao.innerHTML = '<div class="aviso--grande">ACESSO NEGADO</div>';
            senhaAdm = false;
        }
    } else {
        // Para etapas de votação de candidatos
        let candidato = etapa.candidatos.find(item => item.numero === numeroDigitado);
        if (candidato) {
            // Mostrar detalhes do candidato
            titulo.textContent = 'SEU VOTO PARA';
            aviso.style.display = 'block';
            descricao.innerHTML = 'Nome: ' + candidato.nome + '<br/>' + 'Partido: ' + candidato.partido;

            let fotosHTML = '';

            if (candidato.urlImagem) {
                fotosHTML += '<div class="display-1-image"> <img src="' +
                    candidato.urlImagem + '" alt="" />' + etapa.titulo + '</div>';
            }
            if (candidato.vicePresidente) {
                fotosHTML += '<div class="display-1-image"> <img src="' +
                    candidato.vicePresidente.urlImagem + '" alt="" />' + candidato.vicePresidente.cargo + '</div>';
            }

            lateral.innerHTML = fotosHTML;
        } else {
            // Se o número digitado não corresponder a um candidato válido
            titulo.textContent = 'SEU VOTO PARA';
            aviso.style.display = 'block';
            descricao.innerHTML = '<div class="aviso--grande">VOTO NULO</div>';
            votoNulo = true;
        }
    }
}

function clicou(num) {
    let ehNumero = document.querySelector('.numero.pisca');

    if (ehNumero !== null) {
        ehNumero.innerHTML = num;
        numeroDigitado = numeroDigitado + num;

        ehNumero.classList.remove('pisca');

        if (ehNumero.nextElementSibling !== null) {
            ehNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
}

function branco() {
    numeroDigitado === '';
    votoBranco = true;
    titulo.textContent = 'SEU VOTO PARA';
    aviso.style.display = 'block';
    numerosCaixa.innerHTML = '';
    descricao.innerHTML = '<div class="aviso--grande">VOTO EM BRANCO</div>';
    lateral.innerHTML = '';
}

function corrige() {
    votaCandidato();
}

function confirma() {
    let etapa = etapas.object[etapaAtual];
    let votoConfirmado = false;

    if (votoBranco === true) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas.object[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if (numeroDigitado.length === etapa.numeros) {
        votoConfirmado = true;

        if (votoNulo === true) {
            votos.push({
                etapa: etapas.object[etapaAtual].titulo,
                voto: 'nulo'
            });
        } else {
            votos.push({
                etapa: etapas.object[etapaAtual].titulo,
                voto: numeroDigitado,
            });
        }
    }
    if (votoConfirmado) {
        etapaAtual++;
        if (etapas.object[etapaAtual] !== undefined) {
            votaCandidato();
        } else {
            document.querySelector('.telafim').style.display = 'block';
            document.querySelector('.tela').style.display = 'none';

            setTimeout(function () {
                votos.push({ administrador: codigoAdministrador });
                votos.push({ tituloEleitor: tituloEleitorCandidato });
                votos.push({ idVotacao: sessionId });
                enviarVotosParaBancoDeDados();
                qtdVotacao = qtdVotacao + 1;
                reiniciarVotacao()
            }, 2000);
        }
    }
}

function verificarAdministrador() {
    let etapa = etapas.object[0];

    codigoAdministrador = document.getElementById('codigoAdministrador').value;

    etapa.administradores.filter((item) => {
        if (item.senha === codigoAdministrador) {
            document.querySelector('.administrador').style.display = 'none';
            document.querySelector('.iniciarVotacao').style.display = 'block';
            document.querySelector('.contentContainer').style.display = 'block';
            document.querySelector('.relatorio-container').style.display = 'none';
            senhaAdm = true;
        } else {
            alert('Código do administrador incorreto. Tente novamente.');
            senhaAdm = false;
        }
    });
}

function iniciarVotacao() {
    const tituloEleitor = document.getElementById('tituloEleitor').value;

 



    document.querySelector('.iniciarVotacao').style.display = 'none';
    document.querySelector('.urna').style.display = 'none';
    document.querySelector('.contentContainer').style.display = 'none';
    document.querySelector('.iniciarVotacao2').style.display = 'block';
    sessionId = Date.now();
    document.getElementById("sessao").textContent = sessionId;
    qtdVotacao = 0;
    document.getElementById("qtd").textContent = qtdVotacao;
    document.querySelector('.relatorio-container').style.display = 'none';



}

async function iniciarVotacao2() {

    tituloEleitorCandidato = document.getElementById('tituloEleitor').value;

    let result = validateTituloEleitor(tituloEleitorCandidato);
    if (!result.valid) {
        document.getElementById('tituloEleitorError').textContent = result.error;
        return;
    }
    resultUsuarioJaVotou = await verificarVotoDuplicadoUsuario(tituloEleitorCandidato);
    if(resultUsuarioJaVotou){
        alert('Usuario já votou.');
        return;
    }
    document.getElementById('tituloEleitorError').textContent = '';
    document.querySelector('.iniciarVotacao').style.display = 'none';
    document.querySelector('.urna').style.display = 'flex';
    document.querySelector('.contentContainer').style.display = 'none';
    document.querySelector('.iniciarVotacao2').style.display = 'none';
    document.querySelector('.relatorio-container').style.display = 'none';

    etapaAtual = 1;
    numeroDigitado = '';
    votoBranco = false;
    votoNulo = false;
    votos = [];
    comecarVotacao();
}

async function enviarVotosParaBancoDeDados() {
    try {
        const response = await fetch('/salvar-votos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ votos: votos })
        });
        const data = await response.json();

    } catch (error) {
        console.error('Erro ao enviar votos para o banco de dados:', error);
    }
}

async function gerarRelatorioSessao() {
    try {
        const response = await fetch(`/obter-resultado?idSessao=${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        document.querySelector('.iniciarVotacao').style.display = 'block';
        document.querySelector('.urna').style.display = 'none';
        document.querySelector('.contentContainer').style.display = 'block';
        document.querySelector('.iniciarVotacao2').style.display = 'none';
        document.getElementById('deputadoForm').classList.remove('active');
        document.getElementById('presidenteForm').classList.remove('active');

        relatorio = calcularVencedorEleicao(data, sessionId);
    } catch (error) {
        console.error('Erro relatório:', error);
    }
}

function calcularVencedorEleicao(votos, sessionId) {
    const votosDeputado = {};
    const votosPresidente = {};
    const sessao = sessionId;

    let votosBrancos = 0;
    let votosNulos = 0;

    if (votos) {
        votos.forEach(voto => {
            if (voto.numeroDeputado !== "nulo" && voto.numeroDeputado !== "branco") {
                votosDeputado[voto.numeroDeputado] = (votosDeputado[voto.numeroDeputado] || 0) + 1;
            } else if (voto.numeroDeputado === "branco") {
                votosBrancos++;
            } else {
                votosNulos++;
            }

            if (voto.numeroPresidente !== "nulo" && voto.numeroPresidente !== "branco") {
                votosPresidente[voto.numeroPresidente] = (votosPresidente[voto.numeroPresidente] || 0) + 1;
            } else if (voto.numeroPresidente === "branco") {
                votosBrancos++;
            } else {
                votosNulos++;
            }
        });
    }

    const vencedorDeputado = determinarVencedor(votosDeputado);
    const vencedorPresidente = determinarVencedor(votosPresidente);

    const votosDeputadoOrdenados = ordenarVotos(votosDeputado);
    const votosPresidenteOrdenados = ordenarVotos(votosPresidente);

    const relatorio = `
        Resultados da Eleição:
        Deputado Vencedor: ${vencedorDeputado || "Não houve votos válidos para deputado"}
        Presidente Vencedor: ${vencedorPresidente || "Não houve votos válidos para presidente"}
        Votos Brancos Totais: ${votosBrancos}
        Votos Nulos Totais: ${votosNulos}
    `;

    gerarRelatorio(vencedorDeputado || "Não houve votos válidos para deputado", vencedorPresidente || "Não houve votos válidos para presidente", votosBrancos, votosNulos, sessao, votosDeputadoOrdenados, votosPresidenteOrdenados, votos.length);

    return relatorio;
}

function ordenarVotos(votos) {
    const votosOrdenados = [];
    for (const candidato in votos) {
        votosOrdenados.push({ candidato, votos: votos[candidato] });
    }
    votosOrdenados.sort((a, b) => b.votos - a.votos); // Ordena por quantidade de votos, do maior para o menor
    return votosOrdenados;
}

function determinarVencedor(contagemVotos) {
    let vencedor = null;
    let maxVotos = 0;
    let empate = false;

    Object.entries(contagemVotos).forEach(([candidato, votos]) => {
        if (votos > maxVotos) {
            maxVotos = votos;
            vencedor = candidato;
            empate = false;
        } else if (votos === maxVotos && maxVotos !== 0) {
            empate = true;
        }
    });

    return empate ? "Empate" : vencedor;
}
function criarElemento(tag, classes, texto) {
    const elemento = document.createElement(tag);
    if (classes) elemento.className = classes;
    if (texto) elemento.textContent = texto;
    return elemento;
}
function gerarRelatorio(
    vencedorDeputado,
    vencedorPresidente,
    votosBrancos,
    votosNulos,
    idVotacao,
    votosDeputadoOrdenados,
    votosPresidenteOrdenados,
    qtdEleitores
) {
    document.querySelector('.relatorio-container').style.display = 'block';

    document.getElementById('votacaoId').textContent = idVotacao;
    document.getElementById('vencedorDeputado').textContent = vencedorDeputado;
    document.getElementById('vencedorPresidente').textContent = vencedorPresidente;
    document.getElementById('votosBrancos').textContent = votosBrancos.toString();
    document.getElementById('votosNulos').textContent = votosNulos.toString();

    const tabelaPresidentes = document.getElementById('tabelaPresidentes').querySelector('tbody');
    const tabelaDeputados = document.getElementById('tabelaDeputados').querySelector('tbody');

    tabelaPresidentes.innerHTML = '';
    tabelaDeputados.innerHTML = '';


    votosPresidenteOrdenados.forEach((voto, index) => {
        const row = tabelaPresidentes.insertRow();
        const cellNumero = row.insertCell(0);
        const cellVotos = row.insertCell(1);
        cellNumero.textContent = voto.candidato?.toString();
        cellVotos.textContent = voto.votos?.toString();
    });

    votosDeputadoOrdenados.forEach((voto, index) => {
        const row = tabelaDeputados.insertRow();
        const cellNumero = row.insertCell(0);
        const cellVotos = row.insertCell(1);
        cellNumero.textContent = voto.candidato?.toString();
        cellVotos.textContent = voto.votos?.toString();
    });

    const totalVotos = votosDeputadoOrdenados.reduce((total, voto) => total + voto.votos, 0) +
        votosPresidenteOrdenados.reduce((total, voto) => total + voto.votos, 0) + votosBrancos + votosNulos;

    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    const horaRelatorio = `${dia}/${mes}/${ano} ${hora}:${minutos}`;
    document.getElementById('horaRelatorio').textContent = horaRelatorio;

    document.getElementById('quantidadeEleitores').textContent = qtdEleitores.toString();

}

function reiniciarVotacao() {
    document.querySelector('.telafim').style.display = 'none';
    document.querySelector('.tela').style.display = 'flex';
    document.getElementById('tituloEleitor').value = '';
    document.querySelector('.iniciarVotacao').style.display = 'none';
    document.querySelector('.urna').style.display = 'none';
    document.querySelector('.contentContainer').style.display = 'none';
    document.querySelector('.iniciarVotacao2').style.display = 'block';
    document.getElementById("qtd").textContent = qtdVotacao;
    document.querySelector('.relatorio-container').style.display = 'none';

    etapaAtual = 0;

    numeroDigitado = '';
    votoBranco = false;
    votoNulo = false;
    votos = [];
    senhaAdm = false;
    comecarVotacao();
}

function validateTituloEleitor(te) {
    // Remove todos os caracteres não numéricos e preenche com zeros à esquerda
    te = te.replace(/\D/g, '').padStart(12, '0');

    // Verifica se o título de eleitor tem o formato correto
    if (te.length !== 12) {
        return { valid: false, error: "Número de título de eleitor inválido: o formato deve ser composto por 12 dígitos numéricos." };
    }

    // Obtém o código do estado (UF) do título de eleitor
    const uf = parseInt(te.substr(8, 2));

    // Verifica se o código do estado (UF) é válido
    if(uf < 1 || uf > 28){
        return { valid: false, error: "Número de título de eleitor inválido: código do estado inválido" };
    }

    let d = 0;
    // Calcula o primeiro dígito verificador
    for (let i = 0; i < 8; i++) {
        d += parseInt(te[i]) * (9 - i);
    }
    d %= 11;
    if (d < 2) {
        if (uf < 3) {
            d = 1 - d;
        } else {
            d = 0;
        }
    } else {
        d = 11 - d;
    }
    // Verifica o primeiro dígito verificador
    if (parseInt(te[10]) !== d) {
        return { valid: false, error: "Número de título de eleitor inválido: o primeiro dígito verificador está incorreto." };
    }

    d *= 2;
    // Calcula o segundo dígito verificador
    for (let i = 8; i < 10; i++) {
        d += parseInt(te[i]) * (12 - i);
    }
    d %= 11;
    if (d < 2) {
        if (uf < 3) {
            d = 1 - d;
        } else {
            d = 0;
        }
    } else {
        d = 11 - d;
    }
    // Verifica o segundo dígito verificador
    if (parseInt(te[11]) !== d) {
        return { valid: false, error: "Número de título de eleitor inválido: o segundo dígito verificador está incorreto." };
    }

    return { valid: true, error: null };
}
async function verificarVotoDuplicadoUsuario(titulo) {

    const response = await fetch('/eleitor-voto-duplicado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo: titulo, idVotacao: sessionId })
    });

    const data = await response.json();
    if (data.jaVotou) {
        return true;
    }else{
        return false;
    }

}

module.exports = testCase;

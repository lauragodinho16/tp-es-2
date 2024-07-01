const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const { verificarVotoDuplicado, getEtapasFromFirestore, retornarVotosSessao, salvarVoto, adicionarDeputado, salvarRelatorio, adicionarPresidente } = require('./js/firestoreRepo.js');
const { storagee } = require('./js/firebaseConfig.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { ref, uploadBytes } = require("firebase/storage");
const { getDownloadURL } = require("firebase/storage");
const { Presidente } = require('./entidades/Presidente.js');
const { Deputado } = require('./entidades/Deputado.js');
const { Candidato } = require('./entidades/Candidato.js');
const { Voto } = require('./entidades/Voto.js');
const { Relatorio } = require('./entidades/Relatorio.js');

let etapas;
getEtapasFromFirestore().then((data) => {
  etapas = data;
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/etapas', (req, res) => {
  res.json(etapas);
});

app.post('/deputado', upload.single('imagemDeputado'), async (req, res) => {
  const { numeroDeputado, partidoDeputado, nomeDeputado, dataNascimentoDeputado } = req.body;
  const dataNascimento = new Date(dataNascimentoDeputado);


  if (!req.file) {
    throw new Error('Arquivo não encontrado');
  }

  const urlImagem = await uploadImagem(req.file)

  try {
    const novoDeputado = new Deputado(nomeDeputado, partidoDeputado, numeroDeputado, urlImagem, dataNascimento);
    let errors = [];
    const novoDeputadoErrors = novoDeputado.validar();
    if (novoDeputadoErrors.length > 0) {

      errors.push(...novoDeputadoErrors);
    }
    if (errors.length > 0) {
      return res.json({ errors });
    }

    await adicionarDeputado(novoDeputado).then(async result => {


      if (result.success) {
        etapas = result.etapas;
        return res.json({ success: true });

      } else {
        errors.push(result.message)
        return res.json({ errors });
      };


    });
  } catch (error) {
    errors.push('Ocorreu um erro durante o processamento da requisição')
    return res.json({ errors });
  }

});

app.post('/presidente', upload.fields([{ name: 'imagemPresidente', maxCount: 1 }, { name: 'imagemVicePresidente', maxCount: 1 }]), async (req, res) => {
  try {
    // Extrair dados do corpo da requisição
    const {
      numeroPresidente, partidoPresidente, nomePresidente, dataNascimentoPresidente,
      partidoVicePresidente, nomeVicePresidente, dataNascimentoVicePresidente
    } = req.body;

    // Validar se foram enviados arquivos
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new Error('Arquivo não encontrado');
    }

    // Processar imagens
    const imagemPresidenteFile = req.files['imagemPresidente'][0];
    const imagemVicePresidenteFile = req.files['imagemVicePresidente'][0];
    const urlImagemPresidente = await uploadImagem(imagemPresidenteFile);
    const urlImagemVicePresidente = await uploadImagem(imagemVicePresidenteFile);

    const errors = [];

    const novoPresidente = new Presidente(nomePresidente, partidoPresidente, numeroPresidente, urlImagemPresidente, new Date(dataNascimentoPresidente));

    const presidenteErrors = novoPresidente.validar();
    if (presidenteErrors.length > 0) {
      errors.push(" - - ERROS FORMULARIO PRESIDENTE: ");
      errors.push(...presidenteErrors);
    }

    const vicePresidente = new Candidato(nomeVicePresidente, partidoVicePresidente, numeroPresidente, urlImagemVicePresidente, new Date(dataNascimentoVicePresidente));

    const vicePresidenteErrors = vicePresidente.validar();
    if (vicePresidenteErrors.length > 0) {
      errors.push(" - -ERROS FORMULÁRIO VICE-PRESIDENTE: ");

      errors.push(...vicePresidenteErrors);
    }
    if (errors.length > 0) {
      return res.json({ errors });
    }

    novoPresidente.adicionarVicePresidente(vicePresidente);

    const result = await adicionarPresidente(novoPresidente);
    // Verificar resultado da operação
    if (result.success) {
      // Obter etapas do Firestore
      etapas = result.etapas;

      return res.json({ success: true });
    } else {
      errors.push(result.message)
      return res.json({ errors });
    }
  } catch (error) {
    errors.push('Ocorreu um erro durante o processamento da requisição')
    return res.json({ errors });
  }
});


app.post('/salvar-votos', async (req, res) => {
  const { votos } = req.body;

  let votosUsuario;
  let identificadorAdministrador;
  let numeroDeputado;
  let numeroPresidente;
  let idVotacao;
  let tituloEleitor;


  votos.forEach(item => {
    if (item.administrador) {
      identificadorAdministrador = item.administrador;
    } else if (item.idVotacao) {
      idVotacao = item.idVotacao;
    }
    else if (item.tituloEleitor) {
      tituloEleitor = item.tituloEleitor;
    }
    else if (item.etapa === 'PRESIDENTE') {
      numeroPresidente = item.voto;
    } else if (item.etapa === 'DEPUTADO') {
      numeroDeputado = item.voto;
    }

    votosUsuario = new Voto(numeroPresidente, numeroDeputado);
    let errors = [];
    const votosUsuarioErrors = votosUsuario.validar();
    if (votosUsuarioErrors.length > 0) {

      errors.push(...votosUsuarioErrors);
    }
    if (errors.length > 0) {
      return res.json({ errors });
    }

  });
  try {
    const result = await salvarVoto(votosUsuario, idVotacao);
    if (result.success) {
      const errors = [];
      const relatorio = new Relatorio(identificadorAdministrador, idVotacao, tituloEleitor);
      const relatorioErrors = relatorio.validar();
      if (relatorioErrors && relatorioErrors.length > 0) {

        errors.push(...relatorioErrors);
      }
      if (errors && errors.length > 0) {
        return res.json({ errors });
      }

      


      await salvarRelatorio(identificadorAdministrador, idVotacao, tituloEleitor);
    }
    if (result.success) {
      return res.status(200).json({ success: true, message: 'Votos salvos com sucesso' });
    } else {
      return res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao salvar os votos' });
  }


});

app.post('/eleitor-voto-duplicado', async (req, res) => {
  const { titulo, idVotacao } = req.body;

  try {
    const jaVotou = await verificarVotoDuplicado(titulo, idVotacao);
    return res.json({ jaVotou })
  } catch (error) {
    throw new Error(error.message);
  }
});

app.get('/obter-resultado', async (req, res) => {
  const { idSessao } = req.query;
  try {
    const votos = await retornarVotosSessao(idSessao);
    res.json(votos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os votos da sessão de votação' });
  }
});


async function uploadImagem(file) {
  const nomeArquivo = `${uuidv4()}_${file.originalname}`;
  const storageRef = ref(storagee, nomeArquivo);
  await uploadBytes(storageRef, file.buffer);
  return await getDownloadURL(storageRef);
}

module.exports = app;

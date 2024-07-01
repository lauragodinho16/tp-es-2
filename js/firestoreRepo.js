
const { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where } = require('firebase/firestore');
const { app } = require('./firebaseConfig.js');


const db = getFirestore(app);

async function adicionarDeputado(deputado) {
  try {
    const deputadoQuery = query(collection(db, "deputados"), where("numero", "==", deputado.numero));
    const deputadoSnapshot = await getDocs(deputadoQuery);
    if (!deputadoSnapshot.empty) {
      return { success: false, message: "Erro, já existe um deputado com esse número já cadastrado." };
    }

    const docRef = await addDoc(collection(db, "deputados"), {
      ...deputado,
      cargo: 'DEPUTADO'

    });
    const etapasAtualizadas = await getEtapasFromFirestore();
    return { success: true, message: ("Deputado adicionado com ID: "), etapas: etapasAtualizadas };
  } catch (error) {
    return { success: false, message: "Erro ao adicionar deputado " };
  }
}
async function adicionarPresidente(presidente) {
  try {
    const presidenteQuery = query(collection(db, "presidente"), where("numero", "==", presidente.numero));
    const presidenteSnapshot = await getDocs(presidenteQuery);
    if (!presidenteSnapshot.empty) {
      return { success: false, message: "Erro, já existe um presidente com esse número já cadastrado." };
    }

    const docRef = await addDoc(collection(db, "presidente"), {
      nome: presidente.nome,
      dataNascimento: presidente.dataNascimento,
      numero: presidente.numero,
      partido: presidente.partido,
      urlImagem: presidente.urlImagem,
      cargo: 'PRESIDENTE',
      vicePresidente: {
        nome: presidente.nomeVicePresidente,
        dataNascimento: presidente.dataNascimentoVicePresidente,
        numero: presidente.numero,
        partido: presidente.partidoVicePresidente,
        urlImagem: presidente.urlImagemVicePresidente,
        cargo: 'VICE-PRESIDENTE',
      }
    });
    const etapasAtualizadas = await getEtapasFromFirestore();

    return { success: true, message: ("Presidente adicionado com ID: "), etapas: etapasAtualizadas };
  } catch (error) {
    return { success: false, message: "Erro ao adicionar presidente " };
  }
}



async function getDeputado(id) {
  try {
    const docRef = doc(db, "deputados", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Documento não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao obter documento:", error);
    throw error;
  }
}

async function salvarVoto(votos, idVotacao) {

  try {
    const docRef = await addDoc(collection(db, "votos"), {
      ...votos,
      idVotacao
    });
    return { success: true, message: ("Voto salvo com sucesso: ", docRef.id) };
  } catch (error) {
    return { success: false, message: "Erro ao salvar voto. " };
  }
}

async function salvarRelatorio(administrador, idVotacao, tituloEleitor) {
  try {
    const docRef = await addDoc(collection(db, "relatorio"), {
      administrador,
      idVotacao,
      tituloEleitor
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

async function getEtapasFromFirestore() {
  try {
    const querySnapshotPresidente = await getDocs(collection(db, 'presidente'));
    const querySnapshotDeputado = await getDocs(collection(db, 'deputados'));
    const querySnapshotAdministrador = await getDocs(collection(db, 'administrador'));

    const presidenteEtapas = querySnapshotPresidente.docs.map(doc => doc.data());
    const deputadoEtapas = querySnapshotDeputado.docs.map(doc => doc.data());
    const administradorEtapas = querySnapshotAdministrador.docs.map(doc => doc.data());

    const object = [{
      titulo: 'ADMINISTRADOR',
      numeros: 6,
      administradores: administradorEtapas

    },
    {
      titulo: 'DEPUTADO',
      numeros: 4,
      candidatos: deputadoEtapas,
      cargo: 'Deputado'

    },
    {
      titulo: 'PRESIDENTE',
      numeros: 2,
      candidatos: presidenteEtapas,
      cargo: 'Presidente'

    }
    ]

    return { object };
  } catch (error) {
    console.error('Erro ao buscar etapas do Firestore:', error);
    throw error;
  }
}

async function retornarVotosSessao(idVotacao) {
  try {
    const querySnapshot = await getDocs(collection(db, 'votos'));
    const votos = [];
    querySnapshot.forEach((doc) => {
      const voto = doc.data();
      if (voto.idVotacao == idVotacao) {
        votos.push(voto);
      }
    });
    return votos;
  } catch (error) {
    console.error("Erro ao buscar os votos:", error);
    throw error;
  }
}

async function verificarVotoDuplicado(titulo, idVotacao) {
  const votosRef = collection(db, 'relatorio');
  const votosSnapshot = await getDocs(votosRef);

  const voto = votosSnapshot.docs.find(doc => doc.data().tituloEleitor == titulo && doc.data().idVotacao == idVotacao);
  console.log(voto)
  return voto !== undefined;
}




module.exports= { salvarVoto, adicionarDeputado, adicionarPresidente, getDeputado, getEtapasFromFirestore, salvarRelatorio, retornarVotosSessao, verificarVotoDuplicado };
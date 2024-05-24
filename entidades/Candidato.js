class Candidato {
  constructor(nome, partido, numero, urlImagem, dataNascimento) {
    this.nome = nome;
    this.partido = partido;
    this.numero = numero;
    this.urlImagem = urlImagem;
    this.dataNascimento = dataNascimento;
  }

  validar() {
    const validador = new ValidadorCandidato(this);
    return validador.validar();
  }
}

class ValidadorCandidato {
  constructor(candidato) {
    this.candidato = candidato;
  }

  validar() {
    const errors = [];
    errors.push(...this.validarNome());
    errors.push(...this.validarPartido());
    errors.push(...this.validarNumero());
    errors.push(...this.validarUrlImagem());
    errors.push(...this.validarDataNascimento());
    return errors;
  }

  validarNome() {
    const errors = [];
    const { nome } = this.candidato;

    if (!nome) {
      errors.push('O nome do candidato é obrigatório.');
    } else if (typeof nome !== 'string') {
      errors.push('O nome do candidato deve ser uma string.');
    } else if (nome.trim() === '') {
      errors.push('O nome do candidato não pode ser uma string vazia.');
    } else if (nome.length > 250) {
      errors.push('O nome do candidato deve ter no máximo 250 caracteres.');
    } else {
      const partesNome = nome.trim().split(' ');
      if (partesNome.length < 2) {
        errors.push('O nome do candidato deve conter pelo menos um sobrenome.');
      }
    }

    return errors;
  }

  validarPartido() {
    const errors = [];
    const { partido } = this.candidato;

    if (!partido) {
      errors.push('Partido não pode ser vazio');
    } else if (typeof partido !== 'string') {
      errors.push('Partido deve ser uma string');
    } else if (partido.trim() === '') {
      errors.push('O partido deve ser uma string não vazia e não pode conter apenas espaços em branco.');
    }

    return errors;
  }

  validarNumero() {
    const errors = [];
    const { numero } = this.candidato;

    if (!numero) {
      errors.push('O número do candidato é obrigatório.');
    } else if (typeof numero !== 'string') {
      errors.push('O número do candidato deve ser uma string.');
    } else if (numero.trim() === '') {
      errors.push('O número do candidato não pode ser uma string vazia.');
    } else if (isNaN(numero)) {
      errors.push('O número do candidato deve ser um valor numérico.');
    }

    return errors;
  }

  validarUrlImagem() {
    const errors = [];
    const { urlImagem } = this.candidato;

    if (!urlImagem) {
      errors.push('A URL da imagem do candidato é obrigatória.');
    } else if (typeof urlImagem !== 'string') {
      errors.push('A URL da imagem do candidato deve ser uma string.');
    } else if (urlImagem.trim() === '') {
      errors.push('A URL da imagem do candidato não pode ser uma string vazia.');
    }

    return errors;
  }

  validarDataNascimento() {
    const errors = [];
    const { dataNascimento } = this.candidato;
    const data = new Date(dataNascimento);

    if (isNaN(data.getTime())) {
      errors.push('Data de nascimento inválida');
    }

    return errors;
  }
}

export { Candidato };

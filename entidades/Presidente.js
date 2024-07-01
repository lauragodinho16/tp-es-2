const { Candidato } = require('./Candidato.js');

class Presidente extends Candidato {
  constructor(nome, partido, numero, urlImagem, dataNascimento) {
    super(nome, partido, numero, urlImagem, dataNascimento);

  }

  validar() {
    const errors = super.validar();

    if (this.numero.length !== 2) {
      errors.push('Número do presidente deve ter 2 dígitos');
    }

    const dataNascimento = new Date(this.dataNascimento);
    const hoje = new Date();

    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesDeDiferenca = hoje.getMonth() - dataNascimento.getMonth();
    const diaDeDiferenca = hoje.getDate() - dataNascimento.getDate();

    if (
      idade < 35 ||
      (idade === 35 && (mesDeDiferenca < 0 || (mesDeDiferenca === 0 && diaDeDiferenca < 0)))
    ) {
      errors.push('O candidato deve ter no mínimo 35 anos para se tornar presidente');
    }

    return errors;

  }

  adicionarVicePresidente(vicePresidente) {
    if (!(vicePresidente instanceof Candidato)) {
      throw new Error('Vice-presidente inválido');
    }
    this.nomeVicePresidente = vicePresidente.nome;
    this.dataNascimentoVicePresidente = vicePresidente.dataNascimento;
    this.numeroVicePresidente = vicePresidente.numero;
    this.partidoVicePresidente = vicePresidente.partido;
    this.urlImagemVicePresidente = vicePresidente.urlImagem;
  }
}

module.exports = { Presidente };


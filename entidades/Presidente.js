import { Candidato } from './Candidato.js';

class Presidente extends Candidato {
  constructor(nome, partido, numero, urlImagem, dataNascimento) {
      super(nome, partido, numero, urlImagem, dataNascimento);
      
  }

  validar() {
    const errors = super.validar();

    if (this.numero.length !== 2) {
      errors.push('Número do presidente deve ter 2 dígitos');
    }

    const idadeMinima = 35; // Idade mínima para se tornar presidente
    const hoje = new Date();
    const idade = hoje.getFullYear() - this.dataNascimento.getFullYear();
    if (idade < idadeMinima) {
      errors.push(`O candidato deve ter no mínimo ${idadeMinima} anos para se tornar presidente`);
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

export { Presidente };


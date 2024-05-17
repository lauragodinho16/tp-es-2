import { Candidato } from './Candidato.js';

class Deputado extends Candidato {
  constructor(nome, partido, numero, urlImagem, dataNascimento) {
    super(nome, partido, numero, urlImagem, dataNascimento);
  }
  validar() {
    const errors = super.validar();

    if (this.numero.length !== 4) {
      errors.push('Número do deputado deve ter 4 dígitos');
    }
    const idadeMinima = 21;
    const hoje = new Date();
    const idade = hoje.getFullYear() - this.dataNascimento.getFullYear();
    if (idade < idadeMinima) {
      errors.push(`O candidato deve ter no mínimo ${idadeMinima} anos para se tornar deputado`);
    }
    return errors;

  }

}
export { Deputado };

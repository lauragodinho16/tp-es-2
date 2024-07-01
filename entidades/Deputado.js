const { Candidato } = require('./Candidato.js');

class Deputado extends Candidato {
  constructor(nome, partido, numero, urlImagem, dataNascimento) {
    super(nome, partido, numero, urlImagem, dataNascimento);
    this.dataNascimento = new Date(dataNascimento); // Convertendo para Date
  }

  validar() {
    const errors = super.validar();
  
    if (this.numero.length !== 4) {
      errors.push('Número do deputado deve ter 4 dígitos');
    }
    const dataNascimento = new Date(this.dataNascimento);
    const hoje = new Date();
    
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesDeDiferenca = hoje.getMonth() - dataNascimento.getMonth();
    const diaDeDiferenca = hoje.getDate() - dataNascimento.getDate();
  
    if (
      idade < 21 ||
      (idade === 21 && (mesDeDiferenca < 0 || (mesDeDiferenca === 0 && diaDeDiferenca < 0)))
    ) {
      errors.push('O candidato deve ter no mínimo 21 anos para se tornar deputado');
    }
  
    return errors;
  }

}

module.exports =  { Deputado };

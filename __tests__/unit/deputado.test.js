import { Candidato } from '../../entidades/Candidato.js';
import { Deputado } from '../../entidades/Deputado.js';
import { faker } from '@faker-js/faker';

describe('Deputado', () => {
  const NOME_VALIDO = faker.person.fullName();
  const PARTIDO_VALIDO = faker.company.name();
  const NUMERO_VALIDO = faker.string.numeric(4);
  const URL_FOTO_VALIDA = faker.image.url();

  const hoje = new Date();
  const ano = hoje.getFullYear() - 21;
  const mes = hoje.getMonth(); 
  const dia = hoje.getDate(); 
  const dataNascimentoValida = new Date(ano, mes, dia);
  const DATA_NASCIMENTO_VALIDA = dataNascimentoValida.toISOString().split('T')[0]; 

  let deputado;

  const setupDeputado = (overrides = {}) => {
    return new Deputado(
      overrides.nome || NOME_VALIDO,
      overrides.partido || PARTIDO_VALIDO,
      overrides.numero || NUMERO_VALIDO,
      overrides.urlImagem || URL_FOTO_VALIDA,
      overrides.dataNascimento || DATA_NASCIMENTO_VALIDA
    );
  };

  const expectValidationError = (campo, valor, expectedErrors) => {
    deputado[campo] = valor;
    expect(deputado.validar()).toEqual(expect.arrayContaining(expectedErrors));
  };

  beforeEach(() => {
    deputado = setupDeputado();
  });

  describe('Instanciação', () => {
    it('deve criar um objeto Deputado com sucesso', () => {
      expect(deputado).toBeInstanceOf(Deputado);
      expect(deputado).toBeInstanceOf(Candidato);
    });
  });

  describe('Validação de Nome', () => {
    it.each([
      ['', ['O nome do candidato é obrigatório.']],
      [123, ['O nome do candidato deve ser uma string.']],
      ['   ', ['O nome do candidato não pode ser uma string vazia.']],
      ['A'.repeat(251), ['O nome do candidato deve ter no máximo 250 caracteres.']],
      ['João', ['O nome do candidato deve conter pelo menos um sobrenome.']]
    ])('deve retornar erro quando o nome é "%s"', (nome, expectedErrors) => {
      expectValidationError('nome', nome, expectedErrors);
    });
  });

  describe('Validação de Partido', () => {
    it.each([
      ['', ['Partido não pode ser vazio']],
      [123, ['Partido deve ser uma string']],
      ['   ', ['O partido deve ser uma string não vazia e não pode conter apenas espaços em branco.']]
    ])('deve retornar erro quando o partido é "%s"', (partido, expectedErrors) => {
      expectValidationError('partido', partido, expectedErrors);
    });
  });

  describe('Validação de Número', () => {
    it.each([
      ['', [
        'O número do candidato é obrigatório.',
        'Número do deputado deve ter 4 dígitos'
      ]],
      [123, [
        'O número do candidato deve ser uma string.',
        'Número do deputado deve ter 4 dígitos'
      ]],
      ['   ', [
        'O número do candidato não pode ser uma string vazia.',
        'Número do deputado deve ter 4 dígitos'
      ]],
      ['abc', [
        'O número do candidato deve ser um valor numérico.',
        'Número do deputado deve ter 4 dígitos'
      ]],
      ['123', ['Número do deputado deve ter 4 dígitos']]
    ])('deve retornar erro quando o número é "%s"', (numero, expectedErrors) => {
      expectValidationError('numero', numero, expectedErrors);
    });
  });

  describe('Validação de URL da Imagem', () => {
    it.each([
      ['', ['A URL da imagem do candidato é obrigatória.']],
      [123, ['A URL da imagem do candidato deve ser uma string.']],
      ['   ', ['A URL da imagem do candidato não pode ser uma string vazia.']]
    ])('deve retornar erro quando a URL da imagem é "%s"', (urlImagem, expectedErrors) => {
      expectValidationError('urlImagem', urlImagem, expectedErrors);
    });
  });

  describe('Validação de Data de Nascimento', () => {
    it.each([
      ['abc', ['Data de nascimento inválida']],
      ['2005-01-01', ['O candidato deve ter no mínimo 21 anos para se tornar deputado']],
      ['32-01-2000', ['Data de nascimento inválida']]
    ])('deve retornar erro quando a data de nascimento é "%s"', (dataNascimento, expectedErrors) => {
      expectValidationError('dataNascimento', dataNascimento, expectedErrors);
    });

    it('deve retornar erro quando o candidato tem exatamente 21 anos, mas o mês ainda não chegou', () => {
      const ano = hoje.getFullYear() - 21;
      const mes = hoje.getMonth() + 1; // Mês atual
      const dia = hoje.getDate();
      const dataNascimento = new Date(ano, mes, dia).toISOString().split('T')[0];
      expectValidationError('dataNascimento', dataNascimento, ['O candidato deve ter no mínimo 21 anos para se tornar deputado']);
    });

    it('não deve retornar erro quando o candidato tem exatamente 21 anos hoje', () => {
      expectValidationError('dataNascimento', DATA_NASCIMENTO_VALIDA, []);
    });
  });
});

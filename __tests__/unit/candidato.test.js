import { Candidato } from '../../entidades/Candidato.js';
import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker/locale/pt_BR';

describe('Candidato', () => {
  const NOME_VALIDO = faker.person.fullName();
  const PARTIDO_VALIDO = faker.string.alpha(2,4).toUpperCase();
  const NUMERO_VALIDO = faker.string.numeric(5);
  const URL_FOTO_VALIDA = faker.image.url();
  const DATA_NASCIMENTO_VALIDA = faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0];

  // console.log('Dados gerados pelo faker:');
  // console.log('Nome:', NOME_VALIDO);
  // console.log('Partido:', PARTIDO_VALIDO);
  // console.log('Número:', NUMERO_VALIDO);
  // console.log('URL da Foto:', URL_FOTO_VALIDA);
  // console.log('Data de Nascimento:', DATA_NASCIMENTO_VALIDA);

  let candidato;

  const setupCandidato = (overrides = {}) => {
    return new Candidato(
      overrides.nome || NOME_VALIDO,
      overrides.partido || PARTIDO_VALIDO,
      overrides.numero || NUMERO_VALIDO,
      overrides.urlImagem || URL_FOTO_VALIDA,
      overrides.dataNascimento || DATA_NASCIMENTO_VALIDA
    );
  };
                                                                                                                                                                                                                                                                             
  const expectValidationError = (campo, valor, expectedErrors) => {
    candidato[campo] = valor;
    expect(candidato.validar()).toEqual(expect.arrayContaining(expectedErrors));
  };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-19').getTime());
    candidato = setupCandidato();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Instanciação', () => {
    it('deve criar um objeto Candidato com sucesso', () => {
      expect(candidato).toBeInstanceOf(Candidato);
    });
  });

  describe('Validação de Nome', () => {
    it.each([
      ['', ['O nome do candidato é obrigatório.']],
      [123, ['O nome do candidato deve ser uma string.']],
      ['   ', ['O nome do candidato não pode ser uma string vazia.']],
      ['A'.repeat(251), ['O nome do candidato deve ter no máximo 250 caracteres.']],
      ['João', ['O nome do candidato deve conter pelo menos um sobrenome.']],
      [null, ['O nome do candidato é obrigatório.']]
    ])('deve retornar erro quando o nome é "%s"', (nome, expectedErrors) => {
      expectValidationError('nome', nome, expectedErrors);
    });

    it('não deve retornar erro quando o nome tem exatamente 250 caracteres', () => {
      expectValidationError('nome', 'A'.repeat(250), []);
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
      ['', ['O número do candidato é obrigatório.']],
      [123, ['O número do candidato deve ser uma string.']],
      ['   ', ['O número do candidato não pode ser uma string vazia.']],
      ['abc', ['O número do candidato deve ser um valor numérico.']],
      [' 12345 ', []]
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
      [null, ['Data de nascimento é obrigatória']]
    ])('deve retornar erro quando a data de nascimento é "%s"', (dataNascimento, expectedErrors) => {
      expectValidationError('dataNascimento', dataNascimento, expectedErrors);
    });

    it('não deve retornar erro quando a data de nascimento é uma string vazia', () => {
      expectValidationError('dataNascimento', '', []);
    });
  });

  describe('Casos Extremos', () => {
    it('deve retornar erro quando o nome é nulo', () => {
      expectValidationError('nome', null, ['O nome do candidato é obrigatório.']);
    });

    it('deve retornar erro quando a data de nascimento é nula', () => {
      expectValidationError('dataNascimento', null, ['Data de nascimento é obrigatória']);
    });

    it('não deve retornar erro quando a data de nascimento é uma string vazia', () => {
      expectValidationError('dataNascimento', '', []);
    });
  });
});

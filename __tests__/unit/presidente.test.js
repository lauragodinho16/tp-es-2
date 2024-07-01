import { Presidente } from '../../entidades/Presidente.js';
import { Candidato } from '../../entidades/Candidato.js';
import { jest } from '@jest/globals';

describe('Presidente', () => {
  const NOME_VALIDO = 'João da Silva';
  const PARTIDO_VALIDO = 'Partido A';
  const NUMERO_VALIDO = '12';
  const URL_FOTO_VALIDA = 'https://example.com/foto.jpg';
  const DATA_NASCIMENTO_VALIDA = '1980-01-01';

  let presidente;

  const setupPresidente = (overrides = {}) => {
    return new Presidente(
      overrides.nome || NOME_VALIDO,
      overrides.partido || PARTIDO_VALIDO,
      overrides.numero || NUMERO_VALIDO,
      overrides.urlImagem || URL_FOTO_VALIDA,
      overrides.dataNascimento || DATA_NASCIMENTO_VALIDA
    );
  };

  const expectValidationError = (campo, valor, expectedErrors) => {
    presidente[campo] = valor;
    expect(presidente.validar()).toEqual(expect.arrayContaining(expectedErrors));
  };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-19').getTime());
    presidente = setupPresidente();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Instanciação', () => {
    it('deve criar um objeto Presidente com sucesso', () => {
      expect(presidente).toBeInstanceOf(Presidente);
    });
  });

  describe('Validação de Número', () => {
    it.each([
      ['123', ['Número do presidente deve ter 2 dígitos']],
      ['1227', ['Número do presidente deve ter 2 dígitos']],
      ['12', []]
    ])('deve retornar erro quando o número é "%s"', (numero, expectedErrors) => {
      expectValidationError('numero', numero, expectedErrors);
    });
  });

  describe('Validação de Idade', () => {
    it.each([
      ['2010-01-01', ['O candidato deve ter no mínimo 35 anos para se tornar presidente']],
      ['1990-01-01', ['O candidato deve ter no mínimo 35 anos para se tornar presidente']],
      ['1989-05-18', []],
      ['1980-01-01', []]
    ])('deve retornar erro quando a data de nascimento é "%s"', (dataNascimento, expectedErrors) => {
      expectValidationError('dataNascimento', new Date(dataNascimento), expectedErrors);
    });
  });

  describe('Método adicionarVicePresidente', () => {
    it('deve adicionar um vice-presidente válido com sucesso', () => {
      const vicePresidente = new Candidato('Maria da Silva', 'Partido B', '5678', 'https://example.com/foto2.jpg', '1985-01-01');
      presidente.adicionarVicePresidente(vicePresidente);
      expect(presidente.nomeVicePresidente).toBe('Maria da Silva');
      expect(presidente.numeroVicePresidente).toBe('5678');
    });

    it('deve lançar erro ao adicionar um vice-presidente inválido', () => {
      expect(() => presidente.adicionarVicePresidente({})).toThrow('Vice-presidente inválido');
    });
  });
});

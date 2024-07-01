import { Relatorio } from '../../entidades/Relatorio.js';

describe('Relatorio', () => {
  const ADMIN_VALIDO = '123456';
  const ID_VOTACAO_VALIDO = '12345678901234';
  const TITULO_ELEITOR_VALIDO = '123456789012';

  let relatorio;

  const setupRelatorio = (overrides = {}) => {
    return new Relatorio(
      overrides.administrador || ADMIN_VALIDO,
      overrides.idVotacao || ID_VOTACAO_VALIDO,
      overrides.tituloEleitor || TITULO_ELEITOR_VALIDO
    );
  };

  const expectValidationError = (campo, valor, expectedErrors) => {
    relatorio[campo] = valor;
    expect(relatorio.validar()).toEqual(expect.arrayContaining(expectedErrors));
  };

  beforeEach(() => {
    relatorio = setupRelatorio();
  });

  describe('validar', () => {
    it('deve retornar erros quando o administrador é nulo ou vazio', () => {
      expectValidationError('administrador', null, ['Número do administrador não pode ser nulo ou vazio']);
    });

    it('deve retornar erros quando o administrador não é uma string', () => {
      expectValidationError('administrador', 123456, ['Número do administrador deve ser uma string']);
    });

    it('deve retornar erros quando o administrador é uma string vazia ou não representa um número', () => {
      expectValidationError('administrador', ' ', ['Número do administrador inválido, deve representar um número']);
    });

    it('deve retornar erros quando o administrador não tem 6 dígitos', () => {
      expectValidationError('administrador', '12345', ['Número do administrador inválido, deve ter 6 dígitos']);
    });

    it('deve retornar erros quando o idVotacao não é um número de 12 dígitos', () => {
      expectValidationError('idVotacao', '1234567890123', ['ID da votação inválido. O formato deve ser um número de 12 dígitos.']);
    });
  });

  describe('validateTituloEleitor', () => {
    it('deve retornar erros quando o título de eleitor não tem 12 dígitos', () => {
      expectValidationError('tituloEleitor', '1234567890199', ['Número de título de eleitor inválido: o formato deve ser composto por 12 dígitos numéricos.']);
    });

    it('deve retornar erros quando o código do estado do título de eleitor é inválido', () => {
      expectValidationError('tituloEleitor', '123456789029', ['Número de título de eleitor inválido: código do estado inválido']);
    });

    it('deve retornar erros quando o primeiro dígito verificador do título de eleitor está incorreto', () => {
      expectValidationError('tituloEleitor', '123456780112', ['Número de título de eleitor inválido: o primeiro dígito verificador está incorreto.']);
    });
  });
});

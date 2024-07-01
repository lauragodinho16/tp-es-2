import { Voto } from '../../entidades/Voto.js';

describe('Voto', () => {
    const NUMERO_PRESIDENTE_VALIDO = '1234';
    const NUMERO_DEPUTADO_VALIDO = '5678';

    let voto;

    const setupVoto = (overrides = {}) => {
        return new Voto(
            overrides.numeroPresidente || NUMERO_PRESIDENTE_VALIDO,
            overrides.numeroDeputado || NUMERO_DEPUTADO_VALIDO
        );
    };

    const expectValidationError = (campo, valor, expectedErrors) => {
        voto[campo] = valor;
        expect(voto.validar(voto.numeroPresidente, voto.numeroDeputado)).toEqual(expect.arrayContaining(expectedErrors));
    };

    beforeEach(() => {
        voto = setupVoto();
    });

    describe('Instanciação', () => {
        it('deve criar um objeto Voto com sucesso', () => {
            expect(voto).toBeInstanceOf(Voto);
        });
    });

    describe('Validação de Número do Presidente', () => {
        it.each([
            [null, ['Número do presidente não pode ser null']],
            [1234, ['Número do presidente deve ser uma string']],
            ['', ['Número do presidente não pode ser vazio']],
            [undefined, []],
            ['1234', []]
        ])('deve retornar erro quando o número do presidente é "%s"', (numeroPresidente, expectedErrors) => {
            expectValidationError('numeroPresidente', numeroPresidente, expectedErrors);
        });
    });

    describe('Validação de Número do Deputado', () => {
        it.each([
            [null, ['Número do deputado não pode ser null']],
            [5678, ['Número do deputado deve ser uma string']],
            ['', ['Número do deputado não pode ser vazio']],
            [undefined, []],
            ['5678', []]
        ])('deve retornar erro quando o número do deputado é "%s"', (numeroDeputado, expectedErrors) => {
            expectValidationError('numeroDeputado', numeroDeputado, expectedErrors);
        });
    });
});
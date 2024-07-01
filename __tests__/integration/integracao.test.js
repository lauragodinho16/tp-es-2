const request = require('supertest');
const app = require('../../index.js');
const { verificarVotoDuplicado, salvarVoto, salvarRelatorio } = require('../../js/firestoreRepo.js');

jest.mock('../../js/firestoreRepo.js', () => ({
    getEtapasFromFirestore: jest.fn().mockResolvedValue(['etapa1', 'etapa2']),
    verificarVotoDuplicado: jest.fn().mockResolvedValue(true),
    salvarVoto: jest.fn().mockResolvedValue({ success: true }),
    salvarRelatorio: jest.fn().mockResolvedValue({ success: true }),
}));

beforeEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks entre os testes
});

describe('GET /etapas', () => {
    it('deve retornar as etapas', async () => {
        const response = await request(app).get('/etapas');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(['etapa1', 'etapa2']);
    });
});

describe('POST /salvar-votos', () => {
    it('deve retornar erro ao salvar votos com dados inválidos', async () => {
        salvarVoto.mockResolvedValueOnce({ success: false, message: 'Erro ao salvar voto.' });

        const votos = [
            { administrador: 'admin123' },
            { idVotacao: 'votacao123' },
            { tituloEleitor: 'eleitor123' },
            { etapa: 'PRESIDENTE', voto: '1234' },
            { etapa: 'DEPUTADO', voto: '5678' }
        ];

        const response = await request(app)
            .post('/salvar-votos')
            .send({ votos });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Erro ao salvar voto.');
    });

    it('deve salvar votos com sucesso', async () => {
        const votos = [
            { administrador: '123456' },
            { idVotacao: '123456789109' },
            { tituloEleitor: '660768300159' },
            { etapa: 'PRESIDENTE', voto: '12' },
            { etapa: 'DEPUTADO', voto: '5678' }
        ];

        const response = await request(app)
            .post('/salvar-votos')
            .send({ votos });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Votos salvos com sucesso' });

        expect(salvarVoto).toHaveBeenCalledWith(expect.any(Object), '123456789109');
        expect(salvarRelatorio).toHaveBeenCalledWith('123456', '123456789109', '660768300159');
    });
});

describe('POST /eleitor-voto-duplicado', () => {
    it('deve verificar se o eleitor já votou', async () => {
        const tituloEleitor = '123456789'; // Exemplo de título de eleitor
        const idVotacao = 'abcd1234'; // Exemplo de ID de votação

        const response = await request(app)
            .post('/eleitor-voto-duplicado')
            .send({ titulo: tituloEleitor, idVotacao });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('jaVotou', true);
        expect(verificarVotoDuplicado).toHaveBeenCalledWith(tituloEleitor, idVotacao);
    });
});

describe('GET /obter-resultado', () => {
    it('deve retornar status 500 ao buscar os votos da sessão de votação com erro', async () => {
        const idSessao = 'sessao-inexistente'; // Simula um ID de sessão inválido

        const response = await request(app)
            .get('/obter-resultado')
            .query({ idSessao });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erro ao buscar os votos da sessão de votação' });
    });
});

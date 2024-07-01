class Voto {
    constructor(numeroPresidente, numeroDeputado) {
     
        this.numeroPresidente = numeroPresidente;
        this.numeroDeputado = numeroDeputado;
        this.dataHora = new Date();
    }

    validar(numeroPresidente, numeroDeputado) {
        let erros = [];

        if (numeroPresidente === null) {
            erros.push('Número do presidente não pode ser null')
        }
        if (typeof numeroPresidente !== 'string' && (numeroPresidente !== null && numeroPresidente !== undefined)) {
            erros.push('Número do presidente deve ser uma string')
        }
        if (typeof numeroPresidente === 'string' && numeroPresidente.trim() === '') {
            erros.push('Número do presidente não pode ser vazio')
        }
        if (numeroDeputado === null) {
            erros.push('Número do deputado não pode ser null')
        }
        if (typeof numeroDeputado !== 'string' && (numeroDeputado !== null && numeroDeputado !== undefined)) {
            erros.push('Número do deputado deve ser uma string')
        }
        if (typeof numeroDeputado === 'string' && numeroDeputado.trim() === '') {
            erros.push('Número do deputado não pode ser vazio')
        }

        return erros;
    }
}

module.exports =  { Voto };

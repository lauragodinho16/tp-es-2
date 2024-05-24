class Relatorio {
    constructor(administrador, idVotacao, tituloEleitor) {
        this.administrador = administrador;
        this.idVotacao = idVotacao;
        this.tituloEleitor = tituloEleitor;
    }

    validar() {
        const erros = [];
        if (!this.administrador) {
            erros.push('Número do administrador não pode ser nulo o vazio');
        }
        if (typeof this.administrador !== 'string') {
            erros.push('Número do administrador deve ser uma string')
        }
        if (this.administrador.trim() === '' || isNaN(Number(this.administrador))) {
            erros.push('Número do administrador inválido, deve representar um número');
        }
        if (this.administrador.length !== 6) {
            erros.push('Número do administrador inválido, deve ter 6 dígitos');
        }
        const idRegex = /^\d{14}$/;
        if (!idRegex.test(this.idVotacao)) {
            erros.push('ID da votação inválido. O formato deve ser um número de 14 dígitos.');
        }
        erros.push(this.validateTituloEleitor(this.tituloEleitor));


    }
    validateTituloEleitor(te) {
        const errosTituloEleitor = [];
    
        // Remove todos os caracteres não numéricos e preenche com zeros à esquerda
        te = te.replace(/\D/g, '').padStart(12, '0');
    
        // Verifica se o título de eleitor tem o formato correto
        if (te.length !== 12) {
            errosTituloEleitor.push("Número de título de eleitor inválido: o formato deve ser composto por 12 dígitos numéricos.");
        }
    
        const uf = parseInt(te.substr(8, 2), 10);
    
        // Verifica se o código do estado (UF) é válido
        if (uf < 1 || uf > 28) {
            errosTituloEleitor.push("Número de título de eleitor inválido: código do estado inválido");
        }
    
        const calcularDigitoVerificador = (inicio, fim, multiplicadores) => {
            let soma = 0;
            for (let i = inicio; i < fim; i++) {
                soma += parseInt(te[i], 10) * multiplicadores[i - inicio];
            }
            let d = soma % 11;
            if (d < 2) {
                d = uf < 3 ? 1 - d : 0;
            } else {
                d = 11 - d;
            }
            return d;
        };
    
        const primeiroDV = calcularDigitoVerificador(0, 8, [9, 8, 7, 6, 5, 4, 3, 2]);
        if (parseInt(te[10], 10) !== primeiroDV) {
            errosTituloEleitor.push("Número de título de eleitor inválido: o primeiro dígito verificador está incorreto.");
        }
    
        const segundoDV = calcularDigitoVerificador(8, 10, [1, 2]);
        if (parseInt(te[11], 10) !== segundoDV) {
            errosTituloEleitor.push("Número de título de eleitor inválido: o segundo dígito verificador está incorreto.");
        }
    
        return errosTituloEleitor;
    }    
}
export { Relatorio };


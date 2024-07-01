class Relatorio {
    constructor(administrador, idVotacao, tituloEleitor) {
        this.administrador = administrador;
        this.idVotacao = idVotacao;
        this.tituloEleitor = tituloEleitor;
    }


    validar() {
        const erros = [];
        if (!this.administrador) {
            erros.push('Número do administrador não pode ser nulo ou vazio');
        } else if (typeof this.administrador !== 'string') {
            erros.push('Número do administrador deve ser uma string');
        } else if (this.administrador.trim() === '' || isNaN(Number(this.administrador))) {
            erros.push('Número do administrador inválido, deve representar um número');
        } else if (this.administrador.length !== 6) {
            erros.push('Número do administrador inválido, deve ter 6 dígitos');
        }
    
        const idRegex = /^\d{12}$/;
        if (!idRegex.test(this.idVotacao)) {
            erros.push('ID da votação inválido. O formato deve ser um número de 12 dígitos.');
        }
    
        const tituloEleitorErrors = this.validateTituloEleitor(this.tituloEleitor);
        if (tituloEleitorErrors.length > 0) {
            erros.push(...tituloEleitorErrors);
        }
    
        return erros;
    }

    validateTituloEleitor(te) {
        const errosTituloEleitor = [];

        // Remove todos os caracteres não numéricos e preenche com zeros à esquerda
        te = te.replace(/\D/g, '').padStart(12, '0');

        // Verifica se o título de eleitor tem o formato correto
        if (te.length !== 12) {
            errosTituloEleitor.push("Número de título de eleitor inválido: o formato deve ser composto por 12 dígitos numéricos.");
        }

        // Obtém o código do estado (UF) do título de eleitor
        const uf = parseInt(te.substr(8, 2));

        // Verifica se o código do estado (UF) é válido
        if (uf < 1 || uf > 28) {
            errosTituloEleitor.push("Número de título de eleitor inválido: código do estado inválido");
        }

        let d = 0;
        // Calcula o primeiro dígito verificador
        for (let i = 0; i < 8; i++) {
            d += parseInt(te[i]) * (9 - i);
        }
        d %= 11;
        if (d < 2) {
            if (uf < 3) {
                d = 1 - d;
            } else {
                d = 0;
            }
        } else {
            d = 11 - d;
        }
        // Verifica o primeiro dígito verificador
        if (parseInt(te[10]) !== d) {
            errosTituloEleitor.push("Número de título de eleitor inválido: o primeiro dígito verificador está incorreto.");
        }

        let d2 = d * 2;
        // Calcula o segundo dígito verificador
        for (let i = 8; i < 10; i++) {
            d2 += parseInt(te[i]) * (12 - i);
        }
        d2 %= 11;
        if (d2 < 2) {
            if (uf < 3) {
                d2 = 1 - d2;
            } else {
                d2 = 0;
            }
        } else {
            d2 = 11 - d2;
        }
        // Verifica o segundo dígito verificador
        if (parseInt(te[11]) !== d2) {
            errosTituloEleitor.push("Número de título de eleitor inválido: o segundo dígito verificador está incorreto.");
        }

       


        return errosTituloEleitor;
    }
}
module.exports = { Relatorio };


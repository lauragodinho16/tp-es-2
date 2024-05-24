Trabalho Prático I - Engenharia de software II
---
## Grupo
- Arthur Henrique Secundino Ferreira
- Laura Godinho Barbosa
- Mariane Mara de Souza
- Selene Melo Andrade

## Explicação do sistema
1. **Descrição:**
2. **Instalação das Dependências:**
   
   Antes de iniciar, certifique-se de ter o Node.js e npm instalados em seu sistema. No diretório raiz do projeto, execute o seguinte comando para instalar as dependências:

   $ npm install

2. **Execução do Servidor:**

   Após a instalação das dependências e configuração das variáveis de ambiente, execute o seguinte comando para iniciar o servidor local:
   
  $ npm run dev

   O servidor estará acessível em `http://localhost:3000`.

3. **Acesso à Aplicação:**

   Abra seu navegador e visite `http://localhost:3000`.

5. **Explicação das tecnologias utilizadas:**
   Para o desenvolvimento desse sistema optou-se por utilizar as seguintes tecnologias:

    Linguagem de Programação: 
    Bibliotecas: 
    Ferramenta de análise: Lizard
   
## Relatório Lizard
   A ferramenta realiza a análise de complexidade ciclomática do programa através de métricas para a quantidade de linhas não comentadas (NLOC), quantidade de caminhos de execução independentes do código fonte (CCN), quantidade de tokens e parâmetros utilizados e comprimento das funções.

Após rodar a ferramenta Lizard para todos os arquivos do sistema, obtivemos o seguinte relatório de complexidade:

FUNÇÕES COM MAIS BRANCHES (CCN)
================================================
  NLOC    CCN   token  PARAM  length  location  
------------------------------------------------
    45     17    347      0      51 validar@12-62@.\Candidato.js
    22     13    140      2      24 validar@9-32@.\Voto.js
    46     12    286      1      62 validateTituloEleitor@31-92@.\Relatorio.js 
    45     12    304      1      59 validateTituloEleitor@467-525@.\script.js


FUNÇÕES COM MAIS PRÂMETROS (PARAM)
================================================
  NLOC    CCN   token  PARAM  length  location  
------------------------------------------------
   34     1    320      8      57 gerarRelatorio@388-444@.\script.js
    3      1     26      5       3 constructor@4-6@.\Deputado.js
    3      1     26      5       4 constructor@4-7@.\Presidente.js
 

FUNÇÕES COM MAIS LINHAS DE CÓDIGO (length)
================================================
  NLOC    CCN   token  PARAM  length  location  
------------------------------------------------
    46     12    286      1      62 validateTituloEleitor@31-92@.\Relatorio.js
    34      1    320      8      57 gerarRelatorio@388-444@.\script.js
    43      6    260      0      55 atualizaInterface@69-123@.\script.js
    45     17    347      0      51 validar@12-62@.\Candidato.js

 ## Refatoração

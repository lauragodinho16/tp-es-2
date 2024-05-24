Trabalho Prático I - Engenharia de software II
---
## Grupo
- Arthur Henrique Secundino Ferreira
- Laura Godinho Barbosa
- Mariane Mara de Souza
- Selene Melo Andrade

## Explicação do sistema
1. **Descrição da aplicação:**
   
   O sistema implementa uma urna eletrônica semelhante à utilizada nas eleições brasileiras. Existem dois tipos de usuários: Administrador e Eleitor. Ao iniciar a aplicação, o administrador deve inserir sua senha corretamente. Após isso, ele pode escolher entre cadastrar presidente, cadastrar deputado ou iniciar a votação.

   Para os cadastros, o sistema direciona para uma tela onde o administrador preenche nome, data de nascimento, partido e número do candidato. Se a opção for iniciar a votação, o administrador deve inserir um título de eleitor válido.

   Com o título de eleitor validado, o eleitor vota primeiro para deputado e depois para presidente. Em ambos os casos, a interface gráfica indica quantos dígitos tem o número do candidato da categoria. Se o eleitor digitar um número válido, a interface apresenta nome, partido e foto do candidato; no caso do presidente, também aparece a foto do vice. O eleitor pode confirmar ou corrigir o voto após verificar os dados. Se digitar um número inválido, surge a mensagem de "voto em branco", e o eleitor pode confirmar o voto em branco ou corrigi-lo. Outra opção é selecionar a tecla "branco" e, em seguida, confirmar ou corrigir o voto. Após finalizar a votação, a mensagem "FIM" é exibida, e a tela volta para a inserção do título de eleitor. Há uma verificação para garantir que o eleitor ainda não tenha votado, permitindo o acesso apenas se não tiver votado.

   Após a votação de todos os eleitores, o administrador deve selecionar a opção "Finalizar votação e obter relatório". O relatório exibe o código verificador, o número do presidente e do deputado eleitos, a quantidade de votos para cada candidato a presidente e para cada deputado que recebeu pelo menos um voto. Se não houver votos válidos para uma categoria ou se houver empate, o relatório indicará a situação. Além disso, o relatório mostra a quantidade de votos brancos, nulos, o total de eleitores e a data de emissão.

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
   
## JavaScript: 
   Linguagem de programação versátil utilizada tanto no frontend quanto no backend para criar interfaces interativas dinâmicas. No frontend, ela manipula o DOM e melhora a experiência do usuário, enquanto no backend, com Node.js, permite desenvolver servidores eficientes e escaláveis.

## Node.js: 
   Ambiente de execução  JavaScript que permite o desenvolvimento de aplicações de backend escaláveis e de alto desempenho. Utilizando um modelo de I/O não bloqueante, Node.js é ideal para construir servidores web eficientes e aplicações em tempo real.

## Lizard
   A ferramenta realiza a análise de complexidade ciclomática do programa através de métricas para a quantidade de linhas não comentadas (NLOC), quantidade de caminhos de execução independentes do código fonte (CCN), quantidade de tokens e parâmetros utilizados e comprimento das funções.
   
   Após rodar a ferramenta Lizard para todos os arquivos do sistema e filtrar os resultados com base nas colunas "CCN", "PARAM" e "length" obtivemos o seguinte relatório de complexidade:
   
   <img width="593" alt="Captura de Tela 2024-05-23 às 21 29 10" src="https://github.com/lauragodinho16/tp-es-2/assets/47701665/28e60763-e60b-48cc-a043-5e7e770864e4">

   Tais resultados foram utilizados para escolher as funções para refatoração, conforme detalhado via mensagem de commits.

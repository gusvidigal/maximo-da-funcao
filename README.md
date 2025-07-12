# Máximo da Função
OBS.: README EM CONSTRUÇÃO

## Descrição do Projeto
O "Máximo da Função" é a implementação de um algoritmo evolutivo com o objetivo de encontrar o ponto máximo de uma função. A função (em código `JavaScript`) e os parâmetros utilizados no algoritmo são visíveis e editáveis pelo usuário por meio de uma interface construída em HTML.

## Instalação e Acesso
Para acessar a interface e fazer seus próprios testes, utilize o link abaixo (página do projeto no GitHub Pages):
- ![gusvidigal.github.io/maximo-da-funcao](https://gusvidigal.github.io/maximo-da-funcao/)

Também é possível acessá-la localmente com o passo-a-passo:
1. Na página principal do repositório (![github.com/gusvidigal/maximo-da-funcao](https://github.com/gusvidigal/maximo-da-funcao)), clique no botão verde "Code" e, em seguida, clique em "Download ZIP".
2. Extraia o arquivo baixado utilizando, por exemplo, o WinRaR.
3. Abra o arquivo `index.html`, presente na pasta extraída no passo anterior, com um navegador de sua preferência (suporte garantido para Google Chrome, Safari, Firefox, Edge e Opera).

## Funcionamento Geral
### Algoritmos Evolutivos
Algoritmos evolutivos são técnicas de resolução de problemas baseadas nos princípios evolutivos da Biologia. Sua arquitetura genérica é da seguinte forma:
1. Dado um problema que precisa ser resolvido, escolhemos um conjunto finito de possíveis soluções (chamado de `População Inicial`)
2. Todas as soluções são avaliadas e determinamos qual delas foi a melhor, ou seja, qual foi a mais eficiente (essa solução é chamada de `Melhor Indivíduo`)
    * Caso essa solução melhor nos satisfaça e nos seja suficiente, podemos parar o programa.
3. Após isso, aproximamos as outras soluções desta solução melhor (processo chamado de `Cruzamento`), com a seguinte ideia: Se determinada solução é a melhor, então soluções parecidas com ela tendem a serem boas também. A forma com que fazemos isso é chamada de `Seleção`.
4. Pode ser que exista uma solução melhor ainda, mas que, de alguma forma, seja bastante diferente da que já temos. Para contornar isso, variamos um pouco as demais soluções (essa variação é chamada de `Mutação`).
5. Depois desses passos, obtemos um novo conjunto de soluções, ligeiramente melhor que o anterior. Portanto, repetimos a partir do passo 2.

### Implementação com Funções Matemáticas de uma variável X
Seguindo o passo-a-passo acima, podemos encontrar o ponto máximo de uma função com uma variável (x -> f(x)):
1. Escolhemos, aleatoriamente, um determinado número de valores para x (`População Inicial`)
2. Dentre esses valores, determinamos qual deles possui o maior f(x). (esse x é chamado de `Melhor Indivíduo`)
3. Após isso, realizamos a média entre todos os outros indivíduos com esse melhor (`Cruzamento`) e substituímos esses resultados pelos indivíduos antigos. Assim, a nova população será composta pelo melhor x e os resultados dos cruzamentos deste x com os outros valores.
4. Variamos o valor de todos os indivíduos (menos o melhor) em um determinado valor, como +0.1 ou -0.1 (`Mutação`).
5. Repetimos a partir do passo 2.

### Implementação com Funções Matemáticas de mais de uma variável.
Para uma função com mais de uma variável, as etapas são ligeiramente diferentes. O indivíduo agora é um vetor de genes, sendo cada gene uma variável. Assim, durante o cruzamento e a mutação, temos a tarefa de determinar quais genes devem ser cruzados/mutados e quais não devem. Geralmente, optamos por todos os genes.

## Funcionalidades
O código é modularizado e, por isso, é bastante customizável pelo programador. Dessa forma, podemos acrescentar ao algoritmo base vários fenômenos e métodos diferentes:
- CATÁSTROFE: É possível executar um "genocídio" ao substituir um determinado número de indivíduos por novos, gerados aleatoriamente. A geração que passar por catástrofes não sofrerá cruzamentos nem mutações. O programa dispõe de 4 formas de catástrofe:
    * A) Catástrofe do Mais Apto: Os n piores indivíduos serão substituídos.
    * B) Catástrofe da Praga: Os n melhores indivíduos (menos o melhor) serão substituídos.
    * C) Catástrofe Disruptiva: Os n indivíduos medianos serão substituídos.
    * D) Catástrofe Estabilizadora: Os indivíduos extremais (isto é: os piores e os melhores - menos o melhor) serão substituídos.
- MUTAÇÃO: Existem também 4 formas de mutação disponíveis no programa:
    * A) Mutação Padrão: A mutação base é fixa. Isto é, o gene a ser mutado será incrementado/decrementado em um valor fixo.
    * B) Mutação Acumulativa: Se após um determinado número de gerações o melhor indivíduo se mantiver, então considera-se que a população estagnou. A cada estagnação, a mutação base aumenta proporcionalmente.
    * C) Mutação Acumulativa com Teto: Similar à acumulativa, porém se a mutação total ultrapassar um teto de mutação, a estagnação e a mutação são resetados.
    * D) Caótica: A mutação é um número escolhido aleatoriamente em um intervalo definido pelo usuário.
- MUTAÇÃO POLIGÊNICA: Adicionalmente, é possível determinar, por meio de probabilidades fornecidas pelo usuário, quantos e quais genes serão mutados. O programa escolhe, a princípio, quantos genes ao todo serão mutados. Depois, baseando-se nas probabilidades de mutação de cada gene, escolhe quais serão.
- FUNÇÃO: A função fornecida do usuário é em `JavaScript`. Isso significa que ele pode se apoderar de condicionais e laços de repetição e não se ater apenas às funções matemáticas convencionais.

## Algoritmo do Programa em Pseudocódigo
Para uma função de `X` variáveis:
1. GERAÇÃO DA POPULAÇÃO INICIAL: Geramos `N` vetores `v` de `X` genes, onde `N` é a quantidade de indivíduos da população. O intervalo de geração de cada gene (se, por exemplo, vai ser escolhido um número de -5 a 5 ou de 0 a 100) é definido pelo usuário.
2. EXECUÇÃO DAS GERAÇÕES EM LOOP: As seguintes etapas são executadas infinitamente, até o usuário pausar ou reiniciar o programa.
    * a. DETERMINAÇÃO DO MELHOR INDIVÍDUO: Iteramos a população em busca do melhor `f(v)`.
    * b. ESTAGNAÇÃO:
        * i. SE o melhor se manteve E a mutação escolhida envolve estagnação ENTÃO o contador da estagnação é incrementado.
        * ii. MAS SE foi encontrado um novo melhor E a mutação escolhida envolve estagnação ENTÃO a estagnação é resetada.
    * c. DETERMINAÇÃO DA CATÁSTROFE: Determinamos se vai haver catástrofe nessa geração ou não, com base na probabilidade. A catástrofe matará `m` indivíduos. Na geração que ocorrer catástrofe, os indivíduos não serão cruzados, nem mutados. O melhor indivíduo não será substituído em hipótese alguma. Se houver catástrofe:
        * i. SE for catástrofe do Mais Apto ENTÃO a partir do segundo melhor, substituiremos `m` indivíduos por novos gerados aleatoriamente, de forma similar à geração do passo 1.
        * ii. SE for catástrofe de Praga ENTÃO substituiremos os `m` piores indivíduos, de forma similar à geração do passo 1.
        * iii. SE for catástrofe Disruptiva ENTÃO substituiremos os `m` indivíduos medianos, de forma similar à geração do passo 1. Caso não seja possível centralizar exatamente o intervalo de substituição, centraliza-se tendendo para os piores indivíduos, ou seja, para o lado esquerdo, caso eles estejam ordenados em ordem crescente.
        * iv. SE for catástrofe Estabilizadora ENTÃO substituiremos os `mi` melhores indivíduos, contados a partir do segundo melhor, e os `mj` piores indivíduos, onde `mi = Math.floor(m/2)` e `mj = Math.ceil(m/2)` e a substituição é feita de forma similar à geração do passo 1.
   * d. SE a estagnação foi atingida (o contador da estagnação atingiu o valor fornecido pelo usuário) ENTÃO o coeficiente de mutação é resetado e a estagnação é incrementada.
   * e. SELEÇÃO: Nesta etapa, os indivíduos serão substituídos:
       * i. SE for seleção por elitismo ENTÃO todos os indivíduos (exceto o melhor) serão cruzados com o melhor por meio da média entre os genes. Esses resultados substituirão os indivíduos anteriores.
       * ii. SE for seleção por torneio ENTÃO sorteiam-se 2 pares de indivíduos. Escolhe-se o melhor em cada par e cruzamos esses 2 melhores de forma a preencher toda a população (exceto o melhor).
       * iii. SE for seleção por roleta ENTÃO é feita uma lista de probabilidades, onde os melhores indivíduos terão mais chance de serem escolhidos. A lista é ajustada de forma a representar todos os valores `f(v)` em valores positivos não-nulos. Assim, caso o menor valor `f(v) = A` seja negativo ou nulo, aumentamos todos os valores `f(v)` em `-A+1`. Após isso, escolhemos 2 indivíduos dessa lista (considerando as probabilidades) e cruzamos de forma a preencher toda a população (exceto o melhor).
   * f. MUTAÇÃO: Nesta etapa, todos os indivíduos (exceto o melhor) serão mutados. O programa escolhe, a princípio, quantos genes ao todo serão mutados. Depois, baseando-se nas probabilidades de mutação de cada gene, escolhe quais serão. O incremento/decremento é determinado pela probabilidade de mutação positiva (determina o `sinal`).
      * i. SE for Mutação Padrão ENTÃO para todos os genes selecionados: `gene = sinal * mutação base`.
      * ii. SE for Mutação Acumulativa ENTÃO para todos os genes selecionados: `gene = sinal * (mutação base + estagnação * incremento da mutação)`.
      * iii. SE for Mutação Acumulativa Limitada ENTÃO para todos os genes selecionados: `gene = sinal * (mutação base + estagnação * incremento da mutação OU teto)`, a depender se o valor é maior que o teto máximo ou menor que o teto mínimo.
      * iv. SE for Mutação Caótica ENTÃO para todos os genes selecionados, o gene é um número aleatório de um intervalo definido pelo usuário.

# Máximo da Função

## Descrição do Projeto
O "Máximo da Função" é a implementação de um algoritmo evolutivo com o objetivo de encontrar o ponto máximo de uma função. A função (em código `JavaScript`) e os parâmetros utilizados no algoritmo são visíveis e editáveis pelo usuário por meio de uma interface construída em HTML.

## Instalação e Acesso
Para acessar a interface e fazer seus próprios testes, utilize o link abaixo (**preferencialmente por um computador**):
- https://gusvidigal.github.io/maximo-da-funcao/

Também é possível acessá-la localmente com o passo-a-passo:
1. Na página principal do repositório (![github.com/gusvidigal/maximo-da-funcao](https://github.com/gusvidigal/maximo-da-funcao)), clique no botão verde "Code" e, em seguida, clique em "Download ZIP".
2. Extraia o arquivo baixado utilizando, por exemplo, o WinRaR.
3. Abra o arquivo `index.html`, presente na pasta extraída no passo anterior, com um navegador de sua preferência (suporte garantido para Google Chrome, Safari, Firefox, Edge e Opera).

## Tutorial de Uso
**Acesse preferencialmente pelo computador**.

Insira os parâmetros desejados nos campos da interface. Todos os números com casas decimais **DEVEM** usar o símbolo `.` como separador (e não `,`). Alguns campos podem ser deixados em branco, mas essas e outras especificações, como exemplos e mais detalhes, podem ser encontradas ao passar o mouse por cima dos nomes dos parâmetros (em sublinhado).
Caso algum valor esteja mal-formatado ou não possua sentido (como probabilidades negativas ou população igual a 0), o site enviará um `prompt` na tela alertando-o sobre isso.

**OBSERVAÇÃO:** Mesmo que seu navegador bloqueie esses prompts/alertas, **o programa não será executado até que os devidos campos sejam alterados**.

## Implementação dos Algoritmos Evolutivos
### Introdução
**Algoritmos evolutivos são técnicas de resolução de problemas baseadas nos princípios evolutivos da Biologia**. Sua arquitetura genérica é da seguinte forma:
1. Dado um problema que precisa ser resolvido, escolhemos um conjunto finito de possíveis soluções (chamado de `População Inicial`)
2. Repetição dos seguintes passos:
    * A) Todas as soluções são *avaliadas* e determinamos qual delas foi a melhor, ou seja, qual foi a *mais eficiente* (essa solução é chamada de `Melhor Indivíduo`).
        * Caso essa solução nos satisfaça, podemos parar o programa.
    * B) Após isso, executamos o processo de `Seleção`: selecionamos algumas dessas soluções (idealmente as melhores) para "originarem" novas soluções. Isso é feito *combinando e misturando* as soluções (`Cruzamento`), uma vez que, se uma solução é boa, soluções parecidas com ela também devem ser.
    * C) Para as soluções não ficarem muito parecidas umas com as outras (e também para testar novas abordagens), mudamos um pouco cada solução (essa mudança é chamada de `Mutação`).
    * D) Depois desses passos, obtemos um novo conjunto de soluções, possivelmente melhor que o anterior. Assim, voltamos para o passo A.

### Implementação no Código com Funções Matemáticas de uma variável X
Seguindo o passo-a-passo acima, podemos encontrar o ponto máximo de uma função com uma variável (`x -> f(x)`):
1. Escolhemos, aleatoriamente, um determinado número de valores para `x` (`x0, x1, x2, ..., xn`, ou seja, a nossa `População Inicial`).
2. Repetição dos seguintes passos:
    * A) Dentre esses valores, determinamos qual deles possui o maior `f(x)`. (vamos chamar esse `x` de `M`. `M` é chamado de `Melhor Indivíduo`).
    * B) Após isso, realizamos a média entre `M` e *todos os outros indivíduos* (`Cruzamento`), obtendo novos valores: `x0', x1', x2'...`.
    * C) Variamos o valor de `x0', x1', x2'...` em uma taxa `T`, como `+0.1` ou `-0.1` (`Mutação`), obtendo os indivíduos `x0'', x1'', x2''...`
    * D) Substituímos esses resultados pelos indivíduos antigos. Assim, a nova população será composta por `M` e por `x0'', x1'', x2''...`.
    * E) Com isso, obtemos uma nova população `M, x0'', x1'', x2''...`. Espera-se que um dos valores `xn''` seja melhor que `M`. Caso isso ocorra, dizemos que a população **evoluiu**.

### Implementação no Código com Funções Matemáticas de mais de uma variável.
Para uma função com mais de uma variável, tratamos os valores `x0, x1, x2...` como vetores de `g` genes: `x0 = [G0, G1,...,Gg]`. Assim, a função `x -> f(x)` é tratada como uma função de `g` variáveis: `[G0, G1,...,Gg] -> f([G0, G1,...,Gg])`. Por fim, para ocorrerem os processos de cruzamento e mutação, é preciso determinar *quantos* genes serão mutados (apenas um, dois, todos, etc.) e, dado esse número, *quais* genes serão mutados (o primeiro, o quinto, etc.).

## Funcionalidades Adicionais do Programa e Interface
### Catástrofes
É possível executar um *genocídio* ao substituir `n` indivíduos de uma geração por novos, gerados aleatoriamente. A geração que passar por catástrofes não sofrerá cruzamentos nem mutações. Além disso, **o melhor indivíduo nunca será substituído**. O programa dispõe de 4 formas de catástrofe:
1. Catástrofe do Mais Apto: Os `n` piores indivíduos serão substituídos.
2. Catástrofe da Praga: Os `n` melhores indivíduos serão substituídos.
3. Catástrofe Disruptiva: Os `n` indivíduos medianos serão substituídos.
4. Catástrofe Estabilizadora: Os `n/2` piores e os `n/2` melhores serão substituídos.

### Formas de Mutação
Existem também 4 formas de mutação disponíveis no programa:
1. Mutação Padrão: O gene a ser mutado será incrementado/decrementado em uma taxa fixa.
2. Mutação Acumulativa: Se a população não evoluir após `n` gerações, então considera-se que a população *estagnou*. A cada estagnação, a taxa aumenta proporcionalmente.
3. Mutação Acumulativa com Teto: Similar à acumulativa, porém se a mutação total ultrapassar um limite, a estagnação e a mutação são resetados.
4. Caótica: A taxa é aleatória para cada mutação.

### Função
A função fornecida do usuário é em `JavaScript`. Isso significa que ele pode utilizar *estruturas condicionais*, *laços de repetição* e *bibliotecas padrões* ao defini-la.

### Gráficos
A interface plota três gráficos para facilitar a visualização do usuário:
1. Função: O programa plota a função que o usuário definiu juntamente com seu valor máximo. Ao longo das gerações, o programa também mostra no gráfico os melhores indivíduos encontrados. Adicionalmente, é possível mostrar todos os indivíduos das últimas gerações. **Esse gráfico só é visível em funções de uma variável**.
2. Melhor Indivíduo: Esse gráfico mostra a evolução do melhor indivíduo com o passar das gerações.
3. Margem de Erro: Para fins pedagógicos, é possível definir um valor máximo para o programa comparar com os melhores indivíduos. Dessa forma, pode-se plotar a distância que os melhores estão do valor máximo.

### Arquivo de Logs
O usuário consegue fazer um download de um arquivo de logs (`.txt`), que contém os parâmetros da função, a função, todos os indivíduos de todas as gerações e valores de cruzamento e de mutação.

**ATENÇÃO: A depender do número de gerações já efetuadas, o tamanho do arquivo pode ficar muito grande (cerca de 250MB para 50.000 gerações).** (Futuras atualizações do projeto podem reduzir ou reformular o arquivo de logs).

## Funcionamento e Especificações
A seguir, estão o funcionamento detalhado e as especificações de cada parte do algoritmo evolutivo implementado.
### GERAÇÃO DA POPULAÇÃO INICIAL
Gera-se `c.nIndv` vetores de `c.nGenes` genes. O valor de cada gene `Gi` é um **inteiro** número entre `c.genesLminGer[i]` e `c.genesLmaxGer[i]`. Todos os indivíduos (vetores) serão armazenados no vetor `c.pop`.
```javascript
function gerarIndividuo() {
    let individuo = [];
    for (let i = 0; i < c.nGenes; i++) individuo.push(escolherNumReal(c.genesLminGer[i], c.genesLmaxGer[i], true))
    return individuo;
}
```
### ETAPAS EM LOOP:
#### DETERMINAÇÃO DO MELHOR INDIVÍDUO
Itera-se sobre todos os indivíduos de `c.pop` e determina-se o **índice `I`** de maior aptidão, isto é, `c.f(c.pop[I])` é o maior dentre os `c.f(c.pop[i])`.

#### AUMENTO ESTAGNAÇÃO [Ver também: MUTAÇÃO]
`c.estagAtual` conta quantas vezes consecutivas as gerações estão estagnadas. Isto é, se há 15 gerações o melhor (`c.melhorGeral`) é o mesmo, `c.estagAtual = 15`. Esse valor só aumenta se o tipo de mutação escolhido (`c._mut`) for a acumulativa (`_mut_acu`) ou a acumulativa limitada (`_mut_acl`).
Porém, caso a geração atual encontre um novo melhor, então o incremento atual da mutação (`c.incAtual`) é resetado, juntamente com a contagem das estagnações.
```javascript
if (c.f(c.pop[I]) === c.f(c.melhorGeral) && ["_mut_acu", "_mut_acl"].includes(c._mut)) {
    c.estagAtual++;
} else if (c.f(c.pop[I]) > c.f(c.melhorGeral)) {
    c.melhorGeral = c.pop[I];
    if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncrementoDaMutacaoAtual(true);
}
```
```javascript
function alterarIncrementoDaMutacaoAtual(resetar) {
    if (resetar) c.incAtual = 0;
    c.estagAtual = 0;
}
```

#### CATÁSTROFE
O programa determina, com base na probabilidade `c.pCat`, se vai haver catástrofe na geração.  Se houver, o incremento da mutação e a contagem das estagnações são resetados e a catástrofe é realizada, com base no tipo. Além disso, não são realizados cruzamentos ou mutações na catástrofe, ou seja, ela encerra a execução da geração (`return`) e parte para a próxima.
```javascript
//escolherZeroUm(prob) tem 'prob' de chances de retornar 1.
if (escolherZeroUm(c.pCat)) {
    if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncrementoDaMutacaoAtual(true);
    c.pop = realizarCatastrofe(c._cat, c.pop);
    return;
}
```
**A CATÁSTROFE NUNCA SUBSTITUI O MELHOR INDIVÍDUO**. Abaixo, é possível ver os critérios de substituição para os tipos de catástrofe. Para a catástrofe Disruptiva e Estabilizadora, tende-se a matar mais indivíduos *piores* do que *melhores*, por causa da paridade de `c.nMortosCat` (número de mortos pela catástrofe) e de `pop.length`.
```javascript
function matarNIndividuos(tipo, pop) {
    //aux é um vetor de pares (índice, f(x)) ordenada em ordem crescente pelo f(x).
    //popNova é um vetor em branco, mas que JÁ CONTÉM o melhor indivíduo.
    switch (tipo) {
        case "_cat_apt": //Mais apto - mata os piores
            for (let i = c.nMortosCat; i < pop.length - 1; i++) popNova.push(pop[aux[i][0]]);
            break;
        case "_cat_prg": //Praga - mata os melhores
            for (let i = 0; i < pop.length - c.nMortosCat; i++) popNova.push(pop[aux[i][0]]);
            break;
        case "_cat_dis": //Disruptiva - mata os medianos
            for (let i = 0; i < Math.floor(c.nMortosCat / 2); i++) popNova.push(pop[aux[i][0]]);
            for (let i = pop.length - Math.floor(c.nMortosCat / 2); i < c.nIndv - 1; i++) popNova.push(pop[aux[i][0]]);
            break;
        case "_cat_est": //Estabilizadora - mata os extremos
            for (let i = Math.ceil(c.nMortosCat / 2); i < c.nIndv - Math.floor(c.nMortosCat / 2); i++) popNova.push(pop[aux[i][0]]);
            break;
    }
    while (popNova.length < pop.length) {
        popNova.push(gerarIndividuo());
    }
    return popNova;
}
```

#### LIMITE DA ESTAGNAÇÃO
Se a estagnação (`c.estag`) foi atingida (e o tipo de mutação `c._mut` aceita estagnações), então o contador da estagnação é resetado, mas o incremento da mutação (`c.incAtual`) é aumentado.
```javascript
if (c.estagAtual >= c.estag && ["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncrementoDaMutacaoAtual(false);
```
```javascript
function alterarIncrementoDaMutacaoAtual(resetar) {
    if (resetar) c.incAtual = 0;
    else c.incAtual++;
    c.estagAtual = 0;
}
```
#### SELEÇÃO [Ver também: MUTAÇÃO]
Nessa etapa, os indivíduos serão substituídos
##### SELEÇÃO POR ELITISMO
Na seleção por elitismo, todos os indivíduos (**menos o melhor (`populacao[I]`)**) são cruzados com o melhor, fazendo a média entre os genes de `populacao[i]` e `populacao[I]`. Após isso, é realizada a mutação e os indivíduos são substituídos.
```javascript
function selecaoPorElitismo(populacao) {
    let I = melhorIndividuoDaPopulacao(populacao);
    for (let i = 0; i < populacao.length; i++) {
        if (i == I) continue;
        populacao[i] = realizarCruzamento(0, populacao[i], populacao[I]);
        populacao[i] = realizarMutacao(c._mut, populacao[i]);
    }
    return populacao;
}
```

#### SELEÇÃO POR ROLETA
Na seleção por roleta, cria-se uma roleta a partir dos indivíduos da população, de forma que indivíduos melhores possuem *mais espaço* na roleta. A roleta é feita utilizando a seguinte normalização, a fim de evitar probabilidades negativas:
1. Se `c.f(populacao[i])` (pior indivíduo) for negativo ou nulo, então todos os `c.f(populacao[x])` são aumentados em `-c.f(populacao[i])+1`. Caso contrário, então todos os indivíduos são positivos. Ao final dessa etapa, é formado um vetor contendo todos os valores `c.f()`, que são positivos não nulos.
2. A lista é proporcionalmente ajustada para que todos os seus elementos sejam menores do que 1.
**EXEMPLO DE NORMALIZAÇÃO:**
1. `[-3, 0, 5] -> [-3+(-(-3)+1), 0+(-(-3)+1), 5+(-(-3)+1)] -> [-3+4, 0+4, 5+4] -> [1, 4, 9]`
2. `[1, 4, 9] -> [1/14, 4/14, 9/14] -> [0,071; 0,286; 0,643]`, onde `14 = 1 + 4 + 9`.
Após isso, escolhem-se dois indivíduos aleatoriamente da população. Esses indivíduos cruzarão (por média de genes) e gerarão `c.nIndv-3` indivíduos (desconsiderando o melhor e esses dois indivíduos, **já que eles estarão automaticamente na geração**), que serão devidamente mutados.

```javascript
//Seleção por roleta
function selecaoPorRoleta(populacao) {
    let i = piorIndividuoDaPopulacao(populacao);
    let I = melhorIndividuoDaPopulacao(populacao);
    //Adiciona o melhor individuo na populacao
    let populacaoNova = copiarLista(populacao);
    populacaoNova.push(populacao[I]);
    //Cria a roleta
    let roleta = populacao.map(c.f);
    let normalizacao = c.f(populacao[i]) <= 0 ? -c.f(populacao[i]) : -1;
    for (let j = 0; j < populacao.length; j++) {
        roleta[j] += normalizacao + 1;
    }
    roleta = formatarParaProbabilidades(roleta, populacao.length, true);
    //Escolhe os indivíduos
    let genitor1 = escolherIndiceDeProbabilidades(roleta);
    let genitor2 = escolherIndiceDeProbabilidades(roleta);
    populacaoNova.push(populacao[genitor1]);
    populacaoNova.push(populacao[genitor2]);
    //Faz eles cruzarem
    while (populacaoNova.length != populacao.length) {
        if (populacaoNova.length > populacao.length) populacaoNova.pop();
        else {
            let individuo = realizarCruzamento(0, populacao[genitor1], populacao[genitor2]);
            individuo = realizarMutacao(c._mut, individuo);
            populacaoNova.push(individuo);
        }
    }
    return populacaoNova;
}
```
#### SELEÇÃO POR TORNEIO
Na seleção por torneio, serão sorteados dois pares de indivíduos da geração. O melhor do primeiro par cruzará (por média de genes) com o melhor do segundo par em um total de `c.nIndv-1` vezes (desconsiderando o melhor) e gerará um indivíduo, que será devidamente mutado.
O melhor indivíduo da população (`populacao[I]`) está automaticamente incluso na nova população.

```javascript
//Seleção por torneio
function selecaoPorTorneio(populacao) {
    let I = melhorIndividuoDaPopulacao(populacao);
    let populacaoNova = copiarLista(populacao);
    for (let i = 0; i < populacao.length; i++) {
        if (i == I) continue;
        
        let a, b;
        //Sorteia dois para lutarem
        a = escolherindiceDeLista(populacao);
        b = escolherindiceDeLista(populacao);
        let genitor1 = c.f(populacao[a]) > c.f(populacao[b]) ? a : b;
        //Sorteia dois para lutarem
        a = escolherindiceDeLista(populacao);
        b = escolherindiceDeLista(populacao);
        let genitor2 = c.f(populacao[a]) > c.f(populacao[b]) ? a : b;

        populacaoNova[i] = realizarCruzamento(0, populacao[genitor1], populacao[genitor2]);
        populacaoNova[i] = realizarMutacao(c._mut, populacaoNova[i]);
    }
    return populacaoNova;
}
```

#### MUTAÇÃO
Ao longo dos processos de seleção, alguns indivíduos são mutados por meio da função `realizarMutacao(c._mut, individuo)`. A função primeiramente calcula *quantos* genes serão mutados (`qtdeMutados`) e, posteriormente, calcula um vetor de `qtdeMutados` genes (`genesParaMutar`), onde cada gene é um gene a ser mutado.
* `qtdeMutados` considera a `c.listaPNumGene`, um vetor de tamanho `c.nGenes` que indica, para cada número `i` de 1 a `c.nGenes`, qual é a probabilidade de serem mutados `i` genes. 
* `genesParaMutar` considera a `c.listaPCadaGene`, lista similar à anterior, exceto pelo fato de que o elemento `Pi` indica a probabilidade de se mutar o gene `i`. Escolhe-se, `qtdeMutados` vezes, genes para serem mutados (sem repeti-los) com base nessa lista.

```javascript
function realizarMutacao(tipo, individuo) {
    //a função escolherIndiceDeProbabilidades escolhe um índice de uma lista composta por valores Pi que representam a probabilidade do índice i ser escolhido
    let qtdeMutados = escolherIndiceDeProbabilidades(c.listaPNumGene) + 1;
    addNoArquivo(`Quantidade de genes a serem mutados: ${qtdeMutados}\n`);
    //Quais serão mutados
    let genesParaMutar = [];
    let aux = copiarLista(c.listaPCadaGene);
    while (genesParaMutar.length < qtdeMutados) {
        let gene = escolherIndiceDeProbabilidades(aux);
        genesParaMutar.push(gene);
        aux.splice(gene, 1);
    }
    addNoArquivo(`Quais serão mutados: ${genesParaMutar}\n`);

    return mutacaoPorAleatoriedade(tipo, copiarLista(individuo) genesParaMutar);
    }
}
```
Após isso, a mutação acontece com base no tipo `tipo = c._mut` selecionado. O `sinal` é escolhido com base na probabilidade dele ser positivo (`c.pMutPos`). Os valores `c.mutBase`, `c.incMutBase` e `c.incAtual` são a mutação base, o incremento da mutação base e o fator multiplicativo desse incremento, isto é, quantas vezes a população *estagnou* (isso significa que, na primeira estagnação, o incremento é dobrado; na segunda, ele é triplicado; etc.).
No caso da mutação acumulativa limitada, o teto reseta esse fator multiplicativo e a contagem da estagnação, ou seja, a mutação nessa geração passa a ser `c.mutBase * sinal`.
Já na mutação caótica, cada gene `Gi` que será mutado é escolhido entre `c.mutLmin[i]` e `c.mutLmax[i]`, onde `c.mutLmin` e `c.mutLmax` são vetores de tamanho `c.nGenes` indicando tais limites.
Adicionalmente, para todas as mutações, caso o gene `Gi` seja menor que `c.genesLmin[i]` ou maior que `c.genesLmax[i]`, ele será igual ao limite respectivo, onde `c.genesLminn` e `c.genesLmax` são vetores de tamanho `c.nGenes` indicando tais limites.
```javascript
function mutacaoPorAleatoriedade(tipo, individuo, genesParaMutar) {
    //Mutação dos genes
    for (let i = 0; i < genesParaMutar.length; i++) {
        let sinal = (escolherZeroUm(c.pMutPos) ? 1 : -1);
        let mutacao;
        switch (tipo) {
            case "_mut_pad": //Mutação Padrão
                mutacao = sinal * c.mutBase;
                break;
            case "_mut_acu": //Mutação Acumulativa
                mutacao = sinal * (c.mutBase + c.incMutBase * c.incAtual);
                break;
            case "_mut_acl": //Mutação Acumulativa Limitada
                if (c.incMutBase * c.incAtual > c.tetoMut) alterarIncrementoDaMutacaoAtual(true);
                mutacao = sinal * (c.mutBase + c.incMutBase * c.incAtual);
                break;
            case "_mut_cao": //Mutação Caótica
                mutacao = sinal * escolherNumReal(c.mutLmin[genesParaMutar[i]], c.mutLmax[genesParaMutar[i]]);
                break;
        }
        //Muta o gene
        let gene = individuo[genesParaMutar[i]];
        gene += mutacao;
        //Limitação
        if (c.genesLmin[genesParaMutar[i]] !== null && gene < c.genesLmin[genesParaMutar[i]]) {
            gene = c.genesLmin[genesParaMutar[i]];
        }
        if (c.genesLmax[genesParaMutar[i]] !== null && gene > c.genesLmax[genesParaMutar[i]]) {
            gene = c.genesLmax[genesParaMutar[i]];
        }
        individuo[genesParaMutar[i]] = gene;
    }
    return individuo;
}
```

## Considerações Finais
O projeto foi idealizado a partir de conceitos apresentados nas aulas de Inteligência Artificial Bioinspirada, ministradas pelo Prof. Dr. Eduardo do Valle Simões. Mais informações sobre esse material podem ser encontradas na pasta da disciplina de `Sistemas Evolutivos Aplicados a Robótica`, ![aqui](https://gitlab.com/simoesusp/disciplinas/-/tree/master/SSC0713-Sistemas-Evolutivos-Aplicados-a-Robotica?ref_type=heads).
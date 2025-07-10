
function gerarIndv() {
    let individuo = [];
    for (let i = 0; i < c.nGenes; i++) individuo.push(randNum(c.genesLminGer[i], c.genesLmaxGer[i], true))
    return individuo;
}

//GERAÇÃO INICIAL
//Função principal
function gerarPop(tipo, tamanho) {
    switch (tipo) {
        case 0:
            return gerarPopAleatoria(tamanho);
    }
}
//Geração padrão: indivíduos aleatórios, genes aleatórios
function gerarPopAleatoria(tamanho) {
    let lista = [];
    for (let i = 0; i < tamanho; i++) lista.push(gerarIndv());
    return lista;
}











//CATASTROFE
//Função principal
function catastrofe(tipo, pop) {
    let qtdeRemovidos;
    let populacaoNova = [];
    switch (tipo) {
        case "_cat_apt":
        case "_cat_prg":
        case "_cat_dis":
        case "_cat_est":
            qtdeRemovidos = c.nMortosCat;
            populacaoNova = matarNIndividuos(tipo, pop);
            break;
    }
    log(`GEN: ${c.geracaoAtual.toString().padStart(5, 0)}, Catástrofe! ${qtdeRemovidos} foram substituídos.`);
    return populacaoNova;
}
//Catastrofe mata n indivíduos
function matarNIndividuos(tipo, pop) {
    //Indexa e ordena, em ordem CRESCENTE, a população
    let aux = [];
    let popNova = [];
    for (let i = 0; i < pop.length; i++) aux.push([i, c.f(pop[i])]);
    aux.sort(function (a, b) { return a[1] - b[1] });

    //Adiciona o melhor
    popNova.push(pop[aux[pop.length - 1][0]]);
    //Adiciona o restante
    switch (tipo) {
        case "_cat_apt":
            for (let i = c.nMortosCat; i < pop.length - 1; i++) popNova.push(pop[aux[i][0]]);
            break;
        case "_cat_prg":
            for (let i = 0; i < pop.length - c.nMortosCat; i++) popNova.push(pop[aux[i][0]]);
            break;
        case "_cat_dis":
            for (let i = 0; i < Math.floor(c.nMortosCat / 2); i++) popNova.push(pop[aux[i][0]]);
            for (let i = pop.length - Math.floor(c.nMortosCat / 2); i < c.nIndv - 1; i++) popNova.push(pop[aux[i][0]]);
            break;
        case "_cat_est":
            for (let i = Math.ceil(c.nMortosCat / 2); i < c.nIndv - Math.floor(c.nMortosCat / 2); i++) popNova.push(pop[aux[i][0]]);
            break;
    }
    //Substitui
    while (popNova.length < pop.length) {
        popNova.push(gerarIndv());
    }
    return popNova;
}






//Retorna o melhor indivíduo
function melhorIndv(populacao) {
    let melhorIndice = 0;
    for (let i = 0; i < populacao.length; i++) {
        if (c.f(populacao[i]) > c.f(populacao[melhorIndice])) melhorIndice = i;
    }
    return melhorIndice;
}
function piorIndv(populacao) {
    let piorIndice = 0;
    for (let i = 0; i < populacao.length; i++) {
        if (c.f(populacao[i]) < c.f(populacao[piorIndice])) piorIndice = i;
    }
    return piorIndice;
}
//SELEÇÃO
//Função principal
function selecionar(tipo, populacao) {
    populacao = copiar(populacao);
    switch (tipo) {
        case "_sel_eli":
            return selecionarElitismo(populacao);
        case "_sel_rol":
            return selecionarRoleta(populacao);
        case "_sel_tor":
            return selecionarTorneio(populacao);
    }
}
//Seleção por elitismo
function selecionarElitismo(populacao) {
    let I = melhorIndv(populacao);
    for (let i = 0; i < populacao.length; i++) {
        if (i == I) continue;
        //CRUZAMENTO
        populacao[i] = cruzar(0, populacao[i], populacao[I]);

        //MUTAÇÃO
        populacao[i] = mutar(c._mut, populacao[i]);
    }
    return populacao;
}
//Seleção por roleta
function selecionarRoleta(populacao) {
    let i = piorIndv(populacao);
    let I = melhorIndv(populacao);
    //Adiciona o melhor individuo na populacao
    let populacaoNova = copiar(populacao);
    populacaoNova.push(populacao[I]);
    //Cria a roleta
    let roleta = populacao.map(c.f);
    let normalizacao = c.f(populacao[i]) <= 0 ? -c.f(populacao[i]) : -1;
    for (let j = 0; j < populacao.length; j++) {
        roleta[j] += normalizacao + 1;
    }
    roleta = formatarProb(roleta, populacao.length, true);
    //Escolhe os indivíduos
    let genitor1 = randIndex(roleta);
    let genitor2 = randIndex(roleta);
    populacaoNova.push(populacao[genitor1]);
    populacaoNova.push(populacao[genitor2]);
    //Faz eles cruzarem
    while (populacaoNova.length != populacao.length) {
        if (populacaoNova.length > populacao.length) populacaoNova.pop();
        else {
            //CRUZAMENTO
            let individuo = cruzar(0, populacao[genitor1], populacao[genitor2]);

            //MUTAÇÃO
            individuo = mutar(c._mut, individuo);
            populacaoNova.push(individuo);
        }
    }
    return populacaoNova;
}
//Seleção por torneio
function selecionarTorneio(populacao) {
    let I = melhorIndv(populacao);
    let populacaoNova = copiar(populacao);
    for (let i = 0; i < populacao.length; i++) {
        if (i == I) continue;

        let a, b;
        //Sorteia dois para lutarem e ser o pai
        a = randEl(populacao);
        b = randEl(populacao);
        let genitor1 = c.f(populacao[a]) > c.f(populacao[b]) ? a : b;
        //Sorteia dois para lutarem e ser a mãe
        a = randEl(populacao);
        b = randEl(populacao);
        let genitor2 = c.f(populacao[a]) > c.f(populacao[b]) ? a : b;

        //CRUZAMENTO
        populacaoNova[i] = cruzar(0, populacao[genitor1], populacao[genitor2]);

        //MUTAÇÃO
        populacaoNova[i] = mutar(c._mut, populacaoNova[i]);
    }
    return populacaoNova;
}










//CRUZAMENTO
//Função principal
function cruzar(tipo, individuo, melhor) {
    individuo = copiar(individuo);
    melhor = copiar(melhor);
    switch (tipo) {
        case 0:
            return crossingover(individuo, melhor);
    }
}
//Crossing-over
function crossingover(individuo, melhor) {
    for (let i = 0; i < individuo.length; i++) {
        individuo[i] = (melhor[i] + individuo[i]) / 2;
    }
    return individuo;
}








//MUTAÇÃO
//Altera o incremento atual
function alterarIncAtual(resetar) {
    if (resetar) c.incAtual = 0;
    else c.incAtual++;
    switch (c._mut) {
        case "_mut_pad":
            setAtr("$coeficiente_de_mutacao_atual", c.mutBase);
            break;
        case "_mut_acu":
        case "_mut_acl":
            setAtr("$coeficiente_de_mutacao_atual", c.mutBase + c.incMutBase * c.incAtual);
            break;
        case "_mut_cao":
            setAtr("$coeficiente_de_mutacao_atual", 0);
            break;
    }
    c.estagAtual = 0;
}
//Função principal
function mutar(tipo, individuo) {
    //Quantos serão mutados
    let qtdeMutados = randIndex(c.listaPNumGene) + 1;
    //Quais serão mutados
    let genesParaMutar = [];
    let aux = copiar(c.listaPCadaGene);
    while (genesParaMutar.length < qtdeMutados) {
        let gene = randIndex(aux);
        genesParaMutar.push(gene);
        aux.splice(gene, 1);
    }

    individuo = copiar(individuo);
    switch (tipo) {
        case "_mut_pad":
        case "_mut_acu":
        case "_mut_acl":
        case "_mut_cao":
            return mutacao(tipo, individuo, genesParaMutar);
    }
}
function mutacao(tipo, individuo, genesParaMutar) {
    //Mutação dos genes
    for (let i = 0; i < genesParaMutar.length; i++) {
        let sinal = (zeroUm(c.pMutPos) ? 1 : -1);
        let mutacao;
        switch (tipo) {
            case "_mut_pad":
                mutacao = sinal * c.mutBase;
                break;
            case "_mut_acu":
                mutacao = sinal * (c.mutBase + c.incMutBase * c.incAtual);
                break;
            case "_mut_acl":
                if (c.incMutBase * c.incAtual > c.tetoMut) alterarIncAtual(true);
                mutacao = sinal * (c.mutBase + c.incMutBase * c.incAtual);
                break;
            case "_mut_cao":
                mutacao = sinal * randNum(c.mutLmin[genesParaMutar[i]], c.mutLmax[genesParaMutar[i]]);
                break;
        }
        //Muta o gene
        let gene = individuo[genesParaMutar[i]];
        gene += mutacao;
        //Limitação
        if (c.genesLmin[genesParaMutar[i]] !== null && gene < c.genesLmin[genesParaMutar[i]]) gene = c.genesLmin[genesParaMutar[i]];
        if (c.genesLmax[genesParaMutar[i]] !== null && gene > c.genesLmax[genesParaMutar[i]]) gene = c.genesLmax[genesParaMutar[i]];
        individuo[genesParaMutar[i]] = gene;
    }
    return individuo;
}
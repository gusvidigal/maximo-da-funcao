//Obtem os parâmetros do HTML
function obterParametros() {
    //Gerações
    c.nIndv = parseInt(obterAtributoHTML("$tamanho_da_populacao"));
    c._sel = obterAtributoHTML("_sel");
    c.escape = parseFloat(obterAtributoHTML("$escape"));

    //Mutações
    c.mutBase = parseFloat(obterAtributoHTML("$mutacao_base"));
    c.pMutPos = parseFloat(obterAtributoHTML("$mutacao_positiva"));
    c._mut = obterAtributoHTML("_mut");
    c.estag = parseInt(obterAtributoHTML("$estagnacao"));
    c.incMutBase = parseFloat(obterAtributoHTML("$incremento_da_mutacao_base"));
    c.tetoMut = parseFloat(obterAtributoHTML("$teto_da_mutacao_base"));

    //Genética
    c.nGenes = parseInt(obterAtributoHTML("$numero_de_genes"));
    c.listaPCadaGene = formatarParaProbabilidades(obterAtributoHTML("$lista_prob_mutacao_cada_gene"), c.nGenes);
    c.listaPNumGene = formatarParaProbabilidades(obterAtributoHTML("$lista_prob_mutacao_num_genes"), c.nGenes);
    c.pCat = parseFloat(obterAtributoHTML("$probabilidade_catastrofe"));
    c._cat = obterAtributoHTML("_cat");
    c.nMortosCat = parseInt(obterAtributoHTML("$numero_de_mortos_catastrofe"));
    if (c.nMortosCat >= c.nIndv) c.nMortosCat = c.nIndv - 1;
    c.genesLmin = stringParaLista(obterAtributoHTML("$genes_limite_minimo"), c.nGenes, null);
    c.genesLmax = stringParaLista(obterAtributoHTML("$genes_limite_maximo"), c.nGenes, null);
    //Gerações
    c.genesLminGer = formatarParaLimites(obterAtributoHTML("$genes_limite_minimo_geracao"), c.nGenes, 1);
    c.genesLmaxGer = formatarParaLimites(obterAtributoHTML("$genes_limite_maximo_geracao"), c.nGenes, 2);
    //Mutações
    c.mutLmin = formatarParaLimites(obterAtributoHTML("$mutacoes_limite_minimo"), c.nGenes, 3);
    c.mutLmax = formatarParaLimites(obterAtributoHTML("$mutacoes_limite_maximo"), c.nGenes, 4);

    //Função
    let funcao = new Function("p", obterAtributoHTML("funcao"));
    c.f = function (individuo) {
        if (!isFinite(funcao(individuo))) return c.escape;
        else return funcao(individuo);
    }


    //Visualização do Gráfico
    c.delay = parseInt(obterAtributoHTML("$delay_da_geracao"));
    c.resize = parseInt(obterAtributoHTML("$resize"));
    c.nPtsFuncao = parseInt(obterAtributoHTML("$nPtsFuncao"));
    c.gerVisiveis = parseInt(obterAtributoHTML("$geracoes_visiveis"));

    //Gráficos
    c.compMargem = parseFloat(obterAtributoHTML("$comparacao_margem_de_erro"));

    //Outros
    c.estagAtual = 0;
    c.melhorGeral = 0;
    c.incAtual = 0;
    c.geracaoAtual = 0;
    c.index = 0;

    //Logs
    c.arquivo = "";
}
//Verifica se todos os campos foram preenchidos corretamente e retorna true caso sim
function verificarParametros() {

    function alertarNaN(placeholder, valor) {
        if (isNaN(valor)) {
            alert(`O valor '${placeholder}' precisa ser um número!`);
            return true;
        } else return false;
    }
    function alertarNegativo(placeholder, valor) {
        if (valor < 0) {
            alert(`O valor '${placeholder}' precisa ser maior ou igual a zero!`);
            return true;
        } else return false;
    }
    function alertarMenorQueUm(placeholder, valor) {
        if (valor < 1) {
            alert(`O valor '${placeholder}' precisa ser maior ou igual a um!`);
            return true;
        } else return false;
    }
    function alertarProbabilidade(placeholder, valor) {
        if (valor < 0 || valor > 1) {
            alert(`O valor '${placeholder}' precisa ser entre zero e um!`);
            return true;
        } else return false;
    }

    if (alertarNaN("população", c.nIndv)) return false;
    else if (alertarMenorQueUm("população", c.nIndv)) return false;
    else if (alertarNaN("escape", c.escape)) return false;
    else if (alertarNaN("mutação base", c.mutBase)) return false;
    else if (alertarNegativo("mutação base", c.mutBase)) return false;
    else if (alertarNaN("probabilidade de mutação positiva", c.pMutPos)) return false;
    else if (alertarProbabilidade("probabilidade de mutação positiva", c.pMutPos)) return false;
    else if (alertarNaN("estagnação", c.estag)) return false;
    else if (alertarMenorQueUm("estagnação", c.estag)) return false;
    else if (alertarNaN("incremento da mutação base", c.incMutBase)) return false;
    else if (alertarNegativo("incremento da mutação base", c.incMutBase)) return false;
    else if (alertarNaN("teto da mutação base", c.tetoMut)) return false;
    else if (alertarNegativo("teto da mutação base", c.tetoMut)) return false;
    else if (alertarNaN("número de genes", c.nGenes)) return false;
    else if (alertarMenorQueUm("número de genes", c.nGenes)) return false;
    else if (alertarNaN("probabilidade de catástrofe", c.pCat)) return false;
    else if (alertarProbabilidade("probabilidade de catástrofe", c.pCat)) return false;
    else if (alertarNaN("número de mortos por catástrofe", c.nMortosCat)) return false;
    else if (alertarNaN("Tempo de geração", c.delay)) return false;
    else if (alertarNegativo("Tempo de geração", c.delay)) return false;
    else if (alertarNaN("resize", c.resize)) return false;
    else if (alertarMenorQueUm("resize", c.resize)) return false;
    else if (alertarNaN("número de pontos da função", c.nPtsFuncao)) return false;
    else if (alertarMenorQueUm("número de pontos da função", c.nPtsFuncao)) return false;
    else if (alertarNaN("gerações visíveis", c.gerVisiveis)) return false;
    else if (alertarNegativo("gerações visíveis", c.gerVisiveis)) return false;
    else return true;
}




//Adiciona texto no arquivo
function addNoArquivo(texto) { c.arquivo += texto; }
//Adiciona os campos no arquivo
function addTextoInicialDoArquivo() {
    addNoArquivo(`MODELAGEM E OTIMIZADOR DE FUNÇÕES MATEMÁTICAS COM ALGORITMOS EVOLUTIVOS
Autor: Gustavo Vidigal Schulgin (gusvidigal)
--------------------------------------------------


FUNÇÃO UTILIZADA (nas variáveis p): {
${obterAtributoHTML("funcao")}
}

PARÂMETROS:

GERAÇÕES
População: ${c.nIndv};
Tipo de seleção: ${c._sel};
Escape: ${c.escape};
Limite mínimo da geração dos genes: ${c.genesLminGer};
Limite máximo da geração dos genes: ${c.genesLmaxGer};

MUTAÇÃO
Mutação base: ${c.mutBase};
Probabilidade de mutação positiva: ${c.pMutPos};
Tipo de mutação: ${c._mut};
Estagnação: ${c.estag};
Incremento da mutação base: ${c.incMutBase};
Teto da mutação: ${c.tetoMut};
Limite mínimo das mutações: ${c.mutLmin};
Limite máximo das mutações: ${c.mutLmax};

GENÉTICA
Número de genes: ${c.nGenes};
Probabilidade de escolha de cada gene: ${c.listaPCadaGene};
Probabilidade de mutar x genes: ${c.listaPNumGene};
Probabilidade de catástrofe: ${c.pCat};
Tipo de catástrofe: ${c._cat};
Número de mortos pela catástrofe: ${c.nMortosCat};
Limite mínimo dos genes: ${c.genesLmin};
Limite máximo dos genes: ${c.genesLmax};

--------------------------------------------------
`);
}









//FUNÇÕES DE HTML
//Obtém o valor de algum atributo
function obterAtributoHTML(id, atributo) {
    if (!atributo) return document.getElementById(id).value;
    return document.getElementById(id)[atributo];
}
//Seta o valor de algum atributo
function setarAtributoHTML(id, txt, atributo) {
    if (!atributo) document.getElementById(id).value = txt;
    else document.getElementById(id)[atributo] = txt;
}
//Seta o valor de algum atributo
function setarAtributoNasClassesHTML(classe, txt, atributo) {
    for (const elemento of document.getElementsByClassName(classe)) {
        if (!atributo) elemento.value = txt;
        else elemento[atributo] = txt;
    }
}
//Limpa o valor de atributos
function deletarAtributosHTML() {
    for (let i = 0; i < arguments.length; i++) setarAtributoHTML(arguments[i], "");
}
//Inativa um input
function desativarInputHTML(id) { setarAtributoHTML(id, "true", "disabled"); }
//Mudança nos selects
function atualizarSelectsHTML() {
    //Primeiramente, ativa todos
    document.querySelectorAll("input").forEach(elemento => {
        if (!elemento.classList.contains("disabled-input")) elemento.disabled = false;
    });
    let _cat = document.getElementById("_cat").value;
    let _mut = document.getElementById("_mut").value;
    switch (_cat) {
        case "_cat_apt":
        case "_cat_prg":
        case "_cat_dis":
        case "_cat_est":
            break;
    }
    switch (_mut) {
        case "_mut_pad":
            desativarInputHTML("$estagnacao");
            desativarInputHTML("$incremento_da_mutacao_base");
            desativarInputHTML("$teto_da_mutacao_base");
            desativarInputHTML("$mutacoes_limite_minimo");
            desativarInputHTML("$mutacoes_limite_maximo");
            break;
        case "_mut_acu":
            desativarInputHTML("$teto_da_mutacao_base");
            desativarInputHTML("$mutacoes_limite_minimo");
            desativarInputHTML("$mutacoes_limite_maximo");
            break;
        case "_mut_acl":
            desativarInputHTML("$mutacoes_limite_minimo");
            desativarInputHTML("$mutacoes_limite_maximo");
            break;
        case "_mut_cao":
            desativarInputHTML("$mutacao_base");
            desativarInputHTML("$estagnacao");
            desativarInputHTML("$incremento_da_mutacao_base");
            break;
    }
}








//FUNÇÕES DE ALEATORIEDADE
//Retorna 1 se um número foi escolhido segundo a probabilidade
function escolherZeroUm(prob) {
    let num = Math.random();
    if (num === prob) return escolherZeroUm(prob);
    return num < prob ? 1 : 0;
}
//Retorna um número aleatório entre dois valores (inclusos)
function escolherNumReal(min, max, arredondar) {
    let valor = min + Math.random() * (max - min);
    if (arredondar) return Math.round(valor);
    else return valor;
}
//Escolhe um index de uma lista de probabilidades
function escolherIndiceDeProbabilidades(probabilidades) {
    let num = Math.random();
    let escolhido, soma = 0;
    for (let i = 0; i < probabilidades.length; i++) {
        soma += probabilidades[i];
        if (soma >= num) {
            escolhido = i;
            break;
        }
    }
    return escolhido;
}
//Escolhe um index aleatório de uma lista
function escolherindiceDeLista(lista) {
    let index = escolherNumReal(0, lista.length, true);
    return index;
}










//OUTRAS FUNÇÕES
//Copia uma lista e a retorna (sem alterar a original)
function copiarLista(lista) {
    return lista.slice(0);
}
//Gera polinômios
function poli(x, coeficientes) {
    let soma = 0;
    for (let i = 0; i < coeficientes.length; i++) {
        soma += coeficientes[coeficientes.length - i - 1] * Math.pow(x, i);
    }
    return soma;
}
//Loga uma linha no campo de melhores indivíduos
function addLinhaEmMelhoresIndividuos(txt) {
    document.getElementById("melhores").value += txt + '\n';
    setarAtributoHTML("melhores", obterAtributoHTML("melhores", "scrollHeight"), "scrollTop");
}
//Formata uma string para uma lista e a retorna
function stringParaLista(txt, tamanho, replacer) {
    lista = txt.split(";").map(item => {
        if (item.trim() === "") return replacer;
        else {
            let numero = parseFloat(item.trim());
            if (!isFinite(numero)) return replacer;
            else return numero;
        }
    });
    if (lista.length < tamanho) {
        while (lista.length != tamanho) lista.push(replacer);
    } else if (lista.length > tamanho) {
        while (lista.length != tamanho) lista.pop();
    }
    return lista;
}
// Formata lista de valores para padronizar, proporcionalmente, em valores que somam 1
function formatarParaProbabilidades(txt_ou_lista, tamanho, eh_lista) {
    lista = eh_lista ? copiarLista(txt_ou_lista) : stringParaLista(txt_ou_lista, tamanho, 0);
    let soma = 0;
    for (let i = 0; i < lista.length; i++) soma += lista[i];
    lista = lista.map(item => soma === 0 ? 1 / tamanho : item / soma);
    return lista;
}
// Formata lista de limites
function formatarParaLimites(txt, tamanho, tipo) {
    lista = stringParaLista(txt, tamanho, null);

    for (let i = 0; i < tamanho; i++) {
        if (tipo === 1) {
            if (lista[i] === null) lista[i] = c.genesLmin[i] !== null ? c.genesLmin[i] : -100;
            else if (lista[i] < c.genesLmin[i] && c.genesLmin[i] !== null) lista[i] = c.genesLmin[i];

        } else if (tipo === 2) {
            if (lista[i] === null) lista[i] = c.genesLmax[i] !== null ? c.genesLmax[i] : 100;
            else if (lista[i] > c.genesLmax[i] && c.genesLmax[i] !== null) lista[i] = c.genesLmax[i];

        } else if (tipo === 3) {
            if (lista[i] === null) lista[i] = 0;
            lista[i] = Math.abs(lista[i]);

        } else if (tipo === 4) {
            if (lista[i] === null) lista[i] = c.tetoMut;
            lista[i] = Math.abs(lista[i]);
        }
    }
    return lista;
}










//FUNÇÕES DE GRÁFICOS DO CANVAS.JS
//Atualiza os gráficos
function atualizarGraficos() {
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].g.render();
    }
}
//Reseta os gráficos
function resetarGraficos() {
    g_melhor.p.length = 0;
    g_margemDeErro.p.length = 0;
    g_funcao.pf.length = 0;
    g_funcao.pi.length = 0;
    g_funcao.pm.length = 0;

    g_melhor.x = 0;
    g_margemDeErro.x = 0;

    g_melhor.r = c.resize;
    g_margemDeErro.r = c.resize;
    atualizarGraficos(g_melhor, g_margemDeErro, g_funcao);
}
//Cria um ponto
function criarPontoNoGrafico(id) {
    let index;
    let x;
    let y;
    let markerColor;
    let markerSize;
    let markerType;
    let melhor;

    switch (id) {
        case 0:
            x = arguments[1];
            y = arguments[2];
            break;
        case 1:
            x = g_melhor.x;
            y = arguments[1];
            break;
        case 2:
            x = g_margemDeErro.x;
            y = arguments[1];
            break;
        case 3:
            melhor = 1;
            markerColor = "yellow";
            markerSize = 10;
            markerType = "triangle";
            x = arguments[1];
            y = arguments[2]
            break;
        case 4:
            x = arguments[1];
            y = arguments[2];
            index = arguments[3];
            break;
    }
    return {
        id: melhor,
        index: index,
        x: x,
        y: y,
        markerColor: markerColor,
        markerSize: markerSize,
        markerType: markerType
    }

}
//Plotar o gráfico da função
function plotarFuncao() {
    //Se a função tem mais de uma variável, não vai plotar
    if (c.nGenes > 1) return;
    //Intervalo de plotagem
    let min = c.genesLminGer[0];
    let max = c.genesLmaxGer[0];
    let maiorFuncao = min;
    //Adiciona os pontos
    for (let i = min; i <= max; i += (max - min) / c.nPtsFuncao) {
        if (c.f([maiorFuncao]) < c.f([i])) maiorFuncao = i;
        //Se o ponto não for escape
        if (c.f([i]) !== c.escape) addPontoAoGrafico(g_funcao.pf, criarPontoNoGrafico(0, i, c.f([i])));
    }
    //Adiciona a marcação do melhor encontrado
    g_funcao.g.axisX[0].stripLines[0].set("value", maiorFuncao);
    addPontoAoGrafico(g_funcao.pi, criarPontoNoGrafico(3, maiorFuncao, c.f([maiorFuncao])));
    //Atualiza
    atualizarGraficos(g_funcao);
}
//Adiciona ponto ao gráfico e redimensiona
function addPontoAoGrafico(obj, ponto) {
    //Se o objeto for um gráfico, adiciona e redimensiona. Senão, só adiciona
    if (obj.p) {
        obj.p.push(ponto);
        if (obj.r !== 0 && obj.p.length > obj.r) obj.p.shift();
    } else obj.push(ponto);
}
//Adiciona o novo melhor (ponto vermelho) no gráfico da função
function addNovoMelhorNaFuncao(indv) {
    addLinhaEmMelhoresIndividuos(`GER: ${c.geracaoAtual.toString().padStart(5, 0)}, Novo valor máximo: g: [${indv.join(", ")}], f(g): ${c.f(indv)}`);

    //Se o indivíduo tiver mais de um gene, não plota
    if (indv.length > 1) return;

    addPontoAoGrafico(g_funcao.pi, criarPontoNoGrafico(0, indv[0], c.f(indv)));
    //Se encontrou um novo melhor do que o valor que já estava marcado (em amarelo)
    if (c.f(indv) > c.f([g_funcao.g.axisX[0].stripLines[0].value])) {
        g_funcao.g.axisX[0].stripLines[0].set("value", indv[0]);
        for (let j = 0; j < g_funcao.pi.length; j++) {
            if (g_funcao.pi[j].id === 1) {
                g_funcao.pi[j].x = indv[0];
                g_funcao.pi[j].y = c.f(indv);
                break;
            }
        }
    }
    atualizarGraficos(g_funcao);
}
//Adiciona todos os indivíduos no gráfico da função
function addIndividuosNaFuncao(populacao) {
    //Se o indivíduo tiver mais de um gene, ou se não vão ser mostrados indivíduos, não plota
    if (populacao[0].length > 1 || c.gerVisiveis === 0) return;
    //Retira todos e adiciona os novos
    g_funcao.pm.sort((a, b) => a.index - b.index);
    for (let i = 0; i < populacao.length; i++) {
        addPontoAoGrafico(g_funcao.pm, criarPontoNoGrafico(4, populacao[i][0], c.f(populacao[i]), c.index));
        c.index += 1;
    }
    while (g_funcao.pm.length > c.gerVisiveis * c.nIndv) g_funcao.pm.shift();

    atualizarGraficos(g_funcao);
}

//Adiciona pontos da geração atual nos gráficos
function addMelhorAtualNosGraficos(indv) {
    //Adiciona, incrementa o x e atualiza
    addPontoAoGrafico(g_melhor, criarPontoNoGrafico(1, c.f(indv)));
    g_melhor.x++;
    atualizarGraficos(g_melhor);
    //Se não tem comparação, não precisa atualizar
    if (isFinite(c.compMargem)) {
        //Adiciona, incrementa o x e atualiza
        addPontoAoGrafico(g_margemDeErro, criarPontoNoGrafico(2, c.compMargem - c.f(indv)));
        g_margemDeErro.x++;
        atualizarGraficos(g_margemDeErro);
    }
}



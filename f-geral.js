
//Setar atributos
function setarCampos() {
    //Gerações
    c.nIndv = parseInt(getAtr("$tamanho_da_populacao"));
    c._sel = getAtr("_sel");
    c.escape = parseFloat(getAtr("$escape"));

    //Mutações
    c.mutBase = parseFloat(getAtr("$mutacao_base"));
    c.pMutPos = parseFloat(getAtr("$mutacao_positiva"));
    c._mut = getAtr("_mut");
    c.estag = parseInt(getAtr("$estagnacao"));
    c.incMutBase = parseFloat(getAtr("$incremento_da_mutacao_base"));
    c.tetoMut = parseFloat(getAtr("$teto_da_mutacao_base"));

    //Genética
    c.nGenes = parseInt(getAtr("$numero_de_genes"));
    c.listaPCadaGene = formatarProb(getAtr("$lista_prob_mutacao_cada_gene"), c.nGenes);
    c.listaPNumGene = formatarProb(getAtr("$lista_prob_mutacao_num_genes"), c.nGenes);
    c.pCat = parseFloat(getAtr("$probabilidade_catastrofe"));
    c._cat = getAtr("_cat");
    c.nMortosCat = parseInt(getAtr("$numero_de_mortos_catastrofe"));
    if (c.nMortosCat >= c.nIndv) c.nMortosCat = c.nIndv - 1;
    c.genesLmin = formatarLista(getAtr("$genes_limite_minimo"), c.nGenes, null);
    c.genesLmax = formatarLista(getAtr("$genes_limite_maximo"), c.nGenes, null);
    //Gerações
    c.genesLminGer = formatarLimites(getAtr("$genes_limite_minimo_geracao"), c.nGenes, 1);
    c.genesLmaxGer = formatarLimites(getAtr("$genes_limite_maximo_geracao"), c.nGenes, 2);
    //Mutações
    c.mutLmin = formatarLimites(getAtr("$mutacoes_limite_minimo"), c.nGenes, 3);
    c.mutLmax = formatarLimites(getAtr("$mutacoes_limite_maximo"), c.nGenes, 4);

    //Função
    let funcao = new Function("p", getAtr("funcao"));
    c.f = function (individuo) {
        if (!isFinite(funcao(individuo))) return c.escape;
        else return funcao(individuo);
    }


    //Visualização do Gráfico
    c.delay = parseInt(getAtr("$delay_da_geracao"));
    c.resize = parseInt(getAtr("$resize"));
    c.nPtsFuncao = parseInt(getAtr("$nPtsFuncao"));

    //Gráficos
    c.compMargem = parseFloat(getAtr("$comparacao_margem_de_erro"));

    //Outros
    c.estagAtual = 0;
    c.melhorGeral = 0;
    c.incAtual = 0;
    c.geracaoAtual = 0;
    c.index = 0;
}







//FUNÇÕES DE HTML
//Obtém o valor de algum atributo
function getAtr(id, atributo) {
    if (!atributo) return document.getElementById(id).value;
    return document.getElementById(id)[atributo];
}
//Seta o valor de algum atributo
function setAtr(id, txt, atributo) {
    if (!atributo) document.getElementById(id).value = txt;
    else document.getElementById(id)[atributo] = txt;
}
//Limpa o valor de atributos
function delAtrs() {
    for (let i = 0; i < arguments.length; i++) setAtr(arguments[i], "");
}
//Inativa um input
function inputOff(id) {
    setAtr(id, "true", "disabled");
}
//Mudança nos selects
function atualizarSelect() {
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
            inputOff("$estagnacao");
            inputOff("$incremento_da_mutacao_base");
            inputOff("$teto_da_mutacao_base");
            inputOff("$mutacoes_limite_minimo");
            inputOff("$mutacoes_limite_maximo");
            break;
        case "_mut_acu":
            inputOff("$teto_da_mutacao_base");
            inputOff("$mutacoes_limite_minimo");
            inputOff("$mutacoes_limite_maximo");
            break;
        case "_mut_acl":
            inputOff("$mutacoes_limite_minimo");
            inputOff("$mutacoes_limite_maximo");
            break;
        case "_mut_cao":
            inputOff("$mutacao_base");
            inputOff("$estagnacao");
            inputOff("$incremento_da_mutacao_base");
            break;
    }
}








//FUNÇÕES DE ALEATORIEDADE
//Retorna 1 se um número foi escolhido segundo a probabilidade
function zeroUm(prob) {
    let num = Math.random();
    if (num === prob) return zeroUm(prob);
    return num < prob ? 1 : 0;
}
//Retorna um número aleatório entre dois valores (inclusos)
function randNum(min, max, arredondar) {
    let valor = min + Math.random() * (max - min);
    if (arredondar) return Math.round(valor);
    else return valor;
}
//Escolhe um index de uma lista de probabilidades
function randIndex(probabilidades) {
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
function randEl(lista) {
    let index = randNum(0, lista.length, true);
    return index;
}










//OUTRAS FUNÇÕES
//Copia uma lista e a retorna (sem alterar a original)
function copiar(lista) {
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
//Loga uma linha no campo de logs
function log(txt) {
    document.getElementById("logs").value += txt + '\n';
    setAtr("logs", getAtr("logs", "scrollHeight"), "scrollTop");
}
//Formata uma string para uma lista e a retorna
function formatarLista(txt, tamanho, replacer) {
    lista = txt.split(";").map(item => {
        if (item.trim() === "") return replacer;
        else return parseFloat(item.trim());
    });
    if (lista.length < tamanho) {
        while (lista.length != tamanho) lista.push(replacer);
    } else if (lista.length > tamanho) {
        while (lista.length != tamanho) lista.pop();
    }
    return lista;
}
// Formata lista de valores para padronizar, proporcionalmente, em valores que somam 1
function formatarProb(txt_ou_lista, tamanho, eh_lista) {
    lista = eh_lista ? copiar(txt_ou_lista) : formatarLista(txt_ou_lista, tamanho, 0);
    let soma = 0;
    for (let i = 0; i < lista.length; i++) soma += lista[i];
    lista = lista.map(item => soma === 0 ? 1 / tamanho : item / soma);
    return lista;
}
// Formata lista de limites
function formatarLimites(txt, tamanho, tipo) {
    lista = formatarLista(txt, tamanho, null);

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
function gAtualizar() {
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].g.render();
    }
}
//Reseta os gráficos
function gResetar() {
    g_melhor.p.length = 0;
    g_margemDeErro.p.length = 0;
    g_funcao.pf.length = 0;
    g_funcao.pi.length = 0;
    g_funcao.pm.length = 0;

    g_melhor.x = 0;
    g_margemDeErro.x = 0;

    g_melhor.r = c.resize;
    g_margemDeErro.r = c.resize;
    gAtualizar(g_melhor, g_margemDeErro, g_funcao);
}
//Plotar o gráfico da função
function gPlotarFuncao() {
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
        if (c.f([i]) !== c.escape) addPonto(g_funcao.pf, criarPonto(0, i, c.f([i])));
    }
    //Adiciona a marcação do melhor encontrado
    g_funcao.g.axisX[0].stripLines[0].set("value", maiorFuncao);
    addPonto(g_funcao.pi, criarPonto(3, maiorFuncao, c.f([maiorFuncao])));
    //Atualiza
    gAtualizar(g_funcao);
}
//Cria um ponto
function criarPonto(id) {
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
            markerColor = "red";
            x = arguments[1];
            y = arguments[2];
            break;
        case 5:
            markerColor = "blue";
            markerSize = 4;
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
//Adiciona ponto ao gráfico e redimensiona
function addPonto(obj, ponto) {
    //Se o objeto for um gráfico, adiciona e redimensiona. Senão, só adiciona
    if (obj.p) {
        obj.p.push(ponto);
        if (obj.r !== 0 && obj.p.length > obj.r) obj.p.shift();
    } else obj.push(ponto);
}
//Adiciona o novo melhor (ponto vermelho) no gráfico da função
function gAddNovoMelhor(indv) {
    log(`GER: ${c.geracaoAtual.toString().padStart(5, 0)}, Novo valor máximo: g: [${indv.join(", ")}], f(g): ${c.f(indv)}`);

    //Se o indivíduo tiver mais de um gene, não plota
    if (indv.length > 1) return;

    addPonto(g_funcao.pi, criarPonto(4, indv[0], c.f(indv)));
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
    gAtualizar(g_funcao);
}
//Adiciona todos os indivíduos no gráfico da função
function gAddIndividuos(populacao) {
    //Se o indivíduo tiver mais de um gene, não plota
    if (populacao[0].length > 1) return;
    //Retira todos e adiciona os novos
    g_funcao.pm.sort((a, b) => a.index - b.index);
    for (let i = 0; i < populacao.length; i++) {
        addPonto(g_funcao.pm, criarPonto(5, populacao[i][0], c.f(populacao[i]), c.index));
        c.index += 1;
    }
    while (g_funcao.pm.length > 100) g_funcao.pm.shift();

    gAtualizar(g_funcao);
}

//Adiciona pontos da geração atual nos gráficos
function gAddMelhorAtual(indv) {
    //Adiciona, incrementa o x e atualiza
    addPonto(g_melhor, criarPonto(1, c.f(indv)));
    g_melhor.x++;
    gAtualizar(g_melhor);
    //Se não tem comparação, não precisa atualizar
    if (isFinite(c.compMargem)) {
        //Adiciona, incrementa o x e atualiza
        addPonto(g_margemDeErro, criarPonto(2, c.compMargem - c.f(indv)));
        g_margemDeErro.x++;
        gAtualizar(g_margemDeErro);
    }
}

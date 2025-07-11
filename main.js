//VARIÁVEIS GLOBAIS
var executando;
var intervalGeracoes;
//g: grafico, p: pontos, pf: pontos da funcao, pi: pontos chutados, pm: individuos, r: resize
var g_melhor = { g: null, x: 1, p: [], r: 0 };
var g_margemDeErro = { g: null, x: 1, p: [], r: 0 };
var g_funcao = { g: null, pf: [], pi: [], pm: [] };

var c = {
    //Gerações
    nIndv: null,
    _sel: null,
    genesLminGer: [],
    genesLmaxGer: [],
    escape: null,

    //Mutações
    mutBase: null,
    pMutPos: null,
    _mut: null,
    estag: null,
    incMutBase: null,
    tetoMut: null,
    mutLmin: [],
    mutLmax: [],

    //Genética
    nGenes: null,
    listaPCadaGene: [],
    listaPNumGene: [],
    pCat: null,
    _cat: null,
    nMortosCat: null,
    genesLmin: null,
    genesLmax: null,

    //Visualização do Gráfico
    delay: null,
    resize: null,
    nPtsFuncao: null,
    gerVisiveis: null,

    //Gráficos
    compMargem: null,

    //Outros
    f: null,
    pop: [],
    melhorGeral: [],
    estagAtual: 0,
    incAtual: 0,
    geracaoAtual: 0,

    //Logs
    arquivo: "",
};






//On load
function aoCarregarAPagina() {

    //Limpa os campos
    deletarAtributosHTML("melhores", "melhor", "coeficiente_de_mutacao_atual");
    //Altera, no carregamento da página, os campos bloqueados
    atualizarSelectsHTML();

    //Cria os gráficos
    g_melhor.g = new CanvasJS.Chart("g-melhor", {
        zoomEnabled: true,
        title: { text: "Melhor indivíduo" },
        data: [{ type: "line", dataPoints: g_melhor.p }]
    });
    g_margemDeErro.g = new CanvasJS.Chart("g-margem-de-erro", {
        zoomEnabled: true,
        title: { text: "Margem de erro" },
        data: [{ type: "line", dataPoints: g_margemDeErro.p }]
    });
    g_funcao.g = new CanvasJS.Chart("g-funcao", {
        zoomEnabled: true,
        title: { text: "Função" },
        data: [{
            type: "line",
            color: "black",
            markerSize: 1,
            thickness: 0,
            dataPoints: g_funcao.pf,
        }, {
            type: "scatter",
            color: "red",
            markerSize: 7,
            dataPoints: g_funcao.pi,
        }, {
            type: "scatter",
            color: "blue",
            markerSize: 4,
            dataPoints: g_funcao.pm,
        }],
        axisX: {
            stripLines: [
                {
                    value: 0,
                    color: "yellow",
                    thickness: 1
                }
            ]
        }
    });

    //Renderiza os gráficos
    atualizarGraficos(g_melhor, g_margemDeErro, g_funcao);

    //Seta texto-modelo da função
    setarAtributoHTML("funcao", `let x = p[0];

let term1 = Math.sin(x * 0.5) * Math.cos(x * 1.3);
let term2 = Math.sin(x * 2) * Math.sin(x * 0.7);
let term3 = Math.cos(x * 3.3 + Math.sin(x * 0.2));
let term4 = Math.exp(-Math.abs(x) / 50) * Math.sin(x * 5);
let term5 = 0.2 * Math.sin(x) * Math.cos(x * 4) * Math.sin(x * 0.1);

return term1 + term2 + term3 + term4 + term5;`)
}


function executar() {
    //Para a repetição passada
    if (executando) clearInterval(intervalGeracoes);
    executando = true;

    //Armazena os valores dos inputs na variável global "c"
    obterParametros();
    //Verifica se os valores são válidos
    if (!verificarParametros()) {
        executando = false;
        return;
    }
    //Adiciona os parâmetros no arquivo
    addTextoInicialDoArquivo();

    //Reseta os gráficos e plota a função
    resetarGraficos();
    plotarFuncao();
    //Limpa os campos
    setarAtributoHTML("coeficiente_de_mutacao_atual", c.mutBase);
    deletarAtributosHTML("melhor", "melhores");


    //Geração inicial
    c.pop = gerarPopulacao(0, c.nIndv);
    addNoArquivo("\nGERAÇÃO INICIAL:\n" + c.pop + "\n\n");


    //Atualiza texto
    setarAtributoNasClassesHTML("botao-pausa", "Pausar", "innerHTML");
    //Executa as gerações
    executarGeracoes();
}

//Executa em loop
function executarGeracoes() {
    executando = true;
    intervalGeracoes = setInterval(() => {
        executarGeracao();
    }, c.delay);
}
//Executa uma geração
function executarGeracao() {
    //Se não executou nem uma única vez, para
    if (c.nIndv === null) return;

    //Aumenta a geração atual
    c.geracaoAtual++;
    addNoArquivo("\n\n\n--------------------------------------------------\n");
    addNoArquivo("GERAÇÃO NÚMERO " + c.geracaoAtual + ".\n");

    //AVALIAÇÃO
    let I = melhorIndividuoDaPopulacao(c.pop);
    addNoArquivo(`MELHOR INDIVÍDUO DA GERAÇÃO:\n\tx: ${c.pop[I]}\n\tf(x): ${c.f(c.pop[I])}\n`);

    //Se o melhor atual é igual ao melhor geral
    if (c.f(c.pop[I]) === c.f(c.melhorGeral) && ["_mut_acu", "_mut_acl"].includes(c._mut)) {
        c.estagAtual++;
        //Loga
        addNoArquivo(`Estagnação aumentada: De ${c.estagAtual - 1} para ${c.estagAtual}.\n`);
        //Mas se encontrou um novo melhor
    } else if (c.f(c.pop[I]) > c.f(c.melhorGeral)) {
        c.melhorGeral = c.pop[I];
        addNoArquivo(`O MELHOR INDIVÍDUO DESSA GERAÇÃO É O MELHOR JÁ ENCONTRADO.\n`);
        //Adiciona no gráfico da função
        addNovoMelhorNaFuncao(c.pop[I]);
        //Reseta o coeficiente
        if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncrementoDaMutacaoAtual(true);
    }

    //Impressão
    setarAtributoHTML("melhor", `GEN: ${c.geracaoAtual.toString().padStart(5, 0)}, g: ${c.pop[I]}, f(g): ${c.f(c.pop[I])}\n`);
    addNoArquivo(`\nINDIVÍDUOS DA GERAÇÃO ATUAL:\n`)
    for (let i = 0; i < c.pop.length; i++) {
        addNoArquivo(`INDIVÍDUO ${i}:\n\tx: ${c.pop[i]}\n\tf(x): ${c.f(c.pop[i])}\n`);
    }
    //Atualização do gráfico
    addIndividuosNaFuncao(c.pop);
    addMelhorAtualNosGraficos(c.pop[I]);

    //ALTERAÇÃO
    //Catástrofe
    if (escolherZeroUm(c.pCat)) {
        //Reseta o incremento atual e faz a catástrofe
        if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncrementoDaMutacaoAtual(true);
        c.pop = realizarCatastrofe(c._cat, c.pop);
        return;
    }
    //Se atingiu a estagnação, reseta e incrementa a mutação
    if (c.estagAtual >= c.estag && ["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncrementoDaMutacaoAtual(false);


    //SELEÇÃO
    c.pop = realizarSelecao(c._sel, c.pop);
}




//Para a execução
function pausarExecucao() {
    //Se estava executando antes, para
    if (executando === true) {
        executando = false;
        clearInterval(intervalGeracoes);
        //Atualiza texto
        setarAtributoNasClassesHTML("botao-pausa", "Continuar", "innerHTML");
        //Senão, conitnua
    } else if (executando === false) {
        executando = true;
        //Atualiza texto
        setarAtributoNasClassesHTML("botao-pausa", "Pausar", "innerHTML");
        executarGeracoes();
    }
};

//Baixa o arquivo de logs
function baixarArquivo() {

    if (!confirm(`O arquivo de logs contém:
- Todos os parâmetros iniciais, inclusive a função
- Todos os indivíduos de todas as gerações, com seus genes
- Informações sobre todos os cruzamentos e mutações
A depender do número de gerações que já foram executadas, o arquivo das logs pode ser bem grande.
Deseja continuar?`)) return;

    let arquivoBlob = new Blob([c.arquivo], { type: "text/plain" });
    let elementoA = document.createElement("a");
    elementoA.download = "Logs.txt";
    elementoA.href = URL.createObjectURL(arquivoBlob);
    elementoA.click();
}
//Redimensiona o gráfico da função para preencher toda a tela
function zoomDaFuncao() {
    //Ativa o fundo preto e os botões
    document.getElementById("fundo-preto").style.setProperty("visibility", "visible");
    document.getElementById("botoes-zoom").style.setProperty("visibility", "visible");
    //Reposiciona o gráfico
    let divFuncao = document.getElementById("g-funcao");
    divFuncao.style.setProperty("position", "fixed");
    divFuncao.style.setProperty("top", "22.5vh");
    divFuncao.style.setProperty("left", "5vw");
    divFuncao.style.setProperty("width", "90vw");
    divFuncao.style.setProperty("height", "45vh");
    divFuncao.style.setProperty("z-index", "1");
    //Atualiza
    atualizarGraficos(g_funcao);
}
//Refaz as mudanças feitas pelo zoom
function unzoomDaFuncao() {
    //Esconde o fundo preto e os botões
    document.getElementById("fundo-preto").style.setProperty("visibility", "hidden");
    document.getElementById("botoes-zoom").style.setProperty("visibility", "hidden");
    //Reposiciona o gráfico
    let divFuncao = document.getElementById("g-funcao");
    divFuncao.style.removeProperty("position");
    divFuncao.style.removeProperty("top");
    divFuncao.style.removeProperty("left");
    divFuncao.style.removeProperty("width");
    divFuncao.style.removeProperty("height");
    divFuncao.style.removeProperty("z-index");
    //Atualiza
    atualizarGraficos(g_funcao);
}

//VARIÁVEIS GLOBAIS
var executando;
var geracoes;
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
function init() {

    //Limpa os campos
    delAtrs("logs", "output", "coeficiente_de_mutacao_atual");
    //Altera, no carregamento da página, os campos bloqueados
    atualizarSelect();

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
            markerSize: 5,
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
    gAtualizar(g_melhor, g_margemDeErro, g_funcao);
}




function executar(executarDoComeco) {
    if (executarDoComeco) preExecutar(false);
    else if (c.geracaoAtual === 0 && executando === false) {
        preExecutar(true);
    } else {
        executarGeracao();
    }
}

function preExecutar(executarUm) {
    //Para a repetição passada
    if (executando) clearInterval(geracoes);
    executando = true;

    //Armazena os valores dos inputs na variável global "c"
    setarCampos();
    //Verifica se os valores são válidos
    if (!verificarCampos()) {
        executando = false;
        return;
    }
    //Adiciona os parâmetros no arquivo
    adicionarCamposNoArquivo();

    //Reseta os gráficos e plota a função
    gResetar();
    gPlotarFuncao();
    //Limpa os campos
    setAtr("coeficiente_de_mutacao_atual", c.mutBase);
    delAtrs("output", "logs");


    //Geração inicial
    c.pop = gerarPop(0, c.nIndv);
    adicionarNoArquivo("\nGERAÇÃO INICIAL:\n" + c.pop + "\n\n");


    //Atualiza texto
    setAtr("$pausar1", "Pausar", "innerHTML");
    setAtr("$pausar2", "Pausar", "innerHTML");

    if (executarUm) executarGeracao();
    else executarGeracoes();
}

//Executa em loop
function executarGeracoes() {
    executando = true;
    geracoes = setInterval(() => {
        executarGeracao();
    }, c.delay);
}
//Executa uma geração
function executarGeracao() {
    //Aumenta a geração atual
    c.geracaoAtual++;
    adicionarNoArquivo("\n\n\n--------------------------------------------------\n");
    adicionarNoArquivo("GERAÇÃO NÚMERO " + c.geracaoAtual + ".\n");

    //AVALIAÇÃO
    let I = melhorIndv(c.pop);
    adicionarNoArquivo(`MELHOR INDIVÍDUO DA GERAÇÃO:\n\tx: ${c.pop[I]}\n\tf(x): ${c.f(c.pop[I])}\n`);

    //Se o melhor atual é igual ao melhor geral
    if (c.f(c.pop[I]) === c.f(c.melhorGeral) && ["_mut_acu", "_mut_acl"].includes(c._mut)) {
        c.estagAtual++;
        //Loga
        adicionarNoArquivo(`Estagnação aumentada: De ${c.estagAtual - 1} para ${c.estagAtual}.\n`);
        //Mas se encontrou um novo melhor
    } else if (c.f(c.pop[I]) > c.f(c.melhorGeral)) {
        c.melhorGeral = c.pop[I];
        adicionarNoArquivo(`O MELHOR INDIVÍDUO DESSA GERAÇÃO É O MELHOR JÁ ENCONTRADO.\n`);
        //Adiciona no gráfico da função
        gAddNovoMelhor(c.pop[I]);
        //Reseta o coeficiente
        if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncAtual(true);
    }

    //Impressão
    setAtr("output", `GEN: ${c.geracaoAtual.toString().padStart(5, 0)}, g: ${c.pop[I]}, f(g): ${c.f(c.pop[I])}\n`);
    adicionarNoArquivo(`\nINDIVÍDUOS DA GERAÇÃO ATUAL:\n`)
    for (let i = 0; i < c.pop.length; i++) {
        adicionarNoArquivo(`INDIVÍDUO ${i}:\n\tx: ${c.pop[i]}\n\tf(x): ${c.f(c.pop[i])}\n`);
    }
    //Atualização do gráfico
    gAddIndividuos(c.pop);
    gAddMelhorAtual(c.pop[I]);

    //ALTERAÇÃO
    //Catástrofe
    if (zeroUm(c.pCat)) {
        //Reseta o incremento atual e faz a catástrofe
        if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncAtual(true);
        c.pop = catastrofe(c._cat, c.pop);
        return;
    }
    //Se atingiu a estagnação, reseta e incrementa a mutação
    if (c.estagAtual >= c.estag && ["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncAtual(false);


    //SELEÇÃO
    c.pop = selecionar(c._sel, c.pop);
}




//Para a execução
function pausar() {
    //Se estava executando antes, para
    if (executando === true) {
        executando = false;
        clearInterval(geracoes);
        //Atualiza texto
        setAtr("$pausar1", "Continuar", "innerHTML");
        setAtr("$pausar2", "Continuar", "innerHTML");
        //Senão, conitnua
    } else if (executando === false) {
        executando = true;
        //Atualiza texto
        setAtr("$pausar1", "Pausar", "innerHTML");
        setAtr("$pausar2", "Pausar", "innerHTML");
        executarGeracoes();
    }
};

function baixarArquivo() {
    let arquivoBlob = new Blob([c.arquivo], { type: "text/plain" });
    let elementoA = document.createElement("a");
    elementoA.download = "Logs.txt";
    elementoA.href = URL.createObjectURL(arquivoBlob);
    elementoA.click();
}

function zoom() {

    document.getElementById("fundo-preto").style.setProperty("visibility", "visible");
    document.getElementById("botoes-zoom").style.setProperty("visibility", "visible");

    let divFuncao = document.getElementById("g-funcao");
    divFuncao.style.setProperty("position", "fixed");
    divFuncao.style.setProperty("top", "22.5vh");
    divFuncao.style.setProperty("left", "5vw");
    divFuncao.style.setProperty("width", "90vw");
    divFuncao.style.setProperty("height", "45vh");
    divFuncao.style.setProperty("z-index", "1");
    gAtualizar(g_funcao);
}

function unzoom() {
    document.getElementById("fundo-preto").style.setProperty("visibility", "hidden");
    document.getElementById("botoes-zoom").style.setProperty("visibility", "hidden");

    let divFuncao = document.getElementById("g-funcao");
    divFuncao.style.removeProperty("position");
    divFuncao.style.removeProperty("top");
    divFuncao.style.removeProperty("left");
    divFuncao.style.removeProperty("width");
    divFuncao.style.removeProperty("height");
    divFuncao.style.removeProperty("z-index");
    gAtualizar(g_funcao);
}

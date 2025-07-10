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
};






//On load
function init() {

    //Limpa os campos
    delAtrs("$logs", "$output", "$coeficiente_de_mutacao_atual");
    //Altera, no carregamento da página, os campos bloqueados
    atualizarSelect();

    //Cria os gráficos
    g_melhor.g = new CanvasJS.Chart("g-melhor", {
        zoomEnabled: true,
        title: { text: "Melhor indivíduo" },
        data: [{
            type: "line",
            dataPoints: g_melhor.p
        }]
    });
    g_margemDeErro.g = new CanvasJS.Chart("g-margem-de-erro", {
        zoomEnabled: true,
        title: { text: "Margem de erro" },
        data: [{
            type: "line",
            dataPoints: g_margemDeErro.p
        }]
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








function executar() {
    //Para a repetição passada
    if (executando) clearInterval(geracoes);
    executando = true;


    //Armazena os valores dos inputs na variável global "c"
    setarCampos();
    //Reseta os gráficos e plota a função
    gResetar();
    gPlotarFuncao();
    //Limpa os campos
    setAtr("$coeficiente_de_mutacao_atual", c.mutBase);
    delAtrs("$output", "$logs");


    //Geração inicial
    c.pop = gerarPop(0, c.nIndv);
    //Gerações

    //Atualiza texto
    setAtr("$pausar", "Pausar", "innerHTML");
    loop();
}


//Geração de gerações
function loop() {
    geracoes = setInterval(() => {
        //Aumenta a geração atual
        c.geracaoAtual++;

        //AVALIAÇÃO
        let I = melhorIndv(c.pop);

        //Se o melhor atual é igual ao melhor geral
        if (c.f(c.pop[I]) === c.f(c.melhorGeral) && ["_mut_acu", "_mut_acl"].includes(c._mut)) c.estagAtual++;
        //Mas se encontrou um novo melhor
        else if (c.f(c.pop[I]) > c.f(c.melhorGeral)) {
            c.melhorGeral = c.pop[I];
            //Adiciona no gráfico da função
            gAddNovoMelhor(c.pop[I]);
            //Reseta o coeficiente
            if (["_mut_acu", "_mut_acl"].includes(c._mut)) alterarIncAtual(true);
        }

        //Impressão
        setAtr("$output", `GEN: ${c.geracaoAtual.toString().padStart(5, 0)}, g: ${c.pop[I]}, f(g): ${c.f(c.pop[I])}\n`);
        //Atualização do gráfico
        //gAddIndividuos(c.pop);
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

    }, c.delay);
}




//Para a execução
function pausar() {
    //Se estava executando antes, para
    if (executando === true) {
        executando = false;
        clearInterval(geracoes);
        //Atualiza texto
        setAtr("$pausar", "Continuar", "innerHTML");
    } else if (executando === false) {
        executando = true;
        //Atualiza texto
        setAtr("$pausar", "Pausar", "innerHTML");
        loop();
    }
};


/// vars
const seq = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto', 'setimo','oitavo']
const mesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 
                  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const summaryUrl = 'https://api.covid19api.com/summary'
const baseUrl = 'https://api.covid19api.com/country/brazil'

// FUNCOES PARA TRATAR E APLICAR OS DADOS
var array = []
var x = []
var y = []
var casos = []
var mostrarpais = []

    // rgb em seq com os cards
var cor = ['rgb(60, 143, 60)','rgb(0, 123, 255)','rgb(108, 117, 125)','rgb(255, 193, 7)',
'rgb(52, 58, 64)','rgb(220, 53, 69)','rgb(23, 162, 184)']
var id = ''
var found, index, card, obj, remover = ['primeiro'], iniciocontagem = 1000

// FUNCOES PARA CARREGAR OS DADOS
var tmp, tmp2, tmp3, tmp4, tmp5
var url, countryCards = 8, diasmm = 15


//const dailyCountries = ['brazil','italy','spain','india']
    //const casosUrl = '/status/confirmed'
    //const mortesUrl = '/status/deaths'
var newObj = []
var graficoData = []





/// Helper functions
async function fetchApi(endpoint) {
    const res = await axios.get(endpoint)
    const data = res.data
    return data
}

function topCasos(dados,n) { // fixado n = 8
    let newArray = []
    dados.forEach(function(obj) {
            newArray.push(obj)
            if (newArray.length > n) {
                newArray.sort(function(a, b) { return b.TotalConfirmed - a.TotalConfirmed })
                newArray.pop()
            }
        })
    for(let i=0; i<newArray.length; i++) {
        newArray[i]['order'] = seq[i]
    }
    return newArray
}

function addLetal(obj) {
    obj['letal'] = (obj.TotalDeaths / obj.TotalConfirmed * 100).toFixed(2) + '%'
    return obj
}

function showCard(array) {
    array.forEach(obj => {
        obj = addLetal(obj)
        //console.log(obj)
        card = document.getElementById(obj.order)
        card.textContent = obj.Country

        card = document.getElementById(obj.order + 'casos')
        card.className += "float-right";
        card.textContent = obj.TotalConfirmed.toLocaleString()
        card = document.getElementById(obj.order + 'mortes')
        card.className += "float-right";
        card.textContent = obj.TotalDeaths.toLocaleString()
        card = document.getElementById(obj.order + 'letal')
        card.className += "float-right";
        card.textContent = obj.letal
    })
}

function dateFormat(date) {
    return date.slice(0,10)
}

function clean(array,itemsToKeep = 0) { // editing...
    let newArray = [];
    array.forEach(obj => {
        newArray.push(
            {
                'Confirmed' : obj.Confirmed,
                'Deaths'    : obj.Deaths,
                'Date'      : dateFormat(obj.Date)
            }
            )       
    })
    // add country name
    newArray[0]['Country'] = array[0].Country
    return newArray
}

function prepTrace(array, eixoX, index) {
    //console.log(array)
    if(!(eixoX == 'Dia' | eixoX == 'Data')) return `o Eixo de 'X' = ${eixoX} é uma informacao inválida, opções: {'Dia' ou 'Data'}`
    let dia
    let trace = {
        x: [], //'Array com data ou dias'
        y: [], //'Array com casos'
        mode: 'lines',
        name: array[0].Country,
        line: { color: cor[index], width: 3 }
    }
    if (eixoX == 'Dia') {
        //saida = depoisNcaso(dadosG, iniciocontagem)
        dia = 1
        //iniciocontagem = 1 // comentado para ser inicio contagem geral
        array.forEach(obj => {
            if(obj.Confirmed > iniciocontagem) {
                trace.x.push(dia++)
                trace.y.push(obj.Confirmed)
            }
        })
    }
    if (eixoX === 'Data') {
        array.forEach(obj => {
            if(obj.Date >= '2020-03-15'){  // fixei os dados a partir de 15 de março
                trace.x.push(obj.Date)
                trace.y.push(obj.Confirmed)
            }
        })
    }
    return trace
}

function toDaily(array) {
    let day, dayberfore, newArray = []
    newArray.push(array[0])
    for(var i=1; i < array.length ; i++) {
        day = array[i].Confirmed
        dayberfore = array[i-1].Confirmed
        newArray.push({ 'Confirmed' : array[i].Confirmed - array[i-1].Confirmed,
                        'Date'      : array[i].Date})
    }
    return newArray
}

function MA(array) {
    /// editar somente o array.y
    /// media movel de 7 dias
    /// pegar length (> 7)
    /// vou precisar de alguns testes
    // 1 ideia
    // fazer de extremo e testar NA ou 0 no inicio
    return newArray
}

/// End of Helper functions


///   ----  ACTIVITY FUNCTIONS   ----

// Grafico de casos diarios
function dailyPlot(data) {
    // dados vem acumulados, passar para dados diarios
    data = toDaily(data)
    
    let newArray = []
    newArray.push(prepTrace(data, 'Data', 3))
    // mean average
    // let newArray2 = []
    //newArray2.push(prepTrace(data, 'Data', 4))
    //let ma = MA(newarray);
    
    var layout = {
        title: `Casos diários da Pandemia de COVID-19 no Brasil a partir de 15 de Março de 2020`,
        annotations: [
          {
            xref: 'paper',
            yref: 'paper',
            x: 50,
            y: -10,
            xanchor: 'center',
            yanchor: 'top',
            text: 'Source: Pew Research Center & Storytelling with data',
            showarrow: false,
            font: {
              family: 'Arial',
              size: 12,
              color: 'rgb(150,150,150)'
            }
          }
        ]
      };

    Plotly.newPlot(document.getElementById('tester1'), newArray, layout);
}


/// Funcao principal
async function main() {
    let response, data, graficoData = [], CardsInfo = []

    response = await fetchApi(summaryUrl)
    // filtrar top 8 em casos e aribuir ordem
    let CountriesInfo = topCasos(response.Countries,n = countryCards)
    CardsInfo.push(...CountriesInfo)
    
    //showCard() printar cards
    showCard(CardsInfo) // 8 paises com mais casos
    
    // -------------------// EXTRA TEST//-----------------------  //
    // treino com grafico: Brasil - casos diarios
    data = await fetchApi(baseUrl)
    data = clean(data)
    dailyPlot(data)
    // -------------------// EXTRA TEST//-----------------------  //


    // Carregar dados do grafico de forma lenta
    //data = await dadosGrafico(CountriesInfo)
    
    /// 4 Graficos: 
    // Casos acumulados nos 7 paises por data
    
    //fullPlot(data) 
    // Country, Confirmed, Date

    // Casos acumulados nos 7 paises a partir de 1000 casos acumulados
    //comparedPlot(data)

    // Casos diarios nos 7 paises por data
    // Mortes diarias nos 7 paises por data

}
 
// chamada de funcoes ao iniciar
function eventos() {
    tmp = setTimeout(main, 100);
};

window.addEventListener("load", eventos);


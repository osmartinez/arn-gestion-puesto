let intervaloAlertaVisual = null

function encenderAlertaVisual(errorMsg) {
    if (intervaloAlertaVisual != null) {
        clearInterval(intervaloAlertaVisual)
    }
    let ofs = 0
    error(errorMsg)
    intervaloAlertaVisual = setInterval(function () {
        $('#panel-central').css('background', 'rgba(255,0,0,' + Math.abs(Math.sin(ofs)) + ')');
        ofs += 0.03;
    }, 10);
}

function apagarAlertaVisual() {
    if (intervaloAlertaVisual != null) {
        clearInterval(intervaloAlertaVisual)
        $('#panel-central').css('background', '');
        info('Solucionado')
    }
}

/*const chartOptions = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: false,
    },
    elements: {
        point: {
            radius: 0
        },
    },
    scales: {
        xAxes: [{
            gridLines: false,
            scaleLabel: false,
            ticks: {
                display: false
            }
        }],
        yAxes: [{
            gridLines: false,
            scaleLabel: false,
            ticks: {
                display: false,
                suggestedMin: 0,
                suggestedMax: 10
            }
        }]
    }
};
//
var ctx = document.getElementById('chart1').getContext('2d');
var chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [1, 2, 1, 3, 5, 4, 7],
        datasets: [
            {
                backgroundColor: "rgba(101, 116, 205, 0.1)",
                borderColor: "rgba(101, 116, 205, 0.8)",
                borderWidth: 2,
                data: [1, 2, 1, 3, 5, 4, 7],
            },
        ],
    },
    options: chartOptions
});
//
var ctx = document.getElementById('chart2').getContext('2d');
var chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [2, 3, 2, 9, 7, 7, 4],
        datasets: [
            {
                backgroundColor: "rgba(246, 109, 155, 0.1)",
                borderColor: "rgba(246, 109, 155, 0.8)",
                borderWidth: 2,
                data: [2, 3, 2, 9, 7, 7, 4],
            },
        ],
    },
    options: chartOptions
});
//
var ctx = document.getElementById('chart3').getContext('2d');
var chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [2, 5, 1, 3, 2, 6, 7],
        datasets: [
            {
                backgroundColor: "rgba(246, 153, 63, 0.1)",
                borderColor: "rgba(246, 153, 63, 0.8)",
                borderWidth: 2,
                data: [2, 5, 1, 3, 2, 6, 7],
            },
        ],
    },
    options: chartOptions
});*/
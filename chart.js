const API_URL = "https://script.google.com/macros/s/AKfycbyoBM6ECZIVWoYhglWXLycjDvISC2YRsNJ9dqgEAsfTVCnaukI0a1sA9TDYJnlxNvNQ/exec";
const WINDOW_SIZE = 30;
const REFRESH_MS = 5000;

let rawData = [];
let startIndex = 0;
let chart;
let isViewingHistory = false;

async function fetchData() {
  const res = await fetch(API_URL);
  const newData = await res.json();

  // simpan data terbaru TANPA mengubah tampilan
  rawData = newData;

  // kalau sedang LIVE → auto geser ke data terbaru
  if (!isViewingHistory) {
    startIndex = Math.max(0, rawData.length - WINDOW_SIZE);
  }
}

function getWindowData() {
  return rawData.slice(startIndex, startIndex + WINDOW_SIZE);
}

function renderChart() {
  const windowData = getWindowData();

  const labels = windowData.map(d =>
    new Date(d.timestamp).toLocaleTimeString('id-ID', {
      hour12: false
    })
  );

  const values = [
    windowData.map(d => d.voltAB),
    windowData.map(d => d.voltBC),
    windowData.map(d => d.voltCA),
    windowData.map(d => d.currentA),
    windowData.map(d => d.currentB),
    windowData.map(d => d.currentC),
    windowData.map(d => d.setPointFreq),
    windowData.map(d => d.actFreq),
    windowData.map(d => d.intakePress),
    windowData.map(d => d.intakeTemp),
    windowData.map(d => d.dischargePress),
    windowData.map(d => d.dischargeTemp)
  ];

  if (!chart) {
    chart = new Chart(document.getElementById("chart"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Volt AB", data: values[0] },
          { label: "Volt BC", data: values[1] },
          { label: "Volt CA", data: values[2] },
          { label: "Current A", data: values[3] },
          { label: "Current B", data: values[4] },
          { label: "Current C", data: values[5] },
          { label: "SetPoint Freq", data: values[6] },
          { label: "Act Freq", data: values[7] },
          { label: "Intake Press", data: values[8] },
          { label: "Intake Temp", data: values[9] },
          { label: "Discharge Press", data: values[10] },
          { label: "Discharge Temp", data: values[11] },
        ]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,   // ← INI PENTING
          
        interaction: {
          mode: 'index',     // ← ini penting
          intersect: false   // ← ini penting
        },

        plugins: {
          legend: {
            position: 'none',
            labels: {
              boxWidth: 12,
              padding: 15,
              font: {
                size: 10   // ← ubah ukuran di sini
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
            // title: { display: true, text: "Voltage" }
          }
        }
      }
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values[0];
    chart.data.datasets[1].data = values[1];
    chart.data.datasets[2].data = values[2];
    chart.data.datasets[3].data = values[3];
    chart.data.datasets[4].data = values[4];
    chart.data.datasets[5].data = values[5];
    chart.data.datasets[6].data = values[6];
    chart.data.datasets[7].data = values[7];
    chart.data.datasets[8].data = values[8];
    chart.data.datasets[9].data = values[9];
    chart.data.datasets[10].data = values[10];
    chart.data.datasets[11].data = values[11];
    chart.update("none");
  }
}

function moveLeft() {
  isViewingHistory = true;
  startIndex = Math.max(0, startIndex - WINDOW_SIZE);
  document.getElementById("status").innerText = "HISTORY";
  renderChart();
}

function moveRight() {
  startIndex = Math.min(
    rawData.length - WINDOW_SIZE,
    startIndex + WINDOW_SIZE
  );

  // kalau sudah mentok kanan → balik LIVE
  if (startIndex >= rawData.length - WINDOW_SIZE) {
    isViewingHistory = false;
    document.getElementById("status").innerText = "LIVE";
    startIndex = Math.max(0, rawData.length - WINDOW_SIZE);
  }

  renderChart();
}

async function refresh() {
  await fetchData();

  // render ulang HANYA kalau LIVE
  if (!isViewingHistory) {
    renderChart();
  }
}

// INIT
(async () => {
  await fetchData();
  renderChart();
  setInterval(refresh, REFRESH_MS);

})();

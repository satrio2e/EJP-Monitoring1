console.log(Paho);

const mqttText = document.getElementById('mqttText');

/* ======================
   TOPIC LIST
====================== */
const topics = [
  'Mitra/Epsindo/Pump1/Tes1/StatusReady',
  'Mitra/Epsindo/Pump1/Tes1/StatusRun',
  'Mitra/Epsindo/Pump1/Tes1/StatusFault',
  'Mitra/Epsindo/Pump1/Tes1/VoltAB',
  'Mitra/Epsindo/Pump1/Tes1/VoltBC',
  'Mitra/Epsindo/Pump1/Tes1/VoltCA',
  'Mitra/Epsindo/Pump1/Tes1/CurrentA',
  'Mitra/Epsindo/Pump1/Tes1/CurrentB',
  'Mitra/Epsindo/Pump1/Tes1/CurrentC',
  'Mitra/Epsindo/Pump1/Tes1/SetPointFreq',
  'Mitra/Epsindo/Pump1/Tes1/ActFreq',
  'Mitra/Epsindo/Pump1/Tes1/IntakePress',
  'Mitra/Epsindo/Pump1/Tes1/IntakeTemp',
  'Mitra/Epsindo/Pump1/Tes1/DischargePress',
  'Mitra/Epsindo/Pump1/Tes1/DischargeTemp'
];

/* ======================
   MQTT CLIENT
====================== */
let client;

if (Paho.Client) {
  console.log("Pakai Paho.Client");
  client = new Paho.Client(
    "broker.hivemq.com",
    8884,
    "/mqtt",
    "web_" + Math.random()
  );
} else {
  console.log("Pakai Paho.MQTT.Client");
  client = new Paho.MQTT.Client(
    "broker.hivemq.com",
    8884,
    "/mqtt",
    "web_" + Math.random()
  );
}

/* ======================
   CONNECTION LOST
====================== */
// client.onConnectionLost = res => {
//   console.error("MQTT Lost:", res.errorMessage);
//   mqttText.innerText = "DISCONNECTED";
//   mqttText.className = "mqtt-off";
// };

/* ======================
   MESSAGE HANDLER
====================== */
client.onMessageArrived = msg => {
  //  console.log("TOPIC MASUK:", msg.destinationName);
  // console.log("PAYLOAD:", msg.payloadString);

  const topic = msg.destinationName;
  const value = Number(msg.payloadString.trim());

  switch (topic) {

    case 'Mitra/Epsindo/Pump1/Tes1/StatusReady': {
      const el = document.getElementById('statusCircleReady');
      const isOn = Number(value) === 1;

      el.classList.remove('green', 'gray');
      el.classList.add(isOn ? 'green' : 'gray');
      break;
    }

    case 'Mitra/Epsindo/Pump1/Tes1/StatusRun': {
      const el = document.getElementById('statusCircleRun');
      const isOn = Number(value) === 1;

      el.classList.remove('green', 'gray');
      el.classList.add(isOn ? 'green' : 'gray');
      break;
    }

    case 'Mitra/Epsindo/Pump1/Tes1/StatusFault': {
      const el = document.getElementById('statusCircleFault');
      const isOn = Number(value) === 1;

      el.classList.remove('red', 'gray');
      el.classList.add(isOn ? 'red' : 'gray');
      break;
    }

    case 'Mitra/Epsindo/Pump1/Tes1/SetPointFreq':
      document.getElementById('freqSetVal').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/ActFreq':
      document.getElementById('ActVal').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/NoOfStart':
      document.getElementById('NoOfStart').innerText = value;
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/VoltAB':
      document.getElementById('VoltAB').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/VoltBC':
      document.getElementById('VoltBC').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/VoltCA':
      document.getElementById('VoltCA').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/CurrentA':
      document.getElementById('CurrentA').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/CurrentB':
      document.getElementById('CurrentB').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/CurrentC':
      document.getElementById('CurrentC').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/IntakePress':
      document.getElementById('IntakePress').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/IntakeTemp':
      document.getElementById('IntakeTemp').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/DischargePress':
      document.getElementById('DischargePress').innerText = value.toFixed(2);
      break;

    case 'Mitra/Epsindo/Pump1/Tes1/DischargeTemp':
      document.getElementById('DischargeTemp').innerText = value.toFixed(2);
      break;

  }
};

/* ======================
   CONNECT
====================== */
client.connect({
  useSSL: true,
  timeout: 5,
  onSuccess: () => {
    console.log("MQTT Connected");

    client.subscribe("Mitra/Epsindo/Pump1/Tes1/#", {
      onSuccess: () => console.log("SUBSCRIBE SUCCESS"),
      onFailure: e => console.log("SUBSCRIBE FAILED", e)
    });
  },
  onFailure: err => {
    console.error("MQTT Failed:", err.errorMessage);
  }
});


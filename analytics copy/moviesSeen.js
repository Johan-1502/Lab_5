const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: ".env" });
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

var page = require('http').Server(app);
var io = require('socket.io')(page);

let ipAnalytics = process.env.IP_ANALYTICS;
let portAnalytics = process.env.PORT_ANALYTICS;

const { Kafka } = require("kafkajs");
const { getCurves } = require('crypto');

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
})

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sebas376C',
  database: 'netflix'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL exitosa.');
});

const consumer = kafka.consumer({ groupId: 'test-group' })

io.on('connection', (socket) => {
  logger(' WS ', 'connection    ', 'El front del coordinador se ha conectado con Sockets');
  socket.on('getUserInfo', (data) => {
    getUser(data);
  });
});

const runConsumer = async () => {

  await consumer.connect()
  await consumer.subscribe({ topic: 'user-location-updates', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let textMessage = message.value.toString();
      let object = JSON.parse(textMessage);
      saveUser(object);
    },
  })
}

runConsumer()
  .then(() => {
    console.log('Consumer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka consumer', error);
  });

function getUser(nameUser) {
  const query = 'SELECT * FROM users WHERE nameUser = ?';

  db.query(query, [nameUser], (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return;
    }
    io.emit('userInfo', results);
    console.log("Se enviaron los datos del usuario con exito")
  });
}

function saveUser(dataUser) {
  const queryAddVehicle = 'INSERT INTO Users (nameUser, movie, dateSeen) VALUES (?, ?, ?)';
  db.query(queryAddVehicle, [dataUser.nameUser, dataUser.movie, dataUser.dateSeen], (err, vehicleResult) => {
    if (err) {
      console.error('Error al registrar los datos del usuario', err);
      return;
    }
    console.log("Usuario registrado correctamente")
  });
}

function logger(protocol, endpoint, message) {
  let log = `${new Date(Date.now()).toLocaleTimeString()} | ${protocol} | ${endpoint} | ${message}`;
  console.log(log);
};

page.listen(portAnalytics, function () {
  logger('HTTP', 'Listen', `Servidor escuchando en http://${ipAnalytics}:${portAnalytics}`);
});

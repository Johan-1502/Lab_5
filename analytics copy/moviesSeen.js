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

let movies = [];

const { Kafka } = require("kafkajs")

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
  // Ordenar el arreglo de mayor a menor y obtener los 10 mayores
  let topTen = movies.sort((a, b) => b.counter - a.counter)
    .slice(0, 10);
  io.emit('moviesList', topTen);
});

function addVisit(name) {
  if (movies.length > 0) {
    const movieFound = movies.find(movie => movie.movieName === name);
    if (movieFound) {
      movieFound.counter++;
    } else {
      movies.push({ movieName: name, counter: 1 })
    }
  } else {
    movies.push({ movieName: name, counter: 1 })
  }
}

const runConsumer = async () => {

  await consumer.connect()
  await consumer.subscribe({ topic: 'user-location-updates', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let textMessage = message.value.toString();
      let object = JSON.parse(textMessage);
      let testObject = { name: object.movie };
      addVisit(object.movie);
      let topTen = movies.sort((a, b) => b.counter - a.counter)
        .slice(0, 10);
      getUser("sebas");
      
      // console.log(movies);
      // console.log(topTen);
      // console.log(object.name)
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
      return res.status(500).json({ success: false, message: 'Error interno de la base de datos' });
    }
    io.emit('userInfo', results);
    console.log(results)
  });
}

function logger(protocol, endpoint, message) {
  let log = `${new Date(Date.now()).toLocaleTimeString()} | ${protocol} | ${endpoint} | ${message}`;
  console.log(log);
};

page.listen(portAnalytics, function () {
  logger('HTTP', 'Listen', `Servidor escuchando en http://${ipAnalytics}:${portAnalytics}`);
});

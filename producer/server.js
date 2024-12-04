const express = require("express")
const app = express()
const cors = require('cors');
require('dotenv').config({ path: ".env" });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let ip = process.env.IP_PRODUCER;
let port = process.env.PORT_PRODUCER;

const { Kafka } = require("kafkajs")

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
})

const producer = kafka.producer()


app.post('/newVisit', async (req, res) => {
  let data = req.body;
  console.log(data);
  try {
    await producer.connect();
    await producer.send({
      topic: "user-location-updates",
      messages: [{value: `{"name":"${data.name}", "movie":"${data.movie}", "age":${data.age}, "mail":"${data.email}"}`}],
    });
    await producer.disconnect();
  } catch (error) {
    console.error('Error in Kafka operation:', error);
    res.status(500).send('Internal Server Error');
  }
  res.send({answer:'OK'})
  logger('HTTP', 'newVisit', `${data.name} Vió la pelicula: ${data.movie}`)
});

function logger(protocol, endpoint, message) {
  let log = `${new Date(Date.now()).toLocaleTimeString()} | ${protocol} | ${endpoint} | ${message}`;
  console.log(log);
};

app.listen(port, () => {
  console.log(`Servidor escuchando en http://${ip}:${port}`)
})
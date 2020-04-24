const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.use(cors())
app.use(bodyParser.json());


const uri = process.env.DB_PATH;


let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get("/products", (req, res) => {

  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect(err => {

    const collection = client.db("store").collection("products");

    collection.find().limit(10).toArray((err, documents) => {
      if (err) {
        res.status(400).send({ message: err })
      } else {

        res.send(documents);
      }

    });
    console.log("Database connected...");
    client.close();
  });
})

app.post("/addProduct", (req, res) => {
  const product = req.body;
  console.log(product)
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("store").collection("products");

    collection.insertOne(product, (err, result) => {
      if (err) {
        res.status(500).send({ message: err })
      } else {
        console.log("successfully inserted", result);
        const one = result.ops[0];
        res.send(one);
      }

    });
    console.log("Database connected...");
    client.close();
  });


})

const port = process.env.PORT || 7000;
app.listen(port, () => console.log("Listening Port 4200"));
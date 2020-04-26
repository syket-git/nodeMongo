const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.use(cors())
app.use(bodyParser.json());


const uri = process.env.DB_PATH;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get("/products", (req, res) => {

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {

    const collection = client.db("store").collection("products");

    collection.find().limit(10).toArray((err, documents) => {
      if (err) {
        res.status(400).send({ message: err })
        console.log(err)
      } else {

        res.send(documents);
        console.log("done")
      }

    });

    //client.close();
  });
})

app.get("/product/:key", (req, res) => {
  const key = req.params.key;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {

    const collection = client.db("store").collection("products");

    collection.find({ key }).toArray((err, documents) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: err })
      } else {
        res.send(documents[0]);
      }
    });

    //client.close();
  });

})


app.post("/getProductKey", (req, res) => {

  const productKeys = req.body
  console.log(productKeys);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {

    const collection = client.db("store").collection("products");

    collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: err })
      } else {
        res.send(documents);
      }
    });

    //client.close();
  });

})




app.post("/addProduct", (req, res) => {
  const product = req.body;
  console.log(product)
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("store").collection("products");

    collection.insert(product, (err, result) => {
      if (err) {
        res.status(500).send({ message: err })
      } else {
        console.log("successfully inserted", result);
        const one = result.ops[0];
      }

    });
    console.log("Database connected...");
    //client.close();
  });


})

app.post("/placeOrder", (req, res) => {
  const orderDetails = req.body;
  orderDetails.orderDate = new Date();
  console.log(orderDetails)
  client.connect(err => {
    const collection = client.db("store").collection("orders");

    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        res.status(500).send({ message: err })
      } else {
        console.log("successfully inserted", result);
      }

    });

    //client.close();
  });


})




const port = process.env.PORT || 4500;

app.listen(port, () => console.log("Listening Port 4200"));
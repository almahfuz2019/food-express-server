const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://foodExpress:l4c9MDDHhHExSMrd@cluster0.jgj4arl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const foodCollection = client.db("FoodExpress").collection("foodItems");
    const tableBookingCollection = client.db("FoodExpress").collection("booking");
    // get api to read all notes
    //http://localhost:4000/items
    app.get("/items", async (req, res) => {
      const q = req.query;
      console.log(q);
      const cursor = foodCollection.find( q);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single data 
      app.get("/items/:id", async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await foodCollection.findOne(filter);
          res.send(result);
        }
      );
        //delete data
        app.delete("/item/:id", async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await foodCollection.deleteOne(filter);
          res.send(result);
        });
        //create
    app.post("/item",async(req, res)=> {
      const data = req.body;
      console.log("from post api", data);
      const result = await foodCollection.insertOne(data);
      res.send(result);
    });
     //update
           
     app.put('/items/:id', async (req, res) => {
      const id = req.params.id;
      const updateMeal = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
            idMeal: updateMeal.idMeal,
            strMeal: updateMeal.strMeal,
            strCategory: updateMeal.strCategory,
            strArea: updateMeal.strArea,
            strMealThumb: updateMeal.strMealThumb,
            strYoutube: updateMeal.strYoutube,
            strYoutube: updateMeal.strInstructions,
          },
      };
      const result = await foodCollection.updateOne(filter, updateDoc, options)
      console.log('updating', id)
      res.json(result)
  })
  // table booking 
     //create
     app.post("/booking",async(req, res)=> {
      const data = req.body;
      console.log("from post api", data);
      const result = await tableBookingCollection.insertOne(data);
      res.send(result);
    });
     // get api to read all notes
    //http://localhost:4000/items
    app.get("/tables", async (req, res) => {
      const q = req.query;
      console.log(q);
      const cursor = tableBookingCollection.find( q);
      const result = await cursor.toArray();
      res.send(result);
    });
        //delete data
        app.delete("/booking/:id", async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await tableBookingCollection.deleteOne(filter);
          res.send(result);
        });
    console.log("connected to db");
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
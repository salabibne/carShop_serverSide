const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

// brandshop
//0Od9LFsYNdCoRPls



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ovwhpk1.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

const brandsCollection = client.db("brandshop").collection("brands")
const cartCollection = client.db("brandshop").collection("cart")


app.get("/", (req, res) => {
    res.send("brand server")
})

app.post("/brands", async(req,res)=>{
    const brands = req.body;
    console.log(brands);
    const result = await brandsCollection.insertOne(brands)
    res.send(result)

})

app.post("/brands/carts", async(req,res)=>{
    const carts = req.body
    console.log(carts);
    const result = await cartCollection.insertOne(carts)
    res.send(result)
})

app.get("/brands/:brand_name",async(req,res)=>{
    const brandName = req.params.brand_name
    console.log(brandName);
    const filter = {brandname: brandName}
    const result = await brandsCollection.find(filter).toArray()
    console.log(result);
    res.send(result)

})

app.get('/brands/details/:id',async(req,res)=>{
    const id = req.params.id;
    console.log(id);
    const filter ={_id : new ObjectId(id)}
    const result = await brandsCollection.findOne(filter)
    res.send(result)
})

app.get('/brands/updates/:id',async(req,res)=>{
    const id = req.params.id;
    console.log(id);
    const filter ={_id : new ObjectId(id)}
    const result = await brandsCollection.findOne(filter)
    res.send(result)
})

app.put('/brands/updates/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:new ObjectId(id)}
    const options = {upsert : true}
    const updatedproduct = req.body;
    const product = {
      $set :{
        img : updatedproduct.img,
        name : updatedproduct.name,
        brandname : updatedproduct.brandname,
        type : updatedproduct.type,
        price : updatedproduct.price,
        description : updatedproduct.description,
        rating : updatedproduct.rating,
      }
    }
    const result = await brandsCollection.updateOne(filter,product,options)
    res.send(result)
  })

app.get('/brands/carts/showcart',async(req,res)=>{
    const cursor = cartCollection.find()
    const result = await cursor.toArray()
    res.send(result)
})

app.delete('/brands/carts/delete/:id',async(req,res)=>{
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await cartCollection.deleteOne(query)
    res.send(result)

})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})
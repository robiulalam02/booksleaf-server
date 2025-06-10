require('dotenv').config();
const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(cors())
app.use(express.json())

// database user
const user = process.env.DB_USER
const password = process.env.DB_PASS

const uri = `mongodb+srv://${user}:${password}@cluster0.x4uxqpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    const booksCollection = client.db('booksleaf').collection('books')

    app.get('/books', async(req, res) => {
      const result = await booksCollection.find().toArray()
      res.send(result)
    })
    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Booksleaf server is running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
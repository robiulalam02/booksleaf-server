require('dotenv').config();
const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const booksCollection = client.db('booksleaf').collection('books');
    const usersCollection = client.db('booksleaf').collection('users');

    app.get('/books', async (req, res) => {
      const email = req.query.user_email;

      const query = {}
      if (email) {
        query.user_email = email
      }

      const result = await booksCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/mybooks/categories', async(req, res) => {
      const email = req.query.user_email;
      const query = {user_email: email};
      const books = await booksCollection.find(query).toArray();

      const categoryCount = {}
      books.forEach(book => {
        const category = book.book_category
        if (categoryCount[category]) {
          categoryCount[category]++
        } else {
          categoryCount[category] = 1
        }
      })

      res.send(categoryCount);

    })

    app.get('/books/categories', async (req, res) => {
      const books = await booksCollection.find().toArray();
      const categoryCount = {}
      books.forEach(book => {
        const category = book.book_category
        if (categoryCount[category]) {
          categoryCount[category]++
        } else {
          categoryCount[category] = 1
        }
      })

      console.log(categoryCount);
      res.send(categoryCount);
    })

    app.get('/books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    })

    app.post('/books', async (req, res) => {
      const booksData = req.body;
      const result = await booksCollection.insertOne(booksData);
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const userData = req.body;
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    })

    app.put('/books/:id', async (req, res) => {
      const id = req.params.id;
      const bookDetails = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          bookDetails
        },
      };
      const result = await booksCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.send(result);
    })

    app.delete('/books/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.send(result);
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
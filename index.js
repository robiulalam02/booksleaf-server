var cors = require('cors')
require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000
var admin = require("firebase-admin");
var serviceAccount = require("./firebase_secret.json");

// middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://booksleaf-7a4b5.web.app"]
}))
app.use(express.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// verify token
const verifyToken = async (req, res, next) => {
  const header = req.headers?.authorization;
  if (!header || !header?.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized access');
  }
  const token = header?.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next()
  } catch {
    return res.status(401).send('Unauthorized access');
  }
}

const verifyTokenEmail = (req, res, next) => {
  const email = req.query.user_email;
  if (email !== req.decoded.email) {
    return res.status(403).send('Forbidden access');
  }
  next();
}

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
    const reviewsCollection = client.db('booksleaf').collection('reviews');

    app.get('/books', async(req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    })

    app.get('/mybooks', verifyToken, verifyTokenEmail, async (req, res) => {
      const email = req.query.user_email;

      const query = {}
      if (email) {
        query.user_email = email
      }

      const result = await booksCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/mybooks/categories', verifyToken, verifyTokenEmail,  async (req, res) => {
      const email = req.query.user_email;
      const query = { user_email: email };
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
      res.send(categoryCount);
    })

    app.get('/books/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    })

    app.get('/reviews', async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    })

    app.get('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { book_id: id }
      const result = await reviewsCollection.find(query).toArray();
      res.send(result);
      console.log(result);
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

    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result)
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
      res.send(result);
    })

    app.patch('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const { review, date } = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          review: review,
          date: date
        },
      };
      const result = await reviewsCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.patch('/upvote/:id', async (req, res) => {
      const id = req.params.id;
      const { upvote } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = upvote && {
        $inc: {
          upvotes: 1
        }
      }
      const result = await booksCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.patch('/books/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          reading_status: status
        }
      }
      const result = await booksCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.delete('/books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
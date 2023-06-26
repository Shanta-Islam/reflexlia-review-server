const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wars
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onvejqf.mongodb.net/?retryWrites=true&w=majority`;
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
        const serviceCollection = client.db('reflexliaReview').collection('services');

        app.get('/services', async (req, res) => {
            const dataSize = req.query.datasize;
            const query = {};
            const cursor = serviceCollection.find(query).limit(parseInt(dataSize));
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

    }
    finally {

    }

}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('reflexlia service review website');
})



app.listen(port, () => {
    console.log(`reflexlia service review website Running In PORT : ${port}`);
})

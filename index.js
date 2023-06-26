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
        const reviewCollection = client.db('reflexliaReview').collection('reviews');

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

        app.get('/service-reviews', async (req, res) => {
            // console.log(req.query.serviceID);
            let query = {};
            if(req.query.serviceID){
                query={
                    service_id : req.query.serviceID
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);

        })
        app.get('/user-reviews/:userID', async (req, res) => {
            // console.log(req.query.serviceID);
            const userID = req.params.userID;
            let query = {'reviewer_info.userID': userID};
            const cursor = reviewCollection.find(query).sort({ review_date: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);

        })

        app.post('/reviews', async (req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
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

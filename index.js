const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nl9uncn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db("geniusCar").collection("services");
        const orderCollection = client.db("geniusCar").collection("orders");

        // for get data from database [(in home page service component)]
        app.get('/services', async (req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // for get data only one sprecifice data () [(in CheckOut page)]
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        
        
        
        
        // orders api

        // for get data only one user who is login in the site [client site data is on (order page order.js)]
        app.get('/orders', async (req, res) =>{
            let query ={}
            if(req.query.email){
                query = {
                    email: req.query.email 
                }
            }
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })
        
        // for add data in database [i use it on the (checkOut page checkOut.js file) to get data from the site and create an new collection to add data on database]
        app.post('/orders', async (req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
            console.log(result);
        })


        // Delete api data 
        
        // delete only one data [i use it to delete only one selected data from the database(Order page order.js)] 
        app.delete('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })


        // Upadate api data 
        // updata the data single data [i use it to Update only one selected data from the database(Order page order.js)]
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)}
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc)
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(err => console.log(err))










app.get('/', (req, res) =>{
    res.send('genius car server running')
})


app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})
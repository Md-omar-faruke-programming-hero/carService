const express= require('express')
require('dotenv').config()
const cors=require('cors')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId

const app=express()
const port =process.env.PORT || 5000

app.use(cors());
app.use(express.json())


const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqb98.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
            try{
                await client.connect();
                // console.log("connect to db")

                const database = client.db("test");
                const servicesCollection = database.collection("services");
                
                // get api
                app.get('/services',async(req,res)=>{
                    const cursor=  servicesCollection.find({})
                    const service=await cursor.toArray()
                    res.send(service);
                })

                app.get('/services/:id',async(req,res)=>{
                    const id= req.params.id;
                    const query= {_id: ObjectId(id)}
                    const service= await servicesCollection.findOne(query)
                    res.send(service);
                })


                // post api/insert
                app.post('/services',async(req,res)=>{
                    console.log("hit post");
                   const service=req.body;
                   
                      const result = await servicesCollection.insertOne(service);
                    //   console.log(result);
                    res.json(result)
                    console.log(result)
                })

                // delete api
                app.delete('/services/:id',async(req,res)=>{
                    const id= req.params.id ;
                    const query={_id:ObjectId(id)}
                    const result= await servicesCollection.deleteOne(query)
                    res.json(result)
                    console.log(result)

                })
            }
            finally{

            }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("hello from car genius site")
})
app.listen(port,()=>{
    console.log("leistining port",port)
})
import { MongoClient } from "mongodb";
import dns from "node:dns/promises";
import '../utils/loadEnv.js';

dns.setServers(["1.1.1.1"]);

const connectionString = process.env.MONGODB_URI ;

const client = new MongoClient(connectionString);

let conn;

try{
    conn = await client.connect();
    console.log("MongoDB is connected");
    
}catch(err){
    console.log(`MongoDb is Not Connected ${err}`);
    
}

let db = conn.db("user");

export default db ;
import dns from "node:dns/promises";
import '../utils/loadEnv.js';
import mongoose from "mongoose";

dns.setServers(["1.1.1.1"]);

const connectionString = process.env.MONGODB_URI;


try {
    await mongoose.connect(connectionString, {
        dbName: "user",
    });
    console.log("MongoDB is connected ,Mongoose ");

} catch (err) {
    console.log(`MongoDb is Not Connected ${err}`);
    process.exit(1);
}




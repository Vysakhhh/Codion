import mongoose from "mongoose";

const connectionString= process.env.MONGODB_URI

mongoose.connect(connectionString).then((res)=>{
    console.log("mongodb connected to the server");
    
}).catch((err)=>{
    console.log("Connection failed!",err);
    
})
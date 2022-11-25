import mongoose from "mongoose";
import config from "./config";

const conn = async ()=>{

  try {

   await mongoose
  .connect(config.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})
  .then((db) => console.log(`DB is connected`))
  
    
  } catch (error) {
    console.log(error)
  }
}


module.exports={conn}

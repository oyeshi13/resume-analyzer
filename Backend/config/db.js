import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()


export const dbConnect = async () => {
  try {
    //console.log("URI: ",process.env.MONGODB_URI)
    //console.log(encodeURIComponent("TamannaOyeshi@130806"))
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DataBase connected");
  } catch (err) {
    console.log(err.message)
  }
};

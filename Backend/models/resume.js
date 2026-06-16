import mongoose from "mongoose";

const resumeSchema = mongoose.Schema({
    filename:String,
    text:String,
},
{
    timestamp:true
})

export default mongoose.model("Resume",resumeSchema)
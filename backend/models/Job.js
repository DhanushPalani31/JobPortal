import mongoose, { model, Schema } from "mongoose";

const jobSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    requirements:{type:String,required:true},
    location:{type:String},
    category:{type:String},
    type:{
        type:String,
        enum:["Remote","Full-Time","Part-Time","Internship","Contract"],
        required:true,
    },
    company:{type:Schema.Types.ObjectId,ref:"User",required:true},//employer
    salaryMin:{type:Number},
    salaryMax:{type:Number},
    isClosed:{type:Boolean,default:false}
},{timestamps:true})

export const Job=model("Job",jobSchema);
import mongoose, { model, Schema } from "mongoose";

const applicationSchema=new Schema({
    job:{type:Schema.Types.ObjectId,ref:"Job",required:true},
    applicant:{type:Schema.Types.ObjectId,ref:"User",required:true},
    status:{
        type:String,
        enum:[
            "Applied","In Review","Rejected","Accepted"
        ],
        default:"Applied"
    }
},{timestamps:true})

export const Application=model("Application",applicationSchema)
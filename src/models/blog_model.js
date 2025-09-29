const mongoose = require ("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    thumbnailID:{
        type:String,
        required:true,
    },
    isHide:{
        type:Boolean,
        default:false,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})


 const Blog = mongoose.model('Blog',blogSchema);

 module.exports = Blog;
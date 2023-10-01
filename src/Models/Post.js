import mongoose from "mongoose";

const Post = new mongoose.Schema({
    title : { type : String, require : true },
    description : { type : String, require : true },
})

export default mongoose.model('Post', Post);
import mongoose from "mongoose";

const Post = new mongoose.Schema({
    title : { type : String, require : true },
    description : { type : String, require : true },
    create_at: { type : String, require: false },
})

export default mongoose.model('Post', Post);
import mongoose from 'mongoose';
const { Schema } = mongoose;


const VideoComments_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

    video_id: { type: String },
    positive : [],
    negative : [],
    mostLiked : [],
    firstComment : [],
    offensive : [],
    hate : [],
    collaboration : [],
    question : [],
    feedback : [],
    replies: [],

    replied: {
        type: Boolean,
        default: false
    },
    
    is_del: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date
    }
});


const VideoComments_Schema_Model = mongoose.model('video_comments', VideoComments_Schema);
export default VideoComments_Schema_Model;

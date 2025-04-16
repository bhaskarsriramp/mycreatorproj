import mongoose from 'mongoose';
const { Schema } = mongoose;


const VideoDetails_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

         channel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "channels",
          },

    video_id: { type: String },
    youtube_channel_id: { type: String },
    title: { type: String },
    description: { type: String },
    thumbnail: { type: String },
    publishedAt: { type: Date }, 
    views: { type: Number }, 
    likes: { type: Number }, 
    dislikes: { type: Number }, 
    shares: { type: Number }, 
    commentsCount: { type: Number }, 
    watchTime: { type: Number }, 
    subscribersGained: { type: Number }, 
    subscribersLost: { type: Number }, 
    hashtags: { type: Array }, 
    
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


const VideoDetails_Schema_Model = mongoose.model('video_details', VideoDetails_Schema);
export default VideoDetails_Schema_Model;

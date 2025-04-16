import mongoose from 'mongoose';
const { Schema } = mongoose;


const YoutubeChannels_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

    youtube_channel_id: { type: String },

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


const YoutubeChannels_Schema_Model = mongoose.model('channels', YoutubeChannels_Schema);
export default YoutubeChannels_Schema_Model;

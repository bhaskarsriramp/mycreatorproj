const mongoose = require('mongoose');
const { Schema } = mongoose;


const AudioMetrics_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

    transcription_text: { type: String },
    transcription_words: { type: Array },
    transcription_language: { type: String },
    transcription_duration: { type: Number },
    stockVideoDetails: { type: Array }, 
    audio_gcs_uri: { type: String }, 
    processed_videos_URI : { type: Array},
    stitched_video_gcs_uri: { type: String}, 
    final_video_gcs_uri: { type: String}, 
    project_title : { type: String},
    
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


const AudioMetrics_Schema_Model = mongoose.model('audio_metrics', AudioMetrics_Schema);
module.exports = AudioMetrics_Schema_Model;  // CommonJS export


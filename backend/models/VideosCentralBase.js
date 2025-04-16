const mongoose = require('mongoose');

const { Schema } = mongoose;

const VideosCentralBase_Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  converted_motivational: { type: String, required: true },
  sub_category: { type: String, required: true },
  source: {
    video_url: { type: String, required: true },
    video_download_url: { type: String, required: true },
    video_id: { type: Number, required: true },
    thumbnail_url: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  is_del: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  video_embedding: {
    type: [Number], // Array of numbers to store the embedding vector
    required: false, // Optional; can be required if you always want to store embeddings
  },
});


// Optionally, you can create an index on the video_embedding for fast vector search
VideosCentralBase_Schema.index({ video_embedding: '2dsphere' }); // Index for embedding search (if using geospatial indexing for vector search)

// Define the model using the schema
const VideosCentralBase_Schema_Model = mongoose.model(
  'videos_central_base',
  VideosCentralBase_Schema
);

module.exports = VideosCentralBase_Schema_Model;



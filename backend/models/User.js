import mongoose from 'mongoose';
const { Schema } = mongoose;


const User_Schema = new Schema({

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
    },

    name : {
        type : String

    },

    account_id : String,

    picture : {
        type : String

    },
    youtube_channel_linked : {
        type : Boolean,
        default: false

    }, 

    youtube_channel_id : {
        type : String,
    }, 

    youtube_channel_title : {
        type : String,
    }, 

    youtube_channel_profile_img : {
        type : String,
    }, 

    youtube_channel_description: {
        type : String,
    }, 

    youtube_channel_username : {
        type : String,
    }, 

    youtube_channel_publishedAt : {
        type : Date,
    }, 

    youtube_channel_country : {
        type : String,
    }, 
    
    youtube_refresh_token : {
        type : String

    },

    youtube_access_token : {

        type: String
    },

    youtube_access_token_expiry : {

        type: Date
    },
    youtube_refresh_token_expiry : {

        type: Date
    },

    reset_pin:{
        type: Number
    },

    account_delete_code:{
        type: Number
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


const User_Schema_Model = mongoose.model('users', User_Schema);
export default User_Schema_Model;

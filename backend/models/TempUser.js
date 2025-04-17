import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const UserTemp_Schema = new Schema({


    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    reset_pin:{
        type: Number

    },


    is_del: {
        type: Boolean,
        default: false
    },

    is_active: {
        type: Boolean,
        default: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date

    }
});


const UserTemp_Schema_Model = mongoose.model('user_temp', UserTemp_Schema);
export default UserTemp_Schema_Model;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contacts_Schema = new Schema({



    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

    email : String,

    name: String,

    is_bounced: {
        type: Boolean,
        default: false
    },

    tags : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags",
      }],

    status : String,

    updateExisting: {
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


const Contacts_Schema_Model = mongoose.model('contacts', Contacts_Schema);
module.exports = Contacts_Schema_Model;

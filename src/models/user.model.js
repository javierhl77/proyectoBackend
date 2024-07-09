

const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    }, 

    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },

    password: {
        type: String,
        //required: true
    },

    age: {
        type: Number,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    role: {
        type: String,
        enum: ["admin", "user", "premium"],
        default: "user"
    },

    resetToken : {
        token: String,
        expireAt: Date
    },


    /// 4ta integradora:
    documents: [{
        name: String,
        reference: String
      }],
      last_connection: {
         type: Date,
         default: Date.now
      }

});

userSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
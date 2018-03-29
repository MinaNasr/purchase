var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : {
        type: String
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    userType:{
      type: String,
    },
    image:{
      type: String,
    },
    token:{
      type: String,
    },
    uuid:{
      type: String,
    },
    password: {
        type: String,
        //required: [true, "password is required"]
    },
    provider:{
      type: String,
    },
    address: {
        type: String,
    },
    userSocialID:{
      type: Number,
    },
    national_id: Number,
    cart:[{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }]
});

mongoose.model("users", userSchema);

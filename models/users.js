var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : {
        type: String,
        //required: [true, "name is required"],
        // validate: {
        //     validator:(name) => name.length > 5,
        //     message: "must be longer than 5" 
        // }
    },
    email: {
        type: String,
        //required: [true, "email is required"]
    },
    password: {
        type: String,
        //required: [true, "password is required"]
    },
    address: {
        type: String,
    },
    national_id: Number,
    cart:[{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }]    
});

mongoose.model("users", userSchema);

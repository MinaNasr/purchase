var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({

    productId:{
        type:Number
    },
    name : {
        type: String,       
    },
    price: {
        type: Number,
    },
    img:{
        type: String,
    },
    desc: {
        type: String,
    },
    userId:{ //seller
        type: Schema.Types.ObjectId,
        ref: "users"
    }
});

mongoose.model("products", productSchema);

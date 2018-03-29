var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
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
    stock:Number,
    subcat:String,
    userId:{ //seller
        type: Schema.Types.ObjectId,
        ref: "users"
    }
});

mongoose.model("products", productSchema);

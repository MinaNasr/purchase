var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderSchema = new Schema({ 
    status: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }]
});

mongoose.model("orders", orderSchema);

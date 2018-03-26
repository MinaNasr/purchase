var mongoose = require('mongoose');

var mongoose_paginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    orderId: {
        type: Number
    },

    status: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    total:Number
});
orderSchema.plugin(mongoose_paginate);
mongoose.model("orders", orderSchema);

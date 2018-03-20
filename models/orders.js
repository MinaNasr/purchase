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
        type: Schema.Types.Number,
        ref: 'products'
    }],
    user: {
        type: Number,
        ref: 'users'
    }
});
orderSchema.plugin(mongoose_paginate);
mongoose.model("orders", orderSchema);
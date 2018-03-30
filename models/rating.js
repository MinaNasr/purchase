var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ratingSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    rate:Number,
});
mongoose.model("rating", ratingSchema);
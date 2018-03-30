var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var subCatSchema = new Schema({
   _id : Number,  
   name:{
       type: String,
   },
   products: [{
       type: Schema.Types.ObjectId,
       ref:'products'
   }]
});

mongoose.model("subcat", subCatSchema);

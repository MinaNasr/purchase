var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var subCatSchema = new Schema({ 
   name:{
       type: String,
   },
   subCat: [{
       type: Schema.Types.ObjectId,
       ref:'products'
   }]
});

mongoose.model("subcat", subCatSchema);

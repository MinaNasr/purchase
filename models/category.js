var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var catSchema = new Schema({ 
   name:{
       type: String,
   },
   subCat: [{
       type: Schema.Types.ObjectId,
       ref: 'subcat'
   }]
});

mongoose.model("category", catSchema);

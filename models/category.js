var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var catSchema = new Schema({ 
    _id: Number,
   name:{
       type: String,
   },
   subcat: [{
       type: Number,
       ref: 'subcat'
   }]
});

mongoose.model("category", catSchema);

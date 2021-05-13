const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    { 
      NameCard: String , 
      NumberCard: String , 
      ValidDate : String, 
      CVV : Number
    }
);



module.exports = mongoose.model('creditcards', productSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    invoiceid: {
        type: Number,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    useraddress: {
        type: String,
        require: true
    },
    userphone: {
        type: String,
        require: true
    },
    productname: {
        type: String,
        required: true
    },
    productprice: {
        type: Number,
        required: true
    },
    productquantity: {
        type: Number,
        require: true
    },
    productcategory: {
        type: String,
        require: true
    },
    date:{
        type: String,
        require: true
    },
    productimg: {
        type: Buffer,
        required: true
    },
    productimgType: {
        type: String,
    },
    sumofproduct: {
        type: Number,
        required: true
    },
    
        
    // https://mongoosejs.com/docs/schematypes.html#buffers
   
    
});
// https://mongoosejs.com/docs/tutorials/virtuals.html
// a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// IT WILL GIVE US OUR IMAGE SOURCE THAT WE WILL USE IN OUT IMG TAG
invoiceSchema.virtual('coverImagePath').get(function (){
    if(this.productimg != null && this.productimgType != null){
        return `data:${this.productimgType};charset=utf-8;base64,${this.productimg.toString('base64')}`;
    }
})



module.exports = mongoose.model('invoices', invoiceSchema);
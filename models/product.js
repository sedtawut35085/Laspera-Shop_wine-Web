const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        require: true
    },
    detail: {
        type: String,
        require: true
    },
    date:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    aging:{
        type: String,
        require: true
    },
    brand:{
        type: String,
        require: true
    },
    alcohol:{
        type: Number,
        require: true
    },
    sweettaste:{
        type: String,
        require: true
    },
    aciditytaste:{
        type: String,
        require: true
    },
    bodytaste:{
        type: String,
        require: true
    },
    finishtaste:{
        type: String,
        require: true
    },    // https://mongoosejs.com/docs/schematypes.html#buffers
    img: {
        type: Buffer,
        required: true
    },
    imgType: {
        type: String,
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comments'
        }
    ]
    

});
// https://mongoosejs.com/docs/tutorials/virtuals.html
// a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// IT WILL GIVE US OUR IMAGE SOURCE THAT WE WILL USE IN OUT IMG TAG
productSchema.virtual('coverImagePath').get(function (){
    if(this.img != null && this.imgType != null){
        return `data:${this.imgType};charset=utf-8;base64,${this.img.toString('base64')}`;
    }
})



module.exports = mongoose.model('products', productSchema);
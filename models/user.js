const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
       
    },
    password: {
        type: String,
  
    },
    email: {
        type: String,
      
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    creditcardid:{
        type: Number,
    },
    // https://mongoosejs.com/docs/schematypes.html#buffers
    img: {
        type: Buffer,
      
    },
    imgType: {
        type: String,
    
    },
    creditcard: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'creditcards'
        }
    ]
  
});

userSchema.virtual('coverImagePath').get(function (){
    if(this.img != null && this.imgType != null){
        return `data:${this.imgType};charset=utf-8;base64,${this.img.toString('base64')}`;
    }
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('users', userSchema);
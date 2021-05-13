const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        username: String,
        
    },
    date:{
        type: String,
        require: true
    },
    
    
});
// https://mongoosejs.com/docs/tutorials/virtuals.html
// a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// IT WILL GIVE US OUR IMAGE SOURCE THAT WE WILL USE IN OUT IMG TAG
commentSchema.virtual('coverImagePath').get(function (){
    if(this.author.img != null && this.author.imgType != null){
        return `data:${this.author.imgType};charset=utf-8;base64,${this.author.img.toString('base64')}`;
    }
})



module.exports = mongoose.model('comments', commentSchema);
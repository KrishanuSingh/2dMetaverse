
const mongoose =  require('mongoose');
mongoose.connect("mongodb+srv://krishanu:mongo123@cluster0.byeivzw.mongodb.net/metaverse");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique:true,
        required: true,
        trim:true,
        lowercase:true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        minLength: 6,
        required:true
    },
    position:{
        x:{type: Number , default:0},
        y:{type: Number, default:0},
      
    },
    avatar: {
        type: String,
        default: 'default-avatar'
    }
},{
   timestamps:true 
});

module.exports = mongoose.model('User', userSchema);
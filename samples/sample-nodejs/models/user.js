const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema({
    name : {
        type:String
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String
    },
    tokens : [
        {
            token : {type : String}
        }
    ],
    tools : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module', unique: true }]
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {

    const user = this;

    const token = jwt.sign({_id:user._id.toString()}, process.env.SECRET_KEY);

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return ({user, token});

}



userSchema.pre('save', async function(next){
    var user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next();
});

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email });

    if(!user){
        throw new Error ('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error ('Unable to login');
    }

    return user;
}

const User = mongoose.model('User',userSchema);

module.exports = User;
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(val){
            if(!validator.isEmail(val)) throw new Error('Email is not correct.')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        validate(pass){
            if(pass.toLowerCase().includes('password')) throw new Error('Password should not conatains password.')   
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
})

userSchema.methods.generateAuthToken = async function () {
    const token =  jwt.sign({_id: this._id.toString()}, 'new user')
    
    this.tokens = this.tokens.concat({token})
    await this.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) throw new Error('User not registered.')

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('Email or Password not matched.')

    return user;
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        // console.log('password changes')
        this.password = await bcrypt.hash(this.password, 8)
    }
    // console.log('pre call before save')
    
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
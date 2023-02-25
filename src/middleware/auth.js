const User = require('../models/Users.model')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try{        
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'new user')

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) throw new Error('User not valid.')

        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send({error: 'Please login first'})
    }
}

module.exports = auth
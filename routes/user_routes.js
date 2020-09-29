var express = require('express');
var User = require('../models/user');
const auth = require('../middleware/auth')

var router = express.Router();

router.post('/user',(req,res) => {
    var user = new User(req.body);

    user.save().then((user) => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400).send({message:"Bad Request"});
    });

});

router.post('/user/login',async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const tokenedUser = await user.generateAuthToken();

        res.status(200).send(tokenedUser);
    }catch(e){
    
        res.status(401).send('Unable to login');

    }
});

router.get('/user/logout', auth, async (req,res) => {

    req.user.tokens = req.user.tokens.filter(token => {
        return token.token !== req.token
    })

    await req.user.save()
    res.status(200).send();
});

module.exports = router;
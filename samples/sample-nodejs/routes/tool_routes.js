var express = require('express');
var Tool = require('../models/tool');
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth')

var router = express.Router();

router.get('/tool', auth, async(req,res) => {
    var tools = await Tool.find({ _id : req.user.tools})

    res.send(tools);
})

router.post('/tool',auth ,async(req,res) => {
    try{
        var tool = new Tool(req.body);

        tool.tool_auth.password = jwt.sign({password:tool.tool_auth.password},process.env.SECRET_KEY);
        tool.tool_auth.username =  jwt.sign({username:tool.tool_auth.username},process.env.SECRET_KEY);
    
        var tool = await tool.save();
    
        req.user.tools.push(tool._id);
    
        await req.user.save();
    
        res.status(201).send(tool);
    }catch(e){
        res.status(400).send("Bad Request");
    }
   
});

module.exports = router;
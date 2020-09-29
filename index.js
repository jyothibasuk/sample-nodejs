var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.config();

const toolRouter = require('./routes/tool_routes');
const userRouter = require('./routes/user_routes');

//database connection
require('./db/db');

var port = 3000;
app.use(express.json());
app.use(toolRouter);
app.use(userRouter);


app.listen(port,() => {
    console.log("Server started");
});

#comment
const mongoose = require('mongoose');

var toolSchema = mongoose.Schema({
    tool_name : String,
    tool_auth : {
        username : String,
        password : String
    }
});

toolSchema.methods.toJSON = function() {
    const tool = this;
    const toolObject = tool.toObject();

    delete toolObject.tool_auth;

    return toolObject;
}

var Tool = mongoose.model("Tool",toolSchema);

module.exports = Tool;
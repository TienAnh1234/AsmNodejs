var mongoose = require('mongoose');
var UsersSchema = mongoose.Schema(
    {
        username: String,
        password: String,
        role: String
    }
)

var UsersModel = mongoose.model("users",UsersSchema);

module.exports = UsersModel;

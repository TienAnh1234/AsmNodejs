
var mongoose = require('mongoose');
var CountrySchema = mongoose.Schema(
    {

        name: String
    }
)

var CountryModel = mongoose.model("countrys",CountrySchema);

module.exports = CountryModel;
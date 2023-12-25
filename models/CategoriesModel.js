// các field được khai báo trong brandsSchema sẽ cần phải được nhập thông tin đầy đủ

var mongoose = require('mongoose');
var CategoriesSchema = mongoose.Schema(
    {
        name: String,
        country: String,
        year: Number
    }
)

var CategoriesModel = mongoose.model("categories",CategoriesSchema);

module.exports = CategoriesModel;
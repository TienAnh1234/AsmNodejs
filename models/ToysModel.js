// các field được khai báo trong brandsSchema sẽ cần phải được nhập thông tin đầy đủ

var mongoose = require('mongoose');
var ToysSchema = mongoose.Schema(
    {
        name: String,
        image: String,
        manufacture: String,
        material: String,
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories'   // kết nối với bảng categories
        },
        price: Number
    }
)

var ToysModel = mongoose.model("toys",ToysSchema);

module.exports = ToysModel;
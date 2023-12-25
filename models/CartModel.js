

var mongoose = require('mongoose');
var CartSchema = mongoose.Schema(
    {
        toy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'toys'   // kết nối với bảng categories
        },

        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories'   // kết nối với bảng categories
        },
        quantity: Number,
        user:String,
        price: Number 
    }
)

var CartModel = mongoose.model("carts",CartSchema);

module.exports = CartModel;
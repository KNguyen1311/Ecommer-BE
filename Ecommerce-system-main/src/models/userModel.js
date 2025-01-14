import mongoose from "mongoose";
// import manageShop from "../routes/shopRoute/manageShop";

const userSchema = new mongoose.Schema({
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shops'
    },
    name:{
        type:String,
        // require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
     //   enum: ['custumer','admin','shop'],
        default:'custumer'
    },
    phone:{
        type:String,
        // require:true
    },
    address:{
        type:String
    },
    gender:{
        type:String
    },
    wishlist: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
          }
        }
      ],
    cart: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'items'
          },
     
        }
      ],


})

const userModel = mongoose.model('users',userSchema);

export default userModel;
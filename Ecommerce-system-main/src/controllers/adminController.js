import { generateRefreshToken, generateToken } from "../middleware/createjwt.js";
import userModel from "../models/userModel.js";
import shopModel from "../models/shopModel.js";
import orderModel from "../models/orderModel.js";

const adminController = {
    loginAdmin: async(req,res) => {
        try{
            const {email} = req.body;
            const user = await userModel.findOne({email});
            const accessToken = generateToken({user});
            const refreshToken = generateRefreshToken({user})
            // res.cookie('token',accesstokentoken, {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: 'Lax',
            //     maxAge: 24 * 60 * 60 * 1000
            // })
            
            res.status(200).send({
                message: 'login success',
                user,
                accessToken,
                refreshToken
            })
        }catch(err){
            res.status(500).send({
                message: err.message
            })
        }
    },

    manageUsers: async(req,res) => {
        try {
            const query =req.query
            const startPo = (query.page -1) * query.limit;
            const endPo = startPo + query.limit;
            const getUsers = await userModel.find().skip(startPo).limit(endPo);
            res.status(200).send({
                message: 'User success',
                getUsers
            });
        } catch (err) {
            res.status(500).send({
                message: err.message
            })
        }
    },
    manageShops: async(req,res) => {
        try {  
            const query = req.query
            const startPo = (query.page -1) * query.limit;
            const endPo = startPo + query.limit;
            const getShops = await shopModel.find().skip(startPo).limit(endPo);
            res.status(200).send({
                message: 'Shop success',
                getShops
            });
        } catch (err) {
            res.status(500).send({
                message: err.message
            })
        }
    },

     pendingShops: async (req, res) => {
        try {
          const pendingShops = await shopModel.find({ isActive: false });
          res.status(200).json({
            success: true,
            message: "Lấy danh sách shop đang chờ duyệt thành công",
            data: pendingShops,
          });
        } catch (error) {
          console.error("Error in pendingShops:", error);
          res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách shop",
            error: error.message,
          });
        }
      }, 

        approveShops: async (req,res) => {
            try {
                const {id} = req.params;
                console.log(`Approving shop with ID: ${id}`);

                const shop = await shopModel.findById(id);
                if(!shop) {
                    return res.status(404).json({ message:"Khong tim thay Shop"});

                }
                console.log('Shop details before approval:', shop); 

                if (shop.isActive) {
                    return res.status(400).json({ message: "Shop da duoc phe duyet"})
                }
                const updateShop = await shopModel.findByIdAndUpdate(
                    id,
                    {isActive: true},
                    {new: true}
                );
                res.status(200).json({
                    message: "phe duyet thanh cong",
                    shop: updateShop,
                });
            } catch (error) {
                console.error('Error while approving shop:', error); 
                res.status(500).json({
                    message:"Loi khi phe duyet shop",
                    error: error.message,
                });
            }
        },

  /*      addUser: async (req, res) => {
            try {
                const { name, email, password, role } = req.body;
                const hashedPassword = await bcrypt.hash(password, 10); 
                const newUser = new userModel({ name, email, password: hashedPassword, role });
                await newUser.save();
        
                res.status(201).json({
                    message: "Thêm người dùng thành công",
                    user: newUser,
                });
            } catch (error) {
                console.error("Error adding user:", error);
                res.status(500).json({
                    message: "Lỗi khi thêm người dùng",
                    error: error.message,
                });
            }
        },

        addShop: async (req, res) => {
            try {
                const {name, email, phone, description, address} = req.body;
                const newShop = new shopModel ({name, email, phone, description, address, isActive:false,});
                await newShop.save();
                res.status(201).json({
                    massage: "Them shop thanh cong",
                    shop: newShop,
                });

            }  catch (error) {
                console.error("Error adding shop", error);
                res.status(500).json({
                    message: "Loi roi",
                    error: error.message,
                })
            }
        }, */

        updateUser: async (req, res) => {
            try {
                const { id } = req.params;
                const updates = req.body; 
                const updatedUser = await userModel.findByIdAndUpdate(id, updates, { new: true });
        
                if (!updatedUser) {
                    return res.status(404).json({ message: "Không tìm thấy người dùng" });
                }
        
                res.status(200).json({
                    message: "Cập nhật người dùng thành công",
                    user: updatedUser,
                });
            } catch (error) {
                console.error("Error updating user:", error);
                res.status(500).json({
                    message: "Lỗi khi cập nhật người dùng",
                    error: error.message,
                });
            }
        },

        updateShop: async (req, res) => {
            try {
                const { id } = req.params;
                const updates = req.body; 
                const updatedShop = await shopModel.findByIdAndUpdate(id, updates, { new: true });
        
                if (!updatedShop) {
                    return res.status(404).json({ message: "Không tìm thấy shop" });
                }
        
                res.status(200).json({
                    message: "Cập nhật shop thành công",
                    shop: updatedShop,
                });
            } catch (error) {
                console.error("Error updating shop:", error);
                res.status(500).json({
                    message: "Lỗi khi cập nhật shop",
                    error: error.message,
                });
            }
        },

        deleteUser: async (req, res) => {
            try {
                const { id } = req.params;
                const deletedUser = await userModel.findByIdAndDelete(id);
        
                if (!deletedUser) {
                    return res.status(404).json({ message: "Không tìm thấy người dùng" });
                }
        
                res.status(200).json({ message: "Xóa người dùng thành công" });
            } catch (error) {
                console.error("Error deleting user:", error);
                res.status(500).json({
                    message: "Lỗi khi xóa người dùng",
                    error: error.message,
                });
            }
        },

        deleteShop: async (req, res) => {
            try {
                const { id } = req.params;
                const deletedShop = await shopModel.findByIdAndDelete(id);
        
                if (!deletedShop) {
                    return res.status(404).json({ message: "Không tìm thấy shop" });
                }
        
                res.status(200).json({ message: "Xóa shop thành công" });
            } catch (error) {
                console.error("Error deleting shop:", error);
                res.status(500).json({
                    message: "Lỗi khi xóa shop",
                    error: error.message,
                });
            }
        },

        userByID: async (req, res) => {
            try {
                const {id} = req.params;
                const user = await userModel.findById(id);
                if (!user) {
                    return res.status(404).json({success: false, message: "Nguoi dung khong ton tai"});
                  }
                  res.status(200).json({success: true, message:"Lay thong tin thanh cong", data: user});
            } catch (error) {
                res.status(500).json({success: false, message:"Loi khi lay thong tin nguoi dung", error: error.message});
            }
        },
        shopByID: async (req, res) => {
            try {
                const {id} = req.params;
                const shop = await shopModel.findById(id);
                if (!shop) {
                    return res.status(404).json({success: false, message: "Nguoi dung khong ton tai"});
                  }
                  res.status(200).json({success: true, message:"Lay thong tin thanh cong", data: shop});
            } catch (error) {
                res.status(500).json({success: false, message:"Loi khi lay thong tin nguoi dung", error: error.message});
            }
        },

        userActive: async (req, res) => {
            try {
              const { id } = req.params;
              const user = await userModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
              if (!user) {
                return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
              }
              res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: user });
            } catch (error) {
              res.status(500).json({ success: false, message: "Lỗi khi cập nhật trạng thái", error: error.message });
            }
          },
          shopActive: async (req, res) => {
            try {
              const { id } = req.params;
              const shop = await shopModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
              if (!shop) {
                return res.status(404).json({ success: false, message: "Shop không tồn tại" });
              }
              res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: shop });
            } catch (error) {
              res.status(500).json({ success: false, message: "Lỗi khi cập nhật trạng thái", error: error.message });
            }
          },

          createOrder: async (req,res) => {
            try {
                    const newOrder = new orderModel(req.body);
                    const saveOrder = await newOrder.save();
                    res.status(201).json(saveOrder);
            } catch (error) {
                res.status(500).json({error: error.message});
            }
          },

          orderShop: async (req,res) => {
            const {shopId} = req.params;
            try {
                const orders = await orderModel.find({shopId})
                .populate("userId", "name email")
                .populate("items.itemsId", "name price")
                .sort({ date:-1 });
                res.json(orders);
            } catch (error) {
                res.status(500).json({error: error.message});
            }
          },
          orderUser: async (req,res) => {
            const {userId} = req.params;
            try {
                const orders = await orderModel.find({userId})
                .populate("shopId", "name")
                .populate("items.itemsId", "name price")
                .sort({ date:-1 });
                res.json(orders);
            } catch (error) {
                res.status(500).json({error: error.message});
            }
          },

          UserOrderHistory: async (req, res) => {
            const { userId } = req.params;
            try {
              const orders = await Order.find({ userId }).sort({ createdAt: -1 });
              res.status(200).json(orders);
            } catch (error) {
              res.status(500).json({ message: 'Error retrieving order history', error });
            }
          }
        
          


}
export default adminController;
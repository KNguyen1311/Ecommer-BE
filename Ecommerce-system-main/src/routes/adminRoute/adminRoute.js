import express from 'express';
import authenticateToken from '../../middleware/authenticateToken.js';
import adminController from '../../controllers/adminController.js';

const adminRoute = express.Router();

adminRoute.post('/loginAdmin',adminController.loginAdmin);
adminRoute.get('/users',adminController.manageUsers);
adminRoute.get('/shops', adminController.manageShops);
adminRoute.get('/pending',adminController.pendingShops)
adminRoute.put('/approve/:id',adminController.approveShops);

adminRoute.put('/user/:id', adminController.updateUser);
adminRoute.delete("/user/:id", adminController.deleteUser);

adminRoute.put("/shop/:id", adminController.updateShop);
adminRoute.delete("/shop/:id", adminController.deleteShop);

adminRoute.get("/user/:id", adminController.userByID)
adminRoute.get("/shop/:id", adminController.shopByID)

adminRoute.patch("/user/active/:id", adminController.userActive);
adminRoute.patch("/shop/active/:id", adminController.shopActive);

adminRoute.post("/",adminController.createOrder);
adminRoute.get("/shop/:shopId",adminController.orderShop);
adminRoute.get("user/:userId",adminController.orderUser);
adminRoute.get('/order/user/:userId', adminController.UserOrderHistory)
export default adminRoute;
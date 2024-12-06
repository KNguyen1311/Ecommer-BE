import express from 'express'
import userRoute from './userRoute.js';
import shopRoute from './shopRoute/shopRoute.js';
import adminRoute from './adminRoute/adminRoute.js';

const indexRoute = express.Router();
indexRoute.use('/users',userRoute);
indexRoute.use('/shop',shopRoute);
indexRoute.use('/admin',adminRoute);
export default indexRoute;
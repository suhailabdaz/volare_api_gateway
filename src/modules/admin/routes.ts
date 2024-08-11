import express, { Application } from 'express';
import adminController from './controller';
import { isValidated } from '../authentication/controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const adminRoute: Application = express();

const controller = new adminController();

adminRoute.post('/login', controller.login);
adminRoute.get('/get-users',isValidated, controller.getUsers);
adminRoute.post('/block-user', isValidated, controller.blockUser);
adminRoute.post('/block-airline', isValidated, controller.blockAirline);
adminRoute.post('/create-coupon', isValidated,  upload.single('coupon_logo_image'),
controller.createCoupon);
adminRoute.get('/get-coupons', isValidated, controller.getCoupons);
adminRoute.post('/create-banner', isValidated, upload.single('banner_logo_image'),controller.createBanner);
adminRoute.get('/get-banners', isValidated, controller.getBanners);
adminRoute.patch('/block-ban',isValidated,controller.blockBanOrUpdate);



export default adminRoute;

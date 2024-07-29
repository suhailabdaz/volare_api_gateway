import express, { Application } from 'express';
import adminController from './controller';
import { isValidated } from '../authentication/controller';

const adminRoute: Application = express();

const controller = new adminController();

adminRoute.post('/login', controller.login);
adminRoute.get('/get-users', isValidated, controller.getUsers);
adminRoute.post('/block-user', isValidated, controller.blockUser);

export default adminRoute;

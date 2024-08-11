import express, { Application } from 'express';
import airlineController from './controller';
import { isValidated } from '../authentication/controller';
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const airlineRoute: Application = express();

const controller = new airlineController();

airlineRoute.post('/register', controller.register);
airlineRoute.post(
  '/verify-otp',
  upload.single('airline_logo_image'),
  controller.verifyOtp
);
airlineRoute.post('/login', controller.login);
airlineRoute.get('/get-image', isValidated, controller.getImage);
airlineRoute.post('/add-flight', isValidated, controller.addFlight);
airlineRoute.get('/get-flights', isValidated, controller.getFlights);
airlineRoute.post('/save-flight', isValidated, controller.saveFlight);
airlineRoute.post('/suspend-flight', isValidated, controller.suspendFlight);
airlineRoute.get('/get-airline', controller.getAirline);
airlineRoute.get('/get-flight', controller.getFlight);




export default airlineRoute;
 
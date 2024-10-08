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
airlineRoute.get('/get-image', controller.getImage);
airlineRoute.post('/add-flight', isValidated, controller.addFlight);
airlineRoute.get('/get-flights', isValidated, controller.getFlights);
airlineRoute.post('/save-flight', isValidated, controller.saveFlight);
airlineRoute.post('/suspend-flight', isValidated, controller.suspendFlight);
airlineRoute.get('/get-airline', controller.getAirline);
airlineRoute.get('/get-flight', controller.getFlight);
airlineRoute.get('/all-flights', controller.userFlight);
airlineRoute.get('/get-cancelations-policies',isValidated,controller.getCancelationPolicies);
airlineRoute.get('/get-baggages-policies',isValidated,controller.getBaggagePolicies)
airlineRoute.get('/get-meals',isValidated,controller.getMeals)
airlineRoute.post('/add-cancelation-policies',isValidated,controller.addCancelation)
airlineRoute.post('/add-baggage-policies',isValidated,controller.addBaggage)
airlineRoute.post('/add-meals',isValidated,controller.addMeals)









export default airlineRoute;
 
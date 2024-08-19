import express, { Application } from 'express';
import bookingController from './controller';
import { isValidated } from '../authentication/controller';



const bookingRoute: Application = express();

const controller = new bookingController();


bookingRoute.post('/initiate-booking', isValidated, controller.initiateBooking);
bookingRoute.get('/get-booking', isValidated, controller.getBooking);
bookingRoute.post('/update-booking/:bookingId', isValidated, controller.updateBooking);






export default bookingRoute;

import express, { Application } from 'express';
import bookingController from './controller';
import { isValidated } from '../authentication/controller';



const bookingRoute: Application = express();

const controller = new bookingController();


bookingRoute.post('/initiate-booking', isValidated, controller.initiateBooking);
bookingRoute.get('/get-booking', isValidated, controller.getBooking);
bookingRoute.post('/update-booking/:bookingId', isValidated, controller.updateBooking);
bookingRoute.post('/update-seats/:bookingId', isValidated, controller.updateSeats);
bookingRoute.post('/create-checkout-session',isValidated,controller.createCheckoutSession);
bookingRoute.post('/update-booking-status',isValidated,controller.handleStripeWebhook)




export default bookingRoute;

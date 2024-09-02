import { Request, Response, NextFunction } from 'express';
import bookingRabbitMQClient from './rabbitMQ/client';
import flightChartRabbitMQClient from '../airline_authority/rabbitmq/client'
import { StatusCode } from '../../interfaces/enum';
import stripe from 'stripe'

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY as string)


export default class bookingController {

  initiateBooking = async (req:Request, res:Response)=>{
    try{
      const response =  await bookingRabbitMQClient.produce(req.body,'initiate-booking')
      return res.status(StatusCode.Created).json(response);

    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  getBooking = async (req:Request, res:Response)=>{
    try{
      const bookingId = req.query.id;
      const response =  await bookingRabbitMQClient.produce(bookingId,'get-booking')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  updateBooking = async (req:Request, res:Response)=>{
    try{
      
      const { bookingId } = req.params; 
      const travellers = req.body; 
      const response =  await bookingRabbitMQClient.produce({bookingId,travellers},'update-booking')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  updateSeats = async (req:Request, res:Response)=>{
    try{
      
      const { bookingId } = req.params; 
      const seats = req.body; 
      const response =  await bookingRabbitMQClient.produce({bookingId,seats},'update-seats')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  createCheckoutSession = async (req:Request, res:Response)=>{
    try{
      const data = req.body; 
      const response =  await bookingRabbitMQClient.produce(data,'checkout-session')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  handleStripeWebhook = async (req:Request,res:Response)=>{
    
      try {
        const {flightChartId,bookingId,sessionId,seats} = req.body
        const session = await stripeClient.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {

        await flightChartRabbitMQClient.produce({flightChartId, seats},'updateBookingSeatConfirmation')
        const response = await bookingRabbitMQClient.produce(bookingId,'ticketConfirmation')
        return res.status(StatusCode.Created).json(response);

        }

      }catch(err:any){
        console.log(err);
        
         }
  }

}

import { Request, Response, NextFunction } from 'express';
import bookingRabbitMQClient from './rabbitMQ/client';
import flightChartRabbitMQClient from '../airline_authority/rabbitmq/client'
import { StatusCode } from '../../interfaces/enum';



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
      // if(response){
      //   await flightChartRabbitMQClient.produce(response,'update-seats')
      // }
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  createCheckoutSession = async (req:Request, res:Response)=>{
    try{
      const data = req.body; 
      const response =  await bookingRabbitMQClient.produce(data,'checkout-session')
      // if(response){
      //   await flightChartRabbitMQClient.produce(response,'update-seats')
      // }
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }
}

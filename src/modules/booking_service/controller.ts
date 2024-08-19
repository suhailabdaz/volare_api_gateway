import { Request, Response, NextFunction } from 'express';
import bookingRabbitMQClient from './rabbitMQ/client';
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

}

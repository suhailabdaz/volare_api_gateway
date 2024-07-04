import { Request, Response, NextFunction } from "express";
import RabbitMQClient from "./rabbitmq/client";


const userRabbitMQ = new RabbitMQClient()

export default class userController{
  login = async (req: Request  , res: Response) => {
    try {
      console.log("hererere",req.body)
      await userRabbitMQ.initialize()
      await userRabbitMQ.produce(req.body)
      return res.status(200).json({ success: false, message: 'wjeifjInvalid credentials' });
    } catch (error) {
      return res.status(500).json({succes: false , message:"hahahah"})
    }
  };
}
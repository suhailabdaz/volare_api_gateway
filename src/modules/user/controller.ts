import { Request, Response, NextFunction } from "express";
import userRabbitMQClient from "./rabbitmq/client";



export default class userController{
  login = async (req: Request  , res: Response) => {
    try {
      console.log("hererere",req.body)
      const response : any = await userRabbitMQClient.produce(req.body,"login")
      if(response){
        console.log("the response in controller ",response);
      }
      return res.status(200).json({ success: false, message: 'her we go' });
    } catch (error) {
      return res.status(500).json({succes: false , message:"hahahah"})
    }
  };
}
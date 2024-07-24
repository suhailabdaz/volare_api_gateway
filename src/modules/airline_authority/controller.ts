import { Request, Response, NextFunction } from "express";
import authorityRabbitMQClient from "./rabbitmq/client";
import { generateTokenOptions } from "../../utils/generateTokenOptions";
import { StatusCode } from "../../interfaces/enum";

export default class authorityController {
  login = async (req: Request  , res: Response) => {
    try {
      const response : any = await authorityRabbitMQClient.produce(req.body,"login")
      console.log(response,"login respoopoomse")
      if(response.success){
        const options = generateTokenOptions();
        res.cookie(
          "authorityRefreshToken",
          response.refreshToken,
          options.refreshTokenOptions
        );
        res.cookie("authorityAccessToken", response.accessToken, options.accessTokenOptions);
        return res.status(StatusCode.Accepted).json(response);
      }else{
        return res.json(response)
      }
    } catch (error) {
      return res.status(500).json({succes: false , message:"hahahah"})
    }
  };
  addAirport = async (req:Request , res:Response)=>{
    try{
      const response = await authorityRabbitMQClient.produce(req.body,'add-airport')
      return res.status(StatusCode.Created).json(response)
    }catch(err){
        console.log(err);
    }
  }
  saveAirport = async(req:Request,res:Response)=>{
    try{
      const response = await authorityRabbitMQClient.produce(req.body,'save-airport')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  deleteAirport = async(req:Request,res:Response)=>{
    try{
      const id = req.params.id
      const response = await authorityRabbitMQClient.produce(id,'delete-airport')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  getAirports = async(req:Request,res:Response)=>{
    try{
      const response = await authorityRabbitMQClient.produce(req.body,'get-airports')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  addSchedule = async(req:Request,res:Response)=>{
    try{
      const response = await authorityRabbitMQClient.produce(req.body,'add-schedule')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  getSchedules = async(req:Request,res:Response)=>{
    try{
      const data = {
        from: req.query.fromAirportId as string,
        to: req.query.toAirportId as string,
      };
      const response = await authorityRabbitMQClient.produce(data,'get-schedules')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
}









  

  






  

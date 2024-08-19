import { Request, Response, NextFunction } from "express";
import authorityRabbitMQClient from "./rabbitmq/client";
import airlineRabbitMQClient from "../airline/rabbitmq/client";
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
      const {id} = req.body
      console.log(id);
      const response = await authorityRabbitMQClient.produce(id,'suspend-airport')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  getAirports = async(req:Request,res:Response)=>{
    try{
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5
      const response = await authorityRabbitMQClient.produce({page,limit},'get-airports')
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

  saveSchedule = async (req:Request,res:Response)=>{
    try{
      const response:any = await authorityRabbitMQClient.produce(req.body,'save-schedule')
      if(response.success){
        const FlightData:any = await airlineRabbitMQClient.produce(response.schedule.flightId,'get-flight')
        if(FlightData.success){
          const flightInstance:any = await authorityRabbitMQClient.produce({schedule:response.schedule,flight:FlightData.flight_data},"schedule-charting")
          return res.status(StatusCode.Created).json(flightInstance)
        }
        return res.status(StatusCode.InternalServerError).json(response)
      }else{
        return res.status(StatusCode.InternalServerError).json(response)
      }
    }catch(err:any){
      throw new Error(err)
    }
    }
  
  getFreeSchedules = async (req:Request,res:Response)=>{
    try{
      const response = await authorityRabbitMQClient.produce('','get-available')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  getChartedFlight = async (req:Request,res:Response)=>{
    try{
      const chartId = req.query.id;
      const response = await authorityRabbitMQClient.produce(chartId,'get-chartedFlight')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  airlineSchedules = async (req:Request,res:Response)=>{
    try{
      const { id } = req.query;
      console.log("myschedules",id);
      
      const response = await authorityRabbitMQClient.produce(id,'airline-schedules')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  searchSchedules = async (req:Request,res:Response)=>{
    try{
      console.log("kittititi",req.query);
      
      const { from, to, date } = req.query as unknown as { from: string; to: string; date: Date };
      const response = await authorityRabbitMQClient.produce({from,to,date},'search-schedules')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  suspendSchedule = async(req:Request,res:Response)=>{
    try{
      const response = await authorityRabbitMQClient.produce(req.body.id,'suspend-schedule')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
}









  

  






  

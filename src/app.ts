import "dotenv/config"
import { Application } from "express"
import express from "express";
import http from "http"
import userRoute from "./modules/user/routes";
import adminRoute from "./modules/admin/routes";
import cors from "cors"
import helmet from "helmet";
import logger from "morgan"
import cookieParser from "cookie-parser";
import "dotenv/config"
import userRabbitMQClient from "./modules/user/rabbitmq/client";
import authRoute from "./modules/authentication/routes";
import authorityRoute from "./modules/airline_authority/routes";



class App {
  public app : Application
  server : http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

  constructor (){
    this.app = express();
    this.server = http.createServer(this.app);
    this.applyMiddleware()
    this.routes()
  }
  
  private applyMiddleware():void{
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));  
    this.app.use(helmet())
    this.app.use(logger("dev"))
    this.app.use(cookieParser())
  }

  private routes():void{
    this.app.use("/api/v1/user", userRoute);
    this.app.use("/api/v1/admin",adminRoute);
    this.app.use("/api/v1/auth",authRoute)
    this.app.use("/api/v1/authority",authorityRoute)
  }
  public startServer(port:number):void{
      this.server.listen(port,()=>{
        console.log(`The API Gateway started at PORT at ${port}`);
      })
  }
}

export default App
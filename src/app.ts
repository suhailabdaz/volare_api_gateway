import "dotenv/config"
import { Application } from "express"
import express from "express";
import http from "http"
import userRoute from "./modules/user/routes";
import cors from "cors"
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "dotenv/config"



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
    this.app.use(cors)
    this.app.use(helmet())
    this.app.use(cookieParser())
  }

  private routes():void{
    this.app.use("/api/v1/user", userRoute);
  }
  public startServer(port:number):void{
      this.server.listen(port,()=>{
        console.log(`The API Gateway started at PORT at ${port}`);
      })
  }
}


export default App
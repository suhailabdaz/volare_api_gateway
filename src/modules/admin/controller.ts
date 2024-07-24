import { Request, Response, NextFunction } from "express";
import adminRabbitMQClient from "./rabbitmq/client";
import { genenrateToken } from "../../jwt/jwtCreate";


export default class adminController {
  login = async (req: Request  , res: Response) => {
    try{
      console.log("addddmin login her");
      const response : any = await adminRabbitMQClient.produce(req.body,"login")
      console.log("adiminloginresponse",response);
      if(!response.success){
        return res.json(response);
      }
      const token = genenrateToken({id: response.admin._id, email: response.admin.email});
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
      response.token = token;
      console.log("this is result from admin login",response);
      return res.json(response)
    }catch(er){
      return res.status(500).json({succes: false , message:"hahahah"})
    }
  }
  logout = async (req :Request , res :Response)=> {
    try {
      console.log("User logout reaching here");
      res.clearCookie('token');      
      return res.json({success: true})
  } catch (error) {
      console.log("Error during login with google auth", error);
      return res.status(500).json({success: false, error: "Internal server error" });
  }
}
}

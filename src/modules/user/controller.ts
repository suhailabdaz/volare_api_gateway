import { Request, Response, NextFunction } from "express";
import userRabbitMQClient from "./rabbitmq/client";
import { generateTokenOptions } from "../../utils/generateTokenOptions";
import { StatusCode } from "../../interfaces/enum";
import s3Config, { bucketName } from '../../config/s3.config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { randomImageName } from '../../utils/randomName';
import sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client(s3Config);


export default class userController {
  imageUpload = async (req:Request , res:Response)=>{
    try{
      const buffer = await sharp(req.file?.buffer)
      .resize({ height: 320, width: 320, fit: 'contain' })
      .toBuffer();
    const imageName = randomImageName();
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: req.file?.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const response = await userRabbitMQClient.produce(
      { user_id: req.body.user_id, imageName }, 
      'upload-image'
    );    return res.status(StatusCode.Created).json(response)
    }catch(err){
        console.log(err);
    }
  }
  login = async (req: Request  , res: Response) => {
    try {
      const response : any = await userRabbitMQClient.produce(req.body,"login")
      if(response.success){
        const options = generateTokenOptions();
        res.cookie(
          "refreshToken",
          response.refreshToken,
          options.refreshTokenOptions
        );
        res.cookie("accessToken", response.accessToken, options.accessTokenOptions);
        return res.status(StatusCode.Accepted).json(response);
      }else{
        return res.json(response)
      }
    } catch (error) {
      return res.status(500).json({succes: false , message:"hahahah"})
    }
  };
  
  register = async (req: Request , res: Response) => {
    try {
      const response : any = await userRabbitMQClient.produce(req.body,"register")
      if(response){
        const options = generateTokenOptions();
        res.cookie(
          "refreshToken",
          response.refreshToken,
          options.refreshTokenOptions
        );
        res.cookie("accessToken", response.accessToken, options.accessTokenOptions);
        return res.status(StatusCode.Accepted).json(response);
      }
    } catch (error) {
      return res.status(500).json({success: false , message:"error "})
    }
  };

  verify_otp = async (req :Request , res :Response)=> {
          try{
            const cookieOtp = req.cookies.otp            
            const enteredOtp = req.body.otp
            console.log("cookieuser",req.cookies.user);
            
            if(cookieOtp == enteredOtp){
              const userData = JSON.parse(req.cookies.user);
              console.log("This is cookies iuser dataaaaaaaa",userData);
              const response : any = await userRabbitMQClient.produce(userData,"verify-otp")
              if(response.success){
                res.json({success:true})
              }else{
                res.json({success:false})
              }
              
            }else{
              res.json({success:false , message:"Invalid otp"})
            }
          }catch(error){
            console.log("Error in otp verifying", error);
          }
  }

  logout = async (req :Request , res :Response)=> {
    try {
      console.log("User logout reaching here");
      res.clearCookie('role');
      res.clearCookie('token');
      res.clearCookie('user')
      
      return res.json({success: true})
  } catch (error) {
      console.log("Error during login with google auth", error);
      return res.status(500).json({success: false, error: "Internal server error" });
  }
}

resend_otp = async (req :Request , res :Response)=> {
  try {
    const email = req.body.email;
    res.clearCookie('otp')
    const response : any = await userRabbitMQClient.produce(email,"resend-otp")
    res.cookie("otp", response.newOtp, {httpOnly:true});
    return res.json({success:true, message:"Otp resent successfully"});

} catch (error) {
    console.log("Error during login with google auth", error);
    return res.status(500).json({success: false, error: "Internal server error" });
}
}

loginWithGoogle = async (req: Request, res: Response) => {
  try {
      const response : any = await userRabbitMQClient.produce(req.body,"google-login")
          if (!response.success||!response || !response.user_data || !response.accessToken || !response.refreshToken) {
              return res.status(500).json({ error: "Invalid response from Google login service" });
          }
          const options = generateTokenOptions();
          res.cookie(
            "refreshToken",
            response.refreshToken,
            options.refreshTokenOptions
          );
          res.cookie("accessToken", response.accessToken, options.accessTokenOptions);
          return res.status(StatusCode.Accepted).json(response);
      }
  catch (error) {
      console.log("Error during login with google auth", error);
      return res.status(500).json({ error: "Internal server error" });
  }
}

check_account = async (req:Request,res:Response)=>{
  try{

    const email =  req.body.email
    const response : any = await userRabbitMQClient.produce(email,"check-account")
    if(response.isLogin){
      res.cookie("user", JSON.stringify(response.user_data), { httpOnly: true });
      return res.status(200).json({success: true, created:true, message: "account exists" ,email :response.email});
    }else{
      res.cookie("otp", response.otp, {httpOnly:true});
      res.cookie("user", JSON.stringify(response.user_data), { httpOnly: true });
      return res.status(200).json({ email:response.user_data.email, created:false, success: response.success, message: response.message });
    }
  }catch(err){
    console.log(err);
    return res.status(500).json({ success:false ,message: "Internal server error" });
  }
}

update_password = async (req:Request ,res :Response)=>{
  try{
      const userData = {
        email : req.body.email,
        password : req.body.password
      }
      const response : any= await userRabbitMQClient.produce(userData,"update-password")
      if(response.success){
          return res.status(StatusCode.Created).json({success:true,message:"password changed"})
      }
      return res.status(StatusCode.ExpectationFailed).json({success:false,message:"failed to update password"})
  }catch(err){
      console.log(err);
      
  }
}

  getUser = async (req:Request , res:Response)=>{
    try{
      const userId = req.query.id
      const response = await userRabbitMQClient.produce(userId,'get-user')
      return res.status(StatusCode.Created).json(response)
    }catch(err){
        console.log(err);
    }
  }

  updateUser = async (req:Request , res:Response)=>{
    try{
      const data = req.body
        const response = await userRabbitMQClient.produce(data,'update-user')
        return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  resetPassword = async (req:Request,res:Response)=>{
    try{
      const data =req.body
      const response = await userRabbitMQClient.produce(data,'reset-password')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  addTraveller = async (req:Request ,res:Response)=>{
    try{
      const data = req.body
      const response = await userRabbitMQClient.produce(data,'add-traveller')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  getTravellers = async(req:Request,res:Response)=>{
    try{
      const userId = req.query.id
      const response = await userRabbitMQClient.produce(userId,'get-travellers')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  saveTravellers = async(req:Request,res:Response)=>{
    try{
      const response = await userRabbitMQClient.produce(req.body,'save-travellers')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  deleteTraveller = async(req:Request,res:Response)=>{
    try{
      const id = req.params.id
      const response = await userRabbitMQClient.produce(id,'delete-traveller')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }


  
}





  

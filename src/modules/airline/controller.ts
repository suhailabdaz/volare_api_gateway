import { Request, Response, NextFunction } from 'express';
import airlineRabbitMQClient from './rabbitmq/client';
import { generateTokenOptions } from '../../utils/generateTokenOptions';
import { StatusCode } from '../../interfaces/enum';
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

export default class airlineController {
  register = async (req: Request, res: Response) => {
    try {
      console.log(req.body.email);
      const email = req.body.email;
      const response: any = await airlineRabbitMQClient.produce(
        email,
        'register'
      );
      if (!response.doExist) {
        res.cookie('otp', response.otp, { httpOnly: true });
      }
      // res.cookie("user", JSON.stringify(response.user_data), { httpOnly: true });
      return res.status(StatusCode.Accepted).json(response);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      console.log(
        'the req in verify',
        req.cookies.otp,
        req.body,
        'the req in verify'
      );

      let response: any;
      const enteredOtp = req.body.otp;
      const otp = req.cookies.otp;
      if (enteredOtp === otp) {
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
        const { airline_name, airline_code, airline_email, airline_password } =
          req.body;

        const airlineData = {
          airline_name,
          airline_code,
          airline_email,
          airline_password,
          airline_image_link: imageName,
        };

        response = await airlineRabbitMQClient.produce(
          airlineData,
          'create-account'
        );

        const options = generateTokenOptions();
        res.cookie(
          'refreshToken',
          response.refreshToken,
          options.refreshTokenOptions
        );
        res.cookie(
          'accessToken',
          response.accessToken,
          options.accessTokenOptions
        );
        response.success = true;
        return res.status(StatusCode.Created).json(response);
      } else {
        return res.status(StatusCode.Accepted).json({ success: false });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      console.log(req.body);

      const response: any = await airlineRabbitMQClient.produce(
        req.body,
        'login'
      );
      if (response.success) {
        const options = generateTokenOptions();
        res.cookie(
          'refreshToken',
          response.refreshToken,
          options.refreshTokenOptions
        );
        res.cookie(
          'accessToken',
          response.accessToken,
          options.accessTokenOptions
        );
        return res.status(StatusCode.Accepted).json(response);
      }
      return res.status(StatusCode.Accepted).json(response);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };

  getImage = async (req: Request, res: Response) => {
    try {
      const key = req.query.key?.toString();
      const getObjectParams = {
        Bucket: bucketName,
        Key: key,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return res.status(StatusCode.Accepted).json(url);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };

  addFlight = async (req: Request, res: Response) => {
    try {
      const response = await airlineRabbitMQClient.produce(
        req.body,
        'add-flight'
      );
      return res.status(StatusCode.Created).json(response);
    } catch (err) {
      console.log(err);
    }
  };

  getFlights = async(req:Request,res:Response)=>{ 
    try{
      const response = await airlineRabbitMQClient.produce(req.query.key,'get-flights')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  saveFlight = async(req:Request,res:Response)=>{ 
    try{
      const response = await airlineRabbitMQClient.produce(req.body,'save-flight')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }
  suspendFlight = async(req:Request,res:Response)=>{ 
    try{
      const response = await airlineRabbitMQClient.produce(req.body.id,'suspend-flight')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  getAirline = async(req:Request,res:Response)=>{ 
    try{
      const response = await airlineRabbitMQClient.produce(req.query.id,'get-airline')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  getFlight = async(req:Request,res:Response)=>{ 
    try{
      const response = await airlineRabbitMQClient.produce(req.query.id,'get-flight')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }

  userFlight = async(req:Request,res:Response)=>{ 
    try{
      const response = await airlineRabbitMQClient.produce('','all-flights')
      return res.status(StatusCode.Created).json(response)
    }catch(err:any){
      throw new Error(err)
    }
  }}

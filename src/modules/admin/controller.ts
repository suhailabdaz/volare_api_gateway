import { Request, Response, NextFunction } from 'express';
import adminRabbitMQClient from './rabbitmq/client';
import userRabbitMQClient from '../user/rabbitmq/client';
import airlineRabbitMQClient from '../airline/rabbitmq/client';
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

export default class adminController {
  login = async (req: Request, res: Response) => {
    try {
      const response: any = await adminRabbitMQClient.produce(
        req.body,
        'login'
      );
      if (response.success) {
        const options = generateTokenOptions();
        res.cookie(
          'authorityRefreshToken',
          response.refreshToken,
          options.refreshTokenOptions
        );
        res.cookie(
          'authorityAccessToken',
          response.accessToken,
          options.accessTokenOptions
        );
        return res.status(StatusCode.Accepted).json(response);
      } else {
        return res.json(response);
      }
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'hahahah' });
    }
  };
  getUsers = async (req: Request, res: Response) => {
    try {
      const role = req.query.role;
      let response;
      if (role == 'user') {
        response = await userRabbitMQClient.produce('', 'get-users');
      } else if (role == 'airline') {
        response = await airlineRabbitMQClient.produce('', 'get-airlines');
      }
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'hahahah' });
    }
  };
  blockUser = async (req: Request, res: Response) => {
    try {
      let success = false;
      const response_user: any = await userRabbitMQClient.produce(
        req.body.Id,
        'get-user'
      );
      if (response_user.user_data) {
        const response_status: any = await adminRabbitMQClient.produce(
          response_user.user_data,
          'user-status-reverse'
        );
        if (response_status) {
          const response_update = await userRabbitMQClient.produce(
            { id: response_status._id, values: response_status },
            'update-user'
          );
          if (response_update) {
            const response = await userRabbitMQClient.produce('', 'get-users');
            success = true;
            return res.status(StatusCode.Created).json(response);
          }
        }
      }
      if (!success) {
        return res.json({ succes: false, message: 'task failed' });
      }
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  };
  blockAirline = async (req: Request, res: Response) => {
    try {
      let success = false;
      const response_user: any = await airlineRabbitMQClient.produce(
        req.body.Id,
        'get-airline'
      );
      if (response_user.airline_data) {
        console.log('getairline');
        const response_status: any = await adminRabbitMQClient.produce(
          response_user.airline_data,
          'user-status-reverse'
        );
        if (response_status) {
          console.log('revers');

          const response_update = await airlineRabbitMQClient.produce(
            { id: response_status._id, values: response_status },
            'update-airline'
          );
          if (response_update) {
            console.log('update');

            const response = await airlineRabbitMQClient.produce(
              '',
              'get-airlines'
            );
            success = true;
            return res.status(StatusCode.Created).json(response);
          }
        }
      }
      if (!success) {
        return res.json({ succes: false, message: 'task failed' });
      }
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  };
  getCoupons = async (req:Request, res:Response)=>{
    try{
      const response =  await adminRabbitMQClient.produce("",'get-coupons')
      return res.status(StatusCode.Created).json(response);

    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  createCoupon = async (req:Request, res:Response)=>{
    try{
      const buffer = await sharp(req.file?.buffer)
      .resize({ height: 320, width: 480, fit: 'cover' })
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
    const { coupon_code, coupon_description, discount } =
      req.body;

    const couponData = {
      coupon_code,
      coupon_description,
      discount,
      coupon_image_link: imageName,
    };

      const response =  await adminRabbitMQClient.produce(couponData,'create-coupon')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  getBanners = async (req:Request, res:Response)=>{
    try{
      const response =  await adminRabbitMQClient.produce("",'get-banners')
      return res.status(StatusCode.Created).json(response);

    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  createBanner = async (req:Request, res:Response)=>{
    try{
      const buffer = await sharp(req.file?.buffer)
      .resize({ height: 320, width: 1280, fit: 'cover' })
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
    const { banner_content } =
      req.body;

    const bannerData = {
      banner_content,
      banner_image_link: imageName,
    };

      const response =  await adminRabbitMQClient.produce(bannerData,'create-banner')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }

  blockBanOrUpdate = async (req:Request, res:Response)=>{
    try{
      const { id, type } = req.body;
      const payload = {
        id,
        type,
      };
      const response =  await adminRabbitMQClient.produce(payload,'block-ban')
      return res.status(StatusCode.Created).json(response);
    } catch (error) {
      return res.status(500).json({ succes: false, message: 'task failed' });
    }
  }
}

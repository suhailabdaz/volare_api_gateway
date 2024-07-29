import { Request, Response, NextFunction } from 'express';
import adminRabbitMQClient from './rabbitmq/client';
import userRabbitMQClient from '../user/rabbitmq/client';
import { generateTokenOptions } from '../../utils/generateTokenOptions';
import { StatusCode } from '../../interfaces/enum';

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
      } else {
        response = await userRabbitMQClient.produce('', 'get-users');
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
}

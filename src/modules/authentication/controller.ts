import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { Tokens, UserCredentials } from "../../interfaces/interfaces";
import authRabbitMQClient from "./rabbitMQ/client";


export const isValidated = (async(req: Request, res: Response, next: NextFunction) => {
    try {  
      const token = req.cookies?.refreshToken || req.headers.authorization?.trim().split(" ")[1] || req.body.token;
    if (!token) {
      return res.status(StatusCode.Unauthorized).json({ message: "Token is missing" });
    }
    const result = await authRabbitMQClient.produce({ token }, "isAuthenticated") as UserCredentials
        if (result) {
          next()
        } else {
          res.status(StatusCode.Unauthorized).json({ success: false, message: "unauthorizes" });
        }
      ;
    } catch (error) {
      console.log(error);
      
    }
  }
);

export const refreshToken = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.refreshToken ||req.headers.authorization?.trim().split(" ")[1] || req.body.token;
    if (!token) {
      return res.status(StatusCode.Unauthorized).json({ message: "Token is missing" });
    }
    if (token) {
      const result = await authRabbitMQClient.produce({ token }, "verifyToken") as Tokens;
    if (result) {
      res.status(StatusCode.Created).json({
        success: true,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        message: "New token generated successfully",
      });
    } else {
      res.status(StatusCode.NotAcceptable).json({ message: "Invalid refresh token" });
    }
    } else {
      return res.status(StatusCode.Unauthorized).json({ message: "Token is missing" });
    }
  } catch (error) {
    console.log(error);
  }
};

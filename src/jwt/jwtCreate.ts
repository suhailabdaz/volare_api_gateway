import jwt from 'jsonwebtoken';
import 'dotenv/config'

interface UserPayload{
    id: string;
    email: string;
}

export const genenrateToken = (user: UserPayload)=>{
    const payload = {
        id: user.id,
        email: user.email
    };

    const options = {
        expiresIn: '1h'
    };

    return jwt.sign(payload, process.env.jwt_key as string, options)
}
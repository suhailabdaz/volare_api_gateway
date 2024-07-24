import express,{Application} from 'express'
import { refreshToken } from './controller'

const authRoute:Application=express()


authRoute.post('/refresh',refreshToken)

export default authRoute
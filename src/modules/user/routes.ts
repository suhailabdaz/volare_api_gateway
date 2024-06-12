import express,{Application} from 'express'
import userController from './controller'


const userRoute:Application = express()

const controller = new userController()




export default userRoute
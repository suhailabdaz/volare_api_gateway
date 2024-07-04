import express,{Application} from 'express'
import userController from './controller'

const userRoute : Application = express()

const controller = new userController()


userRoute.post('/login', controller.login)

export default userRoute
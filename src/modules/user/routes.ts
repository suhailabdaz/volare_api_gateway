import express,{Application} from 'express'
import userController from './controller'
import { isValidated } from '../authentication/controller'

const userRoute : Application = express()

const controller = new userController()


userRoute.post('/login', controller.login)
userRoute.post('/register',controller.register)
userRoute.post('/verify-otp',controller.verify_otp)
userRoute.post('/resend-otp',controller.resend_otp)
userRoute.post('/google-login',controller.loginWithGoogle)
userRoute.post('/check-account',controller.check_account)
userRoute.post('/update-password',controller.update_password)
userRoute.get('/get-user',isValidated,controller.getUser)
userRoute.post('/update-user',isValidated,controller.updateUser)
userRoute.patch('/reset-password',isValidated,controller.resetPassword)
userRoute.post('/add-traveller',isValidated,controller.addTraveller)
userRoute.get('/get-travellers',isValidated,controller.getTravellers)
userRoute.post('/save-travellers',isValidated,controller.saveTravellers)
userRoute.delete('/delete-traveller/:id',isValidated,controller.deleteTraveller)
export default userRoute
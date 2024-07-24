import express,{Application} from 'express'
import adminController from './controller'

const adminRoute : Application = express()

const controller = new adminController()


adminRoute.post('/login', controller.login)
adminRoute.post('/logout',controller.logout)


export default adminRoute
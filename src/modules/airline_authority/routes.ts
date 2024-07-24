import express,{Application} from 'express'
import authorityController from './controller'
import { isValidated } from '../authentication/controller'

const authorityRoute : Application = express()

const controller = new authorityController()


authorityRoute.post('/login', controller.login)
authorityRoute.post('/add-airport',isValidated,controller.addAirport)
authorityRoute.post('/save-airport',isValidated,controller.saveAirport)
authorityRoute.delete('/delete-airport/:id',isValidated,controller.deleteAirport)
authorityRoute.get('/get-airports',isValidated,controller.getAirports)
authorityRoute.post('/add-schedule',isValidated,controller.addSchedule)
authorityRoute.get('/get-schedules',isValidated,controller.getSchedules)




export default authorityRoute
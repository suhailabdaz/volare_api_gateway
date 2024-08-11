import express,{Application} from 'express'
import authorityController from './controller'
import { isValidated } from '../authentication/controller'

const authorityRoute : Application = express()

const controller = new authorityController()


authorityRoute.post('/login', controller.login)
authorityRoute.post('/add-airport',controller.addAirport)
authorityRoute.post('/save-airport',isValidated,controller.saveAirport)
authorityRoute.delete('/delete-airport/:id',isValidated,controller.deleteAirport)
authorityRoute.get('/get-airports',controller.getAirports)
authorityRoute.post('/add-schedule',isValidated,controller.addSchedule)
authorityRoute.get('/get-schedules',isValidated,controller.getSchedules)
authorityRoute.get('/available-schedules',isValidated,controller.getFreeSchedules)
authorityRoute.post('/save-schedule',isValidated,controller.saveSchedule)
authorityRoute.get('/airline-schedules',isValidated,controller.airlineSchedules)
authorityRoute.get('/search-schedules',controller.searchSchedules)









export default authorityRoute
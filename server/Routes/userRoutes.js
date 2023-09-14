import express from "express"
import {createUser, bookAppointments, getAllAppointments, cancelAppointments} from "../Controllers/userControllers.js"


const router = express.Router()


router.post ("/register", createUser)
router.post ("/bookVisit",bookAppointments)
router.get ("/getAllAppointments", getAllAppointments)
router.delete("/cancelAppointments", cancelAppointments)
export {router as userRoute}
import asyncHandler from  "express-async-handler"
import { prisma } from "../config/prismaConfig.js"


export const createUser = asyncHandler(async(req, res) =>{
console.log("creating a user")

let {email} = req.body
const userExists = await prisma.user.findUnique({where: {email: email}})
if(!userExists){
    let user=await prisma.user.create({data: req.body})
        res.send({
            message:"User Registered successfully",
            user: user,
        })}
else
    return res.status(409).send({message:"User already exists",})
}) 

//function to book an appointment
export const bookAppointments = asyncHandler(async(req, res) =>{
    const {email, date} = req.body
    const {id} = req.body
    try {
        const alreadyBooked = await prisma.user.findUnique({
            where:{email},
            select:{bookedVisits: true}
        })
        if(alreadyBooked.bookedVisits.some((visit)=> visit.id === id)){
            res.status(400).json({message:"Appointment already scheduled by you"})
        }
        else{
            await prisma.user.update({
                where: {email:email},
                data:{
                    bookedVisits:{push:{id,date}}
                }
                
            })
        }
        res.send("Appointment succesfully scheduled")
    } catch (err) {
        throw new Error(error.message)
        
    }




})
// Get all booked appointments of a user
export const getAllAppointments = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    try {
        const appointments = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        });

            res.status(200).send(appointments);
        
    } catch (err) {
        throw new Error(error.message);
    }
});

// Function to cancel Appointments
export const cancelAppointments = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const {id}= req.params
    try {
        const user = await prisma.user.findUnique({
            where : {email:email},
            select: {bookedVisits: true}
        })
        const index = user.bookedVisits.findIndex((visit)=>visit.id === id)
        if(index === -1){
            res.status(404).send({message: "Appointment not found"})

        } else{
            user.bookedVisits.splice(index,1)
            await prisma.user.update({
                where: {email:email},
                data:{
                    bookedVisits: user.bookedVisits
                }
            })
            res.send("Appointment cancelled successfully")
        }
        
    } catch (err) {
        throw new Error(err.message)
    }
})

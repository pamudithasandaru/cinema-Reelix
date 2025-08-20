import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking";


//API Controller Function to Get User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const user = req.auth().userId;

        const bookings = await Booking.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createAt: -1 })
        res.json({success: true,bookings})
    } catch(error) {
        console.error(error.message);
        res.json({ success: false, message: error.message});
    }
}

//API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res)=>{
    try {
        const { movieId } = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})

        res.json({success: true, message: "Favorite movies updated" })
    } catch(error){
        console.error(error.message);
        res.json({ success: false, message: error.message});
    }
}
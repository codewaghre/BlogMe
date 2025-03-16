import mongoose from "mongoose"
import { DB_NAME } from "../constance.js"


const connectDB = async () => {

    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`Database Connected : ${connection.connection.host}`);

        mongoose.connection.on("error", (error) => {
            console.log(`DataBase Connection Error:- ${error} `);
        })

        mongoose.connection.on("disconnect", () => {
            console.log("MongoDb Discconected, Attempting to reconnect.....");
        })

        mongoose.connection.on('reconnected', () => {
            console.info('MongoDB reconnected successfully');
        });

    } catch (error) {
        console.log(` Error connection to DB:- ${error.message}`);
        process.exit(1)
    }
}

export default connectDB
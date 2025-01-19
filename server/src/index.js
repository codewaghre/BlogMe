import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/connect.db.js";

// setup dot env 
dotenv.config({
    path: './.env'
})


//test
// app.get("/", (req, res) => {
//     res.json({
//         name: "Abhishek Waghre",
//     })
// })

// connect database
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(` Server is Running On ${process.env.PORT}`);
    })
}).catch((error) => {
    console.log(`Database Connection Failed!!!`, error);
})











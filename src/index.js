
import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js";


dotenv.config({
    path:'./env'
})

const app = express()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running at port${process.envPORT}`)
    })
})
.catch((error) => {
    console.log("MONGODB Connection failed!",error);
    
})

















// (async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror",(error)=>{

//             console.log("ERRR:",error);
//             throw error

//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     }catch(error){
//         console.error("ERROR ",error)
//         throw err

//     }
// })()




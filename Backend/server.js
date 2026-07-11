import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import csvRouter from "./Routes/CSV.upload.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.use("/api/csv",csvRouter)
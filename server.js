import admrouter from "./routes/admin.js"
import signroute from "./routes/sign.js"
import emailrouter from "./routes/Emailver.js"
import dotenv from "dotenv";
import express, { json } from "express"
import { PrismaClient } from '@prisma/client'
import cors from "cors"

const Prisma = new PrismaClient()
const app = express()
app.use(cors());

app.use(admrouter)
app.use(signroute)
app.use(emailrouter)
app.use(express.json())

app.get("/", async (req,res) =>{
    res.send("Rodando...")
})

const porta = process.env.PORT || 3000;
app.listen(porta, function(){
    console.log(`App ligado em ${porta}`)
})
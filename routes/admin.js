import express, { json } from "express"
import { PrismaClient } from '@prisma/client'


const Prisma = new PrismaClient()
const admrouter = express.Router()
admrouter.use(express.json())
admrouter.get("/users", async (req,res) =>{
    try{
        const users = await Prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }})

    admrouter.delete("/del", async(req,res) =>{
        try{
            const {id, email} = req.body
            const user = await Prisma.user.findUnique({
                where:{
                    id: id,
                    email: email
                }
            })
            user.delete
            return res.status(200).json({user})
        }
        catch(err){res.console("erro ao deletar: "+err)}
    })
export default admrouter
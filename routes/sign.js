import express, { json } from "express"
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import authenticateToken from './auth.js';
import sendVerificationEmail from "../API/email.js"

const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY
const signroute = express.Router()
signroute.use(express.json());

signroute.post("/sign", async (req,res) =>{
    const { username, password, email } = req.body;

    console.log("Dados recebidos:", req.body); // Log dos dados recebidos
  
    // Verifica se todos os campos foram fornecidos
    if (!username || !password || !email) {
      console.error("Campos obrigatórios faltando:", { username, password, email });
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
  
    try {
      // Gera um token de verificação
      const Etoken = crypto.randomBytes(32).toString("hex");
  
      console.log("Criando usuário no banco de dados..."); // Log antes de criar o usuário
  
      // Cria o usuário no banco de dados
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: await bcrypt.hash(password, 10), // Hash da senha
          EToken: Etoken,
        },
      });
  
      console.log("Usuário criado com sucesso:", user); // Log do usuário criado
      sendVerificationEmail(user.email, Etoken)
  
      // Retorna sucesso em JSON
      res.json({ message: "Usuário criado com sucesso!", user });
    } catch (err) {
      console.error("Erro ao criar usuário:", err); // Log do erro
  
      // Retorna erro em JSON
      res.status(500).json({ error: "Erro ao criar usuário", details: err.message });
    }
  });


signroute.post("/login", async (req,res) =>{
try{
    const {email, password} = req.body
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!user || !isPasswordValid){
        return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const payload = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
      res.json({ token })
}catch(err){
    res.send("erro ao achar: "+err)}})


signroute.get("/dados", authenticateToken, async (req, res) => {
        try {
          // Acessa as informações do usuário decodificadas do token
          const userId = req.user.id;
      
          // Busca os dados do usuário no banco de dados
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, email: true }, // Seleciona apenas os campos necessários
          });
      
          if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }
      
          // Retorna os dados do usuário
          res.json(user);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          res.status(500).json({ error: "Erro ao buscar dados do usuário" });
        }
      });
      

export default signroute
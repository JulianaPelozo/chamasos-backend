import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import {login, registerLogin} from './Controllers/userController'
import userRoutes from './Routes/userRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = "mongodb+srv://juliana-pelozo:bombeiros123@cluster0.pmtmn.mongodb.net/?appName=Cluster0";
const JWT_SECRET = "secret";

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', userRoutes)

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI não está no arquivo .env');
}

if (!JWT_SECRET) { 
  throw new Error('JWT_SECRET não está no arquivo .env');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB')
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar com MongoDB:', error)
  })

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})
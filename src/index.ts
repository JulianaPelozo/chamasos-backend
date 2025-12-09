import express from "express";
import cors from "cors";
import "express-async-errors";
import { AppDataSource } from "./data-source";
import ocorrenciasRoutes from "./routes/ocorrencias";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));
app.use(express.json());

// Rotas Públicas
app.use("/api/auth", authRoutes);

// Rotas Protegidas
app.use("/api/ocorrencias", ocorrenciasRoutes);

// Rota inicial
app.get("/", (req, res) => {
    res.json({ 
        message: "API Chama SOS - Bombeiros RMR",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            ocorrencias: "/api/ocorrencias"
        }
    });
});

// Rota de saúde
app.get("/health", (req, res) => {
    res.json({ 
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// Inicializar banco de dados e servidor
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Banco de dados conectado!");
        
        app.listen(PORT, () => {
            console.log(`🚒 Servidor Chama SOS rodando na porta ${PORT}`);
            console.log(`🌐 API disponível em: http://localhost:${PORT}`);
            console.log(`📚 Documentação: http://localhost:${PORT}/`);
        });
    })
    .catch((error) => {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
    });
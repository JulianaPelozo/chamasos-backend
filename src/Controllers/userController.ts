import {Request, Response} from "express";
import Login from "../Models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const getAllLogins = async (req: Request, res: Response) => {
    try {
        const logins = await Login.find().select('-password'); // Não retorna a senha
        res.status(200).json(logins);
    } catch (error) {
        console.error('❌ ERRO AO BUSCAR LOGINS:', error);
        res.status(500).json({message: "Erro ao buscar logins."});
    }
};

export const getLoginById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const loginData = await Login.findById(id).select('-password');
        
        if (!loginData) {
            return res.status(404).json({message: "Login não encontrado."});
        }
        
        res.status(200).json(loginData);
    } catch (error) {
        console.error('❌ ERRO AO BUSCAR LOGIN:', error);
        res.status(500).json({message: "Erro ao buscar login."});
    }
};

export const registerLogin = async (req: Request, res: Response) => {
    const {firstName, lastName, email, password, phone, CPF, role} = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !CPF || !role) {
        return res.status(400).json({message: "Todos os campos são obrigatórios."});
    }
    
    try {
        const existingUser = await Login.findOne({$or: [{email}, {CPF}]});
        if (existingUser) {
            return res.status(400).json({message: "Usuário já existe."});
        }

        const cript = await bcrypt.genSalt(10);
        const login = new Login({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, cript),
            phone,
            CPF,
            role
        });
        await login.save();

        res.status(201).json({message: "Usuário criado com sucesso."});
    } catch (error) {
        console.error('❌ ERRO COMPLETO NO REGISTRO:', error);  // <- ADICIONADO
        res.status(500).json({message: "Erro no servidor."});
    }
};

export const login = async (req: Request, res: Response) => {
    const {identifier, password} = req.body;

    if (!identifier || !password) {
        return res.status(400).json({message: "Email e senha são obrigatórios."});
    }

    try {
        const user = await Login.findOne({$or: [{email: identifier}, {CPF: identifier}]});
        if (!user) {
            return res.status(404).json({message: "Usuário não encontrado."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: "Senha incorreta."});
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            CPF: user.CPF,
            role: user.role
        }, process.env.JWT_SECRET || "secret", {expiresIn: "1h"});
        
        res.status(200).json({token});  // <- CORRIGIDO
    } catch (error) {
        console.error('❌ ERRO COMPLETO NO LOGIN:', error);
        res.status(500).json({message: "Erro no servidor."});
    }
};
import prisma from "../database/db.config";
import { Request, Response } from "express";

export const signup = async (req: Request , res : Response) => {
    const {name , email , password} = req.body;

    try {
        const newUser = await prisma.user.create({
            data : {
                name,
                email,
                password
            }
        })

        res.status(201).json({
            message : "User created successfully",
            user : newUser
        })
    }
    catch (error) {
        let errorMessage = "Internal server error";

        if(error instanceof Error) {
            errorMessage = error.message
        } else if (typeof error === "string") {
            errorMessage = error
        }

        res.status(500).json({
            message : "Internal server error",
            error : errorMessage
        })
    }
}

export const login = async (req: Request , res : Response) => {
    const {email , password} = req.body;

    try {
        const findUser = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!findUser) {
            return res.status(404).json({
                message : "User not found"
            })
        }

        if(findUser.password !== password) {
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }

        res.status(200).json({
            message : "Login successful",
            user : findUser
        })

    } catch (error) {
        let errorMessage = "Internal server error";

        if(error instanceof Error) {
            errorMessage = error.message
        } else if (typeof error === "string") {
            errorMessage = error
        }

        res.status(500).json({
            message : "Internal server error",
            error : errorMessage
        })
    }

}
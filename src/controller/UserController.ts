import prisma from "../database/db.config";
import { Request, Response } from "express";
import { passwordSchema , emailSchema } from "../Schema/validation";
import bcrypt from "bcrypt";

export const signup = async (req: Request , res : Response) => {
    const {name , email , password} = req.body;

    try {

        if (!name || !email || !password) {
            res.status(400).json({
                message : "All fields are required"
            })
        }
        
        const emailValidation = emailSchema(email);

        // Check if email is already in use

        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(existingUser) {
            res.status(409).json({
                message : "Email already in use"
            })
        }

        if (emailValidation !== true) {
            res.status(400).json({
                message : emailValidation
            })
        }

        const passwordValidation = passwordSchema(password);

        if (passwordValidation !== true) {
            res.status(400).json({
                message : passwordValidation
            })
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await prisma.user.create({
            data : {
                name,
                email,
                password : hashedPassword
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

        const emailValidation = emailSchema(email);

        if (emailValidation !== true) {
            res.status(400).json({
                message : emailValidation
            })
        }

        if (!email || !password) {
            res.status(400).json({
                message : "All fields are required"
            })
        }

        const passwordValidation = passwordSchema(password);

        if (passwordValidation !== true) {
            res.status(400).json({
                message : passwordValidation
            })
        }

        const findUser = await prisma.user.findUnique({
            where : {
                email
            }
        })

        // compare password with hashed password

        if(!findUser || findUser.password === null) {
            res.status(404).json({
                message : "User not found "
            })

            return;
        }
        
        const isMatch = await bcrypt.compare(password, findUser.password);

        // if password is not matched

        if(!isMatch) {
            res.status(401).json({
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
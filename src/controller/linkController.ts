import prisma from "../database/db.config";
import { nanoid } from "nanoid";

import { Request, Response } from "express";

const createLink = async (req: Request , res : Response) => {
    const {ContentId}  = req.body;

    try {
        const findLink = await prisma.content.findUnique({
            where : {
                id : ContentId
            }, 
            include : {
                link : true
            }
        })

        if(findLink) {
            res.status(200).json({
                message : "Link already exists",
                link : findLink.link
            })
        }

        const newLink = await prisma.link.create({
            data : {
                hash : nanoid(10),
                user : {
                    connect : {
                        id : req.user.id
                    }
                },

                content : {
                    connect : {
                        id : ContentId
                    }
                }
            }
        })
    } catch (error) {
        
    }
}
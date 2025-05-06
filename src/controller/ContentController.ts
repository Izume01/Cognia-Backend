import prisma from "../database/db.config";

import { Request, Response } from "express";

type ContentType = "Image" | "Video" | "Article" | "Audio";

export const createContent = async (req: Request, res: Response) => {
  const { title, type, tags, userId } = req.body;

  try {
    const content = await prisma.content.create({
      data: {
        title,
        type: type as ContentType,
        user: {
          connect: { id: userId },
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { title: tag },
            create: { title: tag },
          })),
        },
      },
      include: {
        user: true,
        tags: true,
      },
    });

    res.status(201).json({
      message: "Content created successfully",
      content,
    });
  } catch (error) {
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    res.status(500).json({
      message: "Internal server error",
      error: errorMessage,
    });
  }
};

export const fetchAllContent = async (req: Request, res: Response) => {
    try {
        const content = await prisma.content.findMany({
        include: {
            user: true,
            tags: true,
        },
        });
    
        res.status(200).json({
        message: "Content fetched successfully",
        content,
        });
    } catch (error) {
        let errorMessage = "Internal server error";
    
        if (error instanceof Error) {
        errorMessage = error.message;
        } else if (typeof error === "string") {
        errorMessage = error;
        }
    
        res.status(500).json({
        message: "Internal server error",
        error: errorMessage,
        });
    }
}

export const deleteContent = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const content = await prisma.content.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json({
            message: "Content deleted successfully",
            content,
        });
    } catch (error) {
        let errorMessage = "Internal server error";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        res.status(500).json({
            message: "Internal server error",
            error: errorMessage,
        });
    }
}


// What left 
// Create a shareable link          POST /api/v1/brain/:id/share
//Fetch another user's shared       GET /api/v1/brain/:shareLink
// LEARN GENERICS FFS && Revise Schema prisma


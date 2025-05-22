import prisma from "../database/db.config";
import {v4 as uuidv4} from "uuid";

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

export const shareContent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id: Number(id) },
      include: { user: true }
    });

    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    // If already has link, return existing one
    if (content.linkId) {
      const existingLink = await prisma.link.findUnique({
        where: { id: content.linkId }
      });

      res.status(200).json({
        message: "Already shared",
        shareLink: `/api/v1/brain/${existingLink?.hash}`,
      });
    }

    // Generate a unique hash
    const hash = uuidv4().split('-')[0];

    // Create the share link
    const link = await prisma.link.create({
      data: {
        hash,
        userId: content.userId,
        content: {
          connect: { id: content.id }
        }
      }
    });

    res.status(201).json({
      message: "Link created successfully",
      shareLink: `/api/v1/brain/${link.hash}`,
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


export const fetchSharedContent = async (req: Request, res: Response) => {
  const { hash } = req.params;

  try {
    const link = await prisma.link.findUnique({
      where: { hash: hash },
      include: {
        content: {
          include: {
            user: true,
            tags: true,
          },
        },
      },
    });

    if (!link || !link.content) {
      res.status(404).json({ message: "Shared content not found" });
      return;
    }

    res.status(200).json({
      message: "Shared content fetched successfully",
      content: link.content,
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};



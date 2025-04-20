import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import prisma from "@/lib/prisma";

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fileType } = req.body; // fileType will be 'cover' or 'proof'
    let folder = "";

    if (fileType === "cover") {
      folder = "./public/uploads/cover";
    } else if (fileType === "proof") {
      folder = "./public/uploads/proof";
    }

    cb(null, folder); // Specify the folder where the file will be saved
  },
  filename: (req, file, cb) => {
    // Use the original file name with timestamp to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer
const upload = multer({ storage });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Handle file upload
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error" });
      }

      // Extract necessary data from request
      const { file } = req;
      const { itemId, fileType } = req.body; // fileType is 'cover' or 'proof'

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        // Update the publication record in the database based on fileType
        if (fileType === "cover") {
          await prisma.publication.update({
            where: { id: parseInt(itemId) },
            data: { publication_book_cover: `/uploads/cover/${file.filename}` },
          });
        } else if (fileType === "proof") {
          await prisma.publication.update({
            where: { id: parseInt(itemId) },
            data: {
              publication_authenticity_proof: `/uploads/proof/${file.filename}`,
            },
          });
        }

        return res
          .status(200)
          .json({ message: "File uploaded and data updated successfully" });
      } catch (error) {
        return res.status(500).json({ message: "Server error", error });
      }
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

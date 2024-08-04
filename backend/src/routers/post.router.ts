import express, { Request, Response } from "express";
import multer from "multer";
import { bucket } from "../../firebase.config"; // Import your Firebase config
import Image from "../models/post.model";
import auth from "../middlewares/auth.mid";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../models/user.model";
import Comment from "../models/comments.model";

const router = express.Router();
router.use(auth);

const storage = multer.memoryStorage(); // Use memory storage for in-memory file handling
const upload = multer({ storage });

router.post(
  "/images",
  upload.single("image"),
  asyncHandler(async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { title } = req.body;
      const imageBuffer = req.file.buffer;
      const fileName = `postsImages/${uuidv4()}_${req.file.originalname}`;
      const file = bucket.file(fileName);

      // Upload file to Firebase Storage
      await file.save(imageBuffer, {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(), // Token for access
        },
      });

      // Generate URL for the uploaded file
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileName)}?alt=media&token=${uuidv4()}`;

      // Save image data to MongoDB
      const newImage = new Image({
        title,
        imageUrl,
        author: req.user.id,
      });
      await newImage.save();

      res.status(200).json({ message: "Image saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

router.get("/images", async (req: Request, res: Response) => {
  try {
    const images = await Image.find(
      {},
      "_id title imageUrl author comments createdAt"
    ).populate("comments");

    images.sort(
      (a, b) =>
        (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()
    );

    const imagesWithAuthors = await Promise.all(
      images.map(async (image) => {
        const author = await UserModel.findById(image.author);
        if (author) {
          return {
            _id: image._id,
            title: image.title,
            imageUrl: image.imageUrl,
            authorName: author.name,
            author: author._id,
          };
        } else {
          return null; // Handle the case where the author is not found
        }
      })
    );

    const validImagesWithAuthors = imagesWithAuthors.filter(
      (image) => image !== null
    );

    // Return an empty array if there are no valid images
    res.json(validImagesWithAuthors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/images/:postId",
  asyncHandler(async (req: any, res: any) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.id;

      // Find the post in MongoDB
      const post = await Image.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.author.toString() !== userId) {
        return res.status(403).json({ message: "Permission denied" });
      }

      // Delete post record from MongoDB
      await Image.deleteOne({ _id: postId });
      await Comment.deleteMany({ post: postId });

      // Extract the file path from the URL
      const fullUrl = post.imageUrl;

      // Parse URL to get the path
      const url = new URL(fullUrl);
      const path = url.pathname; // This will get '/o/postsImages/your-image.jpg'
      const pathStart = path.indexOf("/o/") + 3; // Find the start of the path
      const encodedPath = path.substring(pathStart); // Extract the path after '/o/'

      // Decode the URL-encoded path
      const filePath = decodeURIComponent(encodedPath);

      // console.log(`Attempting to delete file: ${filePath}`);

      // Delete the image from Firebase Storage
      const file = bucket.file(filePath);
      await file.delete();

      res.json({ message: "Post and image deleted successfully" });
    } catch (error) {
      console.error("Failed to delete image from Firebase Storage:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

export default router;

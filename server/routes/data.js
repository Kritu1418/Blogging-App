import express from "express";
import Blog from "../model/Blog.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ROUTE 1: Naya Blog Post Create Karna (Ab Secure Hai)
router.post("/create", verifyToken, async (req, res) => {
  const { title, summary, image, content } = req.body;
  const authorId = req.user.userId; // Middleware se user ki ID mili (ye secure hai)

  if (!title || !summary || !content || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newPost = await Blog.create({
      title,
      summary,
      image,
      content,
      author: authorId,
    });
    res.status(201).json({ message: "Blog created successfully!", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// ROUTE 2: Saare Blog Posts Dikhana (Naya Feature)
router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", ["email"]) // Author ka email bhi saath mein aayega
      .sort({ createdAt: -1 }); // Naye post sabse upar
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ROUTE 3: Ek Blog Post Delete Karna (Ab Secure Hai)
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const authorId = req.user.userId;

  try {
    const post = await Blog.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Yahan check ho raha hai ki user asli author hai ya nahi
    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "Action not allowed. You are not the author." });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog post deleted successfully!" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// ROUTE 4: Ek Blog Post Update Karna (Ab Secure Hai)
router.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const authorId = req.user.userId;
    const { title, summary, image, content } = req.body;

    try {
        const post = await Blog.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== authorId) {
            return res.status(403).json({ message: "Action not allowed. You are not the author." });
        }

        post.title = title || post.title;
        post.summary = summary || post.summary;
        post.image = image || post.image;
        post.content = content || post.content;

        await post.save();
        res.status(200).json({ message: "Blog post updated successfully!", post });

    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Failed to update post" });
    }
});

export default router;
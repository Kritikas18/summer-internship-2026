import User from "./models/User";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/Note";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));




//seedDatabase();

function searchNotesInDatabase(query: string): any[] {
  if (!query) return notes;
  const lowerQuery = query.toLowerCase();
  return notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(lowerQuery) ||
      note.description.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.subject.toLowerCase().includes(lowerQuery) ||
      note.institution.toLowerCase().includes(lowerQuery) ||
      note.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}
app.get("/api/notes", async (req, res) => {
  try {
    const { search, subject, tag, institution } = req.query;

    let query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { institution: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search as string, "i")] } }
      ];
    }

    if (subject) {
      query.subject = subject;
    }

    if (tag) {
      query.tags = tag;
    }

    if (institution) {
      query.institution = {
        $regex: institution,
        $options: "i"
      };
    }

    const notes = await Note.find(query);

    res.json(notes);

  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ id: req.params.id });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.views = (note.views || 0) + 1;
    await note.save();

    res.json(note);

  } catch (err) {
    res.status(500).json(err);
  }
});


app.post("/api/notes", async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      subject,
      institution,
      tags,
      creatorId,
      creatorName,
      creatorAvatar,
      fileType,
      fileName,
      fileSize,
      isPremium,
      price,
      qrCodeUrl,
      isCollaborative,
    } = req.body;

    if (!title || !content || !subject || !institution) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const newNote = new Note({
      id: `note-${Date.now()}`,
      title,
      description: description || `Study guide on ${subject}`,
      content,
      subject,
      institution,
      tags: tags || [],
      creatorId: creatorId || "anonymous-user",
      creatorName: creatorName || "Anonymous Creator",
      creatorAvatar:
        creatorAvatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${
          creatorName || "anon"
        }`,

      createdAt: new Date(),

      fileType: fileType || "text",
      fileName:
        fileName ||
        `${title.toLowerCase().replace(/\s+/g, "_")}.txt`,
      fileSize: fileSize || "12 KB",

      isPremium: !!isPremium,
      price: isPremium ? Number(price || 199) : undefined,
      qrCodeUrl: isPremium
        ? qrCodeUrl ||
          "https://api.qrserver.com/v1/create-qr-code/?size=150x150"
        : undefined,

      rating: 5,
      ratingsCount: 0,
      views: 0,
      downloads: 0,

      isCollaborative: !!isCollaborative,

      versions: [
        {
          id: `v-${Date.now()}`,
          version: 1,
          updatedAt: new Date(),
          updatedBy: creatorName || "Anonymous Creator",
          title,
          content,
          changeSummary: "Original Upload",
        },
      ],

      annotations: [],
      comments: [],
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json(err);
  }
});
app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json({
      error: "User already exists",
    });
  }
});
app.post("/api/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid Email or Password",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
    });
  }
});
app.delete("/api/notes/:id", async (req, res) => {
  try {
    console.log("Deleting ID:", req.params.id);

    const deleted = await Note.findByIdAndDelete(req.params.id);

    console.log("Deleted Note:", deleted);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Server Error",
    });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

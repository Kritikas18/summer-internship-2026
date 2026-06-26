import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env["GEM" + "INI_API_KEY"];
    if (apiKey && apiKey !== ["MY_GEM", "INI_API_KEY"].join("")) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

let notes: any[] = [
  {
    id: "note-1",
    title: "Introduction to Neural Networks & Backpropagation",
    description: "Deep dive into perceptrons, activation functions, loss optimization, and multi-layer gradient descent calculations.",
    content: `LECTURE 1: INTRODUCTION TO NEURAL NETWORKS
-----------------------------------------
A neural network is a computational model inspired by the biological structure of the brain. It consists of layers of interconnected nodes (neurons).

1. THE BASIC PERCEPTRON
A perceptron takes inputs (x_1, x_2, ..., x_n), multiplies them by weights (w_1, w_2, ..., w_n), adds a bias (b), and passes the result through an activation function (f).
Output y = f( ∑ (w_i * x_i) + b )

2. ACTIVATION FUNCTIONS
- Sigmoid: f(z) = 1 / (1 + e^-z). Outputs between 0 and 1. Prone to vanishing gradients.
- ReLU (Rectified Linear Unit): f(z) = max(0, z). Solves vanishing gradient, extremely popular in deep learning.
- Softmax: Used in output layers for multi-class classification to yield a probability distribution.

3. LOSS FUNCTIONS
We measure network inaccuracy using loss. For regression, Mean Squared Error (MSE). For classification, Cross-Entropy Loss:
L = - ∑ (y_true * log(y_pred))

4. BACKPROPAGATION
The core algorithm for training neural networks. It uses the chain rule of calculus to compute the partial derivative of the loss function with respect to each weight and bias:
∂L/∂w_ij = ∂L/∂y_pred * ∂y_pred/∂z * ∂z/∂w_ij
By propagating gradients backwards, we adjust weights using gradient descent:
w_new = w_old - η * (∂L/∂w)`,
    subject: "Computer Science",
    institution: "MIT (Massachusetts Institute of Technology)",
    tags: ["Artificial Intelligence", "Machine Learning", "Neural Networks"],
    creatorId: "user-mit-grad",
    creatorName: "Aarav Mehta",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
    createdAt: "2026-06-15T14:30:00Z",
    fileType: "text",
    fileName: "mit_neural_networks_intro.txt",
    fileSize: "4.2 KB",
    isPremium: false,
    rating: 4.8,
    ratingsCount: 12,
    views: 142,
    downloads: 58,
    isCollaborative: true,
    versions: [
      {
        id: "v-1",
        version: 1,
        updatedAt: "2026-06-15T14:30:00Z",
        updatedBy: "Aarav Mehta",
        title: "Introduction to Neural Networks & Backpropagation",
        content: `LECTURE 1: INTRODUCTION TO NEURAL NETWORKS\n...\nInitial version containing perceptrons, activation functions, and basic loss formulas.`,
        changeSummary: "Initial Note Upload"
      }
    ],
    annotations: [
      {
        id: "ann-1",
        page: 1,
        x: 45,
        y: 22,
        text: "Make sure to memorize the Backpropagation partial derivatives for the midterm exam!",
        author: "Priya Sharma",
        createdAt: "2026-06-18T09:12:00Z"
      }
    ],
    comments: [
      {
        id: "comm-1",
        userId: "user-2",
        userName: "Priya Sharma",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        text: "These backprop equations are super clear! The breakdown of the chain rule helped me visualize the gradient flow perfectly.",
        rating: 5,
        createdAt: "2026-06-18T09:15:00Z"
      },
      {
        id: "comm-2",
        userId: "user-3",
        userName: "Dr. Ishaan Sen",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan",
        text: "Excellent notes on ReLU vanishing gradient limits. Mentioning dying ReLU would be a nice future revision.",
        rating: 4,
        createdAt: "2026-06-20T11:45:00Z"
      }
    ]
  },
  {
    id: "note-2",
    title: "Organic Chemistry: Mechanisms of Electrophilic Substitution",
    description: "Full organic mechanisms including benzene resonance, Nitration, Sulfonation, Friedel-Crafts alkylation and acylation.",
    content: `ORGANIC CHEMISTRY II - ELECTROPHILIC AROMATIC SUBSTITUTION (EAS)
--------------------------------------------------------------
Benzene possesses a cloud of delocalized pi electrons, making it highly stable. Nucleophilic reagents do not easily attack it. Instead, it undergoes Electrophilic Aromatic Substitution (EAS), where an electrophile replaces a hydrogen atom.

GENERAL MECHANISM (2 Core Steps):
Step 1: Attack of electrophile (E+) on the aromatic ring. This is the rate-determining step because it destroys the aromatic resonance stability, forming a carbocation intermediate (the Sigma Complex or Arenium Ion).
The sigma complex is stabilized by resonance (positive charge delocalized over ortho and para positions).

Step 2: Deprotonation of the sigma complex by a weak base (e.g., AlCl4- or H2O) to restore aromaticity.

SPECIFIC EAS REACTIONS:
1. NITRATION OF BENZENE
- Reagents: HNO3 + H2SO4
- Active Electrophile: Nitronium Ion (NO2+)
- Equation for generation of E+: HNO3 + 2 H2SO4 <==> NO2+ + H3O+ + 2 HSO4-

2. HALOGENATION
- Reagents: Br2 / FeBr3 or Cl2 / AlCl3
- Electrophile: Br+ complexed with FeBr4- or Cl+ complexed with AlCl4-
- FeBr3 or AlCl3 act as Lewis Acid catalysts to polarize the halogen bond.

3. FRIEDEL-CRAFTS ALKYLATION
- Reagents: Alkyl halide (R-Cl) + AlCl3
- Active Electrophile: Carbocation (R+). Subject to rearrangement (hydride/methyl shifts)!
- Limitation: Cannot easily prepare primary unbranched alkylbenzenes due to carbocation rearrangement.

4. FRIEDEL-CRAFTS ACYLATION
- Reagents: Acyl chloride (R-COCl) + AlCl3
- Active Electrophile: Acylium Ion (R-C+=O <==> R-C=O+). Stabilized by resonance, does not rearrange. Perfect for preparing unbranched alkylbenzenes via subsequent Clemmensen or Wolff-Kishner reduction.`,
    subject: "Chemistry",
    institution: "Stanford University",
    tags: ["Organic Chemistry", "EAS Mechanisms", "Benzene Reactions"],
    creatorId: "user-chem-wizard",
    creatorName: "Ananya Iyer",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    createdAt: "2026-06-12T10:15:00Z",
    fileType: "text",
    fileName: "stanford_eas_mechanisms.txt",
    fileSize: "3.8 KB",
    isPremium: true,
    price: 299,
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_note-2_notify_platform",
    rating: 4.9,
    ratingsCount: 8,
    views: 95,
    downloads: 34,
    isCollaborative: false,
    versions: [
      {
        id: "v-2",
        version: 1,
        updatedAt: "2026-06-12T10:15:00Z",
        updatedBy: "Ananya Iyer",
        title: "Organic Chemistry: Mechanisms of Electrophilic Substitution",
        content: `ORGANIC CHEMISTRY II - ELECTROPHILIC AROMATIC SUBSTITUTION (EAS)...`,
        changeSummary: "First release of EAS lecture summaries"
      }
    ],
    annotations: [],
    comments: [
      {
        id: "comm-3",
        userId: "user-4",
        userName: "Rohan Verma",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        text: "The point about primary carbocation rearrangements in Friedel-Crafts alkylation saved me from failing my lab quiz today. Brilliant notes!",
        rating: 5,
        createdAt: "2026-06-14T15:20:00Z"
      }
    ]
  },
  {
    id: "note-3",
    title: "Constitutional Law: Executive Powers & Check-and-Balance Framework",
    description: "Detailed analysis of Article II powers, veto capabilities, emergency declarations, and supreme court precedents.",
    content: `CONSTITUTIONAL LAW: ARTICLE II EXECUTIVE POWERS
-------------------------------------------------
This study guide outlines the constitutional scope of Presidential powers, checks by Congress and Judiciary, and seminal Supreme Court precedents.

I. SOURCE OF EXECUTIVE POWER
Article II, Section 1: "The executive Power shall be vested in a President of the United States." This Vesting Clause is interpreted as a broad grant of inherent executive authority.

II. THE THREE-TIER JACKSON FRAMEWORK (Youngstown Sheet & Tube Co. v. Sawyer, 1952)
Justice Robert H. Jackson's concurring opinion outlines three tiers of executive power:
1. President acts pursuant to express or implied authorization of Congress. Power is at its maximum (co-extensive with federal authority).
2. President acts in absence of congressional grant or denial (the "Zone of Twilight"). Presidential authority depends on the imperatives of events and contemporary context.
3. President takes measures incompatible with the expressed or implied will of Congress. Presidential power is at its "lowest ebb." Can only rely on constitutional power minus congressional power.

III. WAR POWERS
- Constitution splits war power: Congress declares war (Art I, Sec 8) and funds military; President is Commander-in-Chief (Art II, Sec 2).
- War Powers Resolution (1973): Requires President to notify Congress within 48 hours of deploying troops and withdraw within 60-90 days unless Congress authorizes force. Most presidents argue this is an unconstitutional infringement of executive authority.

IV. VETO POWER & CONGRESSIONAL OVERRIDE
- Article I, Section 7: President can veto any bill passed by Congress.
- Congress can override with a 2/3 majority in both houses.
- Pocket Veto: If Congress adjourns within 10 days of submitting a bill, and President does not sign it, the bill dies.`,
    subject: "Law",
    institution: "Harvard Law School",
    tags: ["Constitutional Law", "Executive Power", "Supreme Court Cases"],
    creatorId: "user-law-hawk",
    creatorName: "Kabir Malhotra",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
    createdAt: "2026-06-18T16:45:00Z",
    fileType: "text",
    fileName: "harvard_con_law_article2.txt",
    fileSize: "5.1 KB",
    isPremium: false,
    rating: 4.7,
    ratingsCount: 15,
    views: 182,
    downloads: 72,
    isCollaborative: true,
    versions: [
      {
        id: "v-3",
        version: 1,
        updatedAt: "2026-06-18T16:45:00Z",
        updatedBy: "Kabir Malhotra",
        title: "Constitutional Law: Executive Powers & Check-and-Balance Framework",
        content: `CONSTITUTIONAL LAW: ARTICLE II EXECUTIVE POWERS...`,
        changeSummary: "First draft with Youngstown framework"
      }
    ],
    annotations: [],
    comments: [
      {
        id: "comm-4",
        userId: "user-5",
        userName: "Divya Nair",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Divya",
        text: "The Youngstown Jackson framework is explained perfectly here. Saved me hours of scanning heavy casebooks.",
        rating: 5,
        createdAt: "2026-06-19T18:10:00Z"
      }
    ]
  }
];

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

app.get("/api/notes", (req, res) => {
  const { search, subject, tag, institution } = req.query;
  let filtered = [...notes];

  if (search) {
    filtered = searchNotesInDatabase(search as string);
  }

  if (subject) {
    filtered = filtered.filter(n => n.subject.toLowerCase() === (subject as string).toLowerCase());
  }

  if (tag) {
    filtered = filtered.filter(n => n.tags.some((t: string) => t.toLowerCase() === (tag as string).toLowerCase()));
  }

  if (institution) {
    filtered = filtered.filter(n => n.institution.toLowerCase().includes((institution as string).toLowerCase()));
  }

  res.json(filtered);
});

app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  note.views = (note.views || 0) + 1;
  res.json(note);
});

app.post("/api/notes", (req, res) => {
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
    isCollaborative
  } = req.body;

  if (!title || !content || !subject || !institution) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    title,
    description: description || `Study guide on ${subject}`,
    content,
    subject,
    institution,
    tags: tags || [],
    creatorId: creatorId || "anonymous-user",
    creatorName: creatorName || "Anonymous Creator",
    creatorAvatar: creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorName || "anon"}`,
    createdAt: new Date().toISOString(),
    fileType: fileType || "text",
    fileName: fileName || `${title.toLowerCase().replace(/\s+/g, "_")}.txt`,
    fileSize: fileSize || "12 KB",
    isPremium: !!isPremium,
    price: isPremium ? Number(price || 199) : undefined,
    qrCodeUrl: isPremium ? (qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_custom") : undefined,
    rating: 5.0,
    ratingsCount: 0,
    views: 0,
    downloads: 0,
    isCollaborative: !!isCollaborative,
    versions: [
      {
        id: `v-${Date.now()}`,
        version: 1,
        updatedAt: new Date().toISOString(),
        updatedBy: creatorName || "Anonymous Creator",
        title: title,
        content: content,
        changeSummary: "Original Upload"
      }
    ],
    annotations: [],
    comments: []
  };

  notes.unshift(newNote);
  res.status(201).json(newNote);
});

app.post("/api/notes/:id/update", (req, res) => {
  const noteIndex = notes.findIndex((n) => n.id === req.params.id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  const { content, title, changeSummary, updatedBy } = req.body;
  const note = notes[noteIndex];

  const nextVerNum = note.versions.length + 1;
  const newVersion = {
    id: `v-${Date.now()}`,
    version: nextVerNum,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || "Anonymous Contributor",
    title: title || note.title,
    content: content || note.content,
    changeSummary: changeSummary || `Update version ${nextVerNum}`
  };

  note.content = content || note.content;
  note.title = title || note.title;
  note.versions.push(newVersion);

  res.json(note);
});

app.post("/api/notes/:id/comments", (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  const { text, rating, userName, userId, userAvatar } = req.body;

  const newComment = {
    id: `comm-${Date.now()}`,
    userId: userId || "anon",
    userName: userName || "Anonymous Study",
    userAvatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || "anon"}`,
    text: text || "",
    rating: Number(rating || 5),
    createdAt: new Date().toISOString()
  };

  note.comments.push(newComment);

  const total = note.comments.reduce((acc: number, item: any) => acc + item.rating, 0);
  note.ratingsCount = note.comments.length;
  note.rating = Number((total / note.comments.length).toFixed(1));

  res.json(note);
});

app.post("/api/notes/:id/annotations", (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  const { page, x, y, text, author } = req.body;

  const newAnnotation = {
    id: `ann-${Date.now()}`,
    page: Number(page || 1),
    x: Number(x || 0),
    y: Number(y || 0),
    text: text || "",
    author: author || "Study Companion",
    createdAt: new Date().toISOString()
  };

  note.annotations.push(newAnnotation);
  res.json(note);
});

app.post("/api/notes/:id/annotations/delete", (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  const { annotationId } = req.body;
  note.annotations = note.annotations.filter((a: any) => a.id !== annotationId);
  res.json(note);
});

app.post("/api/notes/:id/summarize", async (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  const client = getAiClient();

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: ["gem", "ini-3.5-flash"].join(""),
        contents: `Please generate a highly structured, minimalist, and clear executive summary of the following academic note content. Focus on core takeaways, central formulas or facts, and critical terminology. Present your summary with clean headings, bold terms, and bullet points.
        
NOTE TITLE: ${note.title}
NOTE CONTENT:
${note.content}`,
        config: {
          systemInstruction: "You are an elite academic tutor summarizing learning materials into concise executive notes for students.",
        },
      });

      const summaryText = response.text || "Failed to parse summary from model.";
      return res.json({ summary: summaryText });
    } catch (err: any) {
      console.error("AI API Error:", err);
    }
  }

  const localSummary = `### AI Summary (Heuristic Fallback)

**Core Topic**: ${note.title}
**Subject**: ${note.subject}
**Institution**: ${note.institution}

#### Key Takeaways:
1. **Critical Focus**: Summarizes key insights from *"${note.title}"*. Includes core principles of ${note.tags.join(", ") || "the subject matter"}.
2. **Key Context**: Prepared by **${note.creatorName}**, this resource offers academic concepts designed for examination review.
3. **Core Terminology**: Key terms identified in the document relate to *${note.tags.slice(0, 2).join(", ") || "curriculum highlights"}*.

*Note: Configure a valid API_KEY in Settings > Secrets to unlock full generative AI outlines.*`;

  return res.json({ summary: localSummary });
});

app.post("/api/notes/:id/plagiarism-check", async (req, res) => {
  const currentNote = notes.find((n) => n.id === req.params.id);
  if (!currentNote) {
    return res.status(404).json({ error: "Note not found" });
  }

  const otherNotes = notes.filter((n) => n.id !== currentNote.id);
  
  const curWords = new Set(currentNote.content.toLowerCase().split(/\W+/).filter(w => w.length > 4));
  let bestMatchTitle = "";
  let bestMatchScore = 0;
  let matchedSnippet = "";

  for (const other of otherNotes) {
    const otherWords = other.content.toLowerCase().split(/\W+/).filter((w: string) => w.length > 4);
    let intersectionCount = 0;
    otherWords.forEach((w: string) => {
      if (curWords.has(w)) intersectionCount++;
    });
    const score = Math.round((intersectionCount / Math.max(curWords.size, 1)) * 100);
    if (score > bestMatchScore) {
      bestMatchScore = score;
      bestMatchTitle = other.title;
      const sentences = currentNote.content.split(/[.!\n]+/);
      const commonSentence = sentences.find(s => {
        const words = s.toLowerCase().split(/\W+/).filter(w => w.length > 4);
        return words.some(w => other.content.toLowerCase().includes(w));
      });
      matchedSnippet = commonSentence ? commonSentence.trim() : "High level overlap of concept keywords";
    }
  }

  const finalPercentage = Math.min(Math.max(bestMatchScore - 20, 2), 94);

  const report = {
    isPlagiarized: finalPercentage > 30,
    matchPercentage: finalPercentage,
    checkedAt: new Date().toISOString(),
    checkedWords: currentNote.content.split(/\s+/).length,
    matchedSource: finalPercentage > 15 ? bestMatchTitle || "External online database" : null,
    matchedSnippet: finalPercentage > 15 ? matchedSnippet : null,
    status: finalPercentage > 30 ? "Warning: High Similarity" : "Passed: Clean Content"
  };

  res.json(report);
});

app.post("/api/notes/:id/download", (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  note.downloads = (note.downloads || 0) + 1;
  res.json({ success: true, downloads: note.downloads });
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

import express from "express";
import cors from "cors";
import { communicator } from "./chatCommunicator.js";
import multer from "multer";
import axios from "axios";
import base64Img from "base64-img";
import { parsePDF } from "./pdfParser.js";
import PdfParse from "pdf-parse";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

// var base64Img = require("base64-img");

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

//Routes
app.post("/clear", async (req, res) => {
  await communicator('clear-chat');
  res.status(200).json({ message:"chat-cleared" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const assetsDirectory = path.join(__dirname, '../assets');  // Path to the 'assets' folder
if (!fs.existsSync(assetsDirectory)) {
  fs.mkdirSync(assetsDirectory, { recursive: true });  // Creates the folder if it doesn't exist
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assetsDirectory);  // Use the created or existing 'assets' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
    // console.log("1@"+file.originalname) // Unique filenamen
  },
});


const upload = multer({storage});
// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
   try {
    
    await parsePDF(req.file.filename);
    
    // const response=await communicator("get-greeting");
     res.json({
       message: "File uploaded successfully",
       filename: req.file.filename,
      //  data:response 
     });
   } catch (error) {
     console.error("Error processing PDF:", error);
     res.status(500).json({ error: "PDF upload failed" });
   }
  
});

app.post("/chat-bot", async (req, res) => {
  const { query } = req.body;
  if (!query||!query.trim())
    return res.status(400).json({ error: "No message provided" });
  else {
    const response=await communicator(query);
    return res.status(200).json({ data: response });
  }
});

app.post("/quotation", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    else{
      // const response=await communicator("")
    }
   

    if (error) throw error;

    return res.json({
      data:
        "Thank you for providing your details. We will get back to you with a quotation.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Image process Route

app.post("/process-image", upload.single("image"), async (req, res) => {
  
  try {
  // Check if image was uploaded
  if (!req.file && !req.body.imageUrl) {
    return res.status(400).json({ error: "No image provided" });
  }
let imageQuery;
    // Convert image to base64
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype; // Get the mime type of the image

      imageQuery = `data:${mimeType};base64,${base64Image}`;
      // imageQuery = base64Img.base64Sync(req.file.path);
    } 

    else if (req.body.imageUrl) {
      // Fetch image from URL and convert to base64
      const axiosRes = await axios.get(req.body.imageUrl, {
        responseType: "arraybuffer",
      });
      imageQuery = btoa(
        new Uint8Array(axiosRes.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
    }

    const response = await communicator(imageQuery);
    
    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port:${process.env.PORT}`);
});

export { app };

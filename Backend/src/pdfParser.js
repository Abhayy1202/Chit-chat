import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
dotenv.config({ path: "../.env" });

export const parsePDF = async (query) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync("../assets/SCDATA.pdf");

    // Parse the PDF content
    const pdfData = await pdfParse(pdfBuffer);
    const rawText = pdfData.text;

    // Split the text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      separators: ["\n\n", "\n", " ", "", "●"],
      chunkSize: 690,
      chunkOverlap: 150,
    });
    const chunks = await splitter.createDocuments([rawText]);
  
    console.log(chunks[0]);

    // Retrieve environment variables
    const sbApiKey = process.env.VITE_SUPABASE_ANON_KEY;
    const sbUrl = process.env.VITE_SUPABASE_URL;
    // const openAIApiKey = process.env.OPENAI_API_KEY;
    const ApiKey = process.env.GOOGLE_API_KEY;

    // Validate environment variables
    if (!sbApiKey || !sbUrl || !ApiKey) {
      throw new Error("Missing environment variables");
    }

    // Create a Supabase client
    const client = createClient(sbUrl, sbApiKey);

    // Create a SupabaseVectorStore
    await SupabaseVectorStore.fromDocuments(
      chunks,
      new GoogleGenerativeAIEmbeddings({ ApiKey, modelName: "embedding-001" }),
      {
        //object holding supabase details
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );
  } 
  catch (error) {
    console.error("Error:", error);
  }
};





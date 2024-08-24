import fs from "fs";
import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export const parsePDF = async (query) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync("./assets/SCDATA.pdf");

    // Parse the PDF content
    const pdfData = await pdfParse(pdfBuffer);
    const rawText = pdfData.text;

    // Split the text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      separators: "\n",
      chunkSize: 800,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([rawText]);

    // Retrieve environment variables
    const sbApiKey = process.env.SUPABASE_API_KEY;
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT;
    const apiKey = process.env.GEMINI_API_KEY;

    // Validate environment variables
    if (!sbApiKey || !sbUrl || !apiKey) {
      throw new Error("Missing environment variables");
    }

    // Create a Supabase client
    const client = createClient(sbUrl, sbApiKey);

    // Create a SupabaseVectorStore
    await SupabaseVectorStore.fromDocuments(
      chunks,
      new GoogleGenerativeAIEmbeddings({ apiKey }),
      {
        client,
        tableName: "documents",
        queryName: 'match-documents'
      }
    );

    

        // Perform the similarity search
    const queryEmbedding = await new GoogleGenerativeAIEmbeddings({ apiKey }).embedQuery(query);
    const results = await vectorStore.search(queryEmbedding);

    // Prepare the response
    const response = results.map(result => result.document).join("\n");

    console.log("Query Response:", response);

    return response;
  } 
  catch (error) {
    console.error("Error:", error);
  }
};



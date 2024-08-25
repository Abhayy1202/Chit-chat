import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
dotenv.config();
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { TaskType } from "@google/generative-ai"

// Placeholder for GoogleGenerativeAIEmbeddings and FaissStore equivalents
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai"; // Hypothetical

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"; // Hypothetical
import { PromptTemplate } from "@langchain/core/prompts";
import { loadQAChain } from "langchain/chains"; // Hypothetical
import { type } from "os";

async function processPdfAndQuery(query) {
  // Load the PDF
  const pdfPath = "../assets/SCDATA.pdf";
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);

  // Read text from PDF
  let rawText = pdfData.text;

  // Split the text into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
  });
  const texts = await textSplitter.splitText(rawText);
//   console.log(texts)

  // Download embeddings and create a FaissStore vector store (placeholder)
//   const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: "AIzaSyBM-aH2jWpQipv8Fx5r7OD7hqHx9ABLEf8",
//     model: "models/embedding-001",
//     taskType: TaskType.RETRIEVAL_DOCUMENT,
//   });
//   const documentSearch = await FaissStore.fromTexts({texts:texts}, {embeddings:embeddings});
//   await documentSearch.saveLocal("FaissStore_index");
let embeddings;
try {
  embeddings = new GoogleGenerativeAIEmbeddings({
    model: "models/embedding-001",
    apiKey: 'AIzaSyBM-aH2jWpQipv8Fx5r7OD7hqHx9ABLEf8',
  });
  console.log(embeddings);
} catch (error) {
  console.error("Error instantiating embeddings model:", error);
  return;
}

if (!embeddings.embedDocuments) {
  console.error(
    "The embeddings object does not have the embedDocuments method."
  );
  return;
}

// Download embeddings and create a FAISS vector store
let documentSearch;
try {
  documentSearch = await FaissStore.fromTexts({texts:texts}, {embeddings:embeddings});
  await documentSearch.saveLocal("faiss_index");
} catch (error) {
  console.error("Error creating or saving FAISS vector store:", error);
  return;
}

  function getConversationalChain() {
    const promptTemplate = `
        Answer the question as detailed as possible from the provided context, in a friendly manner and in simple terms. Provide answer in 
        at least 100 words. If no context is found then try to answer it on your own but when answering on your own keep answers short and add a warning
        that "The above answer is provided without any context from provided documents".\n\n
        Context:\n {context}?\n
        Question: \n{question}\n

        Answer:
        `;

    const model = new ChatGoogleGenerativeAI({
        apiKey: 'AIzaSyBM-aH2jWpQipv8Fx5r7OD7hqHx9ABLEf8',
      model: "gemini-pro",
      temperature: 0.5,
      maxOutputTokens: 100,
    });

    const prompt = new PromptTemplate({
      template: promptTemplate,
      inputVariables: ["context", "question"],
    });
    const chain = loadQAChain(model, "stuff", { prompt });

    return chain;
  }

  async function userInput(userQuestion) {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
      apiKey: "AIzaSyBM-aH2jWpQipv8Fx5r7OD7hqHx9ABLEf8",
    });
    const newDb = await FaissStore.loadLocal(documentSearch, embeddings, {
      allowDangerousDeserialization: true,
    });
    const docs = await newDb.similaritySearch(userQuestion);

    const chain = getConversationalChain();

    const response = await chain({
      inputDocuments: docs,
      question: userQuestion,
    });

    console.log(response);
  }

  return userInput(query);
}

processPdfAndQuery("average repair cost would be?");

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const ApiKey = process.env.GOOGLE_API_KEY;
const embeddings = new GoogleGenerativeAIEmbeddings({ApiKey})
 const sbApiKey = process.env.VITE_SUPABASE_ANON_KEY;
 const sbUrl = process.env.VITE_SUPABASE_URL;
 const client = createClient(sbUrl, sbApiKey);

 const vectorStore = new SupabaseVectorStore(embeddings, {
   client,
   tableName: "documents",
   queryName: "match_documents",
 });

 const retriever = vectorStore.asRetriever()

 export {retriever}
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { retriever } from "./utils/retriever.js";
import dotenv from "dotenv";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
dotenv.config({ path: "../.env" });

const convHistory=[];
export const communicator = async (query) => {
  try {
    const ApiKey = process.env.GOOGLE_API_KEY;
    const llm = new ChatGoogleGenerativeAI({
      ApiKey,
      model: "gemini-1.5-pro-latest",
    });


    const standaloneTemplate =
      `Given some conversation history (if any) and a question, Convert it to a standalone question. 
      conversation history:{conv_history}
      question:{question} 
      standalone quesiton:`;
      
      const standalonePrompt = PromptTemplate.fromTemplate(standaloneTemplate);
      
      const standaloneChain = standalonePrompt
        .pipe(llm)
        .pipe(new StringOutputParser());


    
    const answerTemplate = `You are a helpful and enthusiastic support bot who can answer questions about household repairs, including associated costs, based on the context provided and the conversation history. Always strive to be both informative and approachable, as if you're chatting with a friend who needs your expert advice.
     If answer is not given in the context, find answer in conversation history is possible.
     For general help queries like "I need help," "Can you assist me?," or "Help me," respond with a friendly and reassuring message like, "Of course! How can I assist you today? Just let me know what you need help with."
     
     If you truly don't know the answer to a specific query, simply say, "I'm sorry, I don't know the answer to that," and never attempt to make up an answer.
     context: {context}
     converstion history:{conv_history}
     question: {question}
     answer :`;

    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
    
    function combineDocuments(docs) {
      return docs.map((doc) => doc.pageContent).join("\n\n");
    }

    // Chaining for question-based queries

    const retrieverChain = RunnableSequence.from([
      (prevResult) => prevResult.standalone_question,
      retriever,
      combineDocuments,
    ]);
    const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

    // Image processing chain
    
    const queryChain = RunnableSequence.from([
      {
        standalone_question: standaloneChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question,
        conv_history: ({ original_input }) => original_input.conv_history,
      },
      answerChain,
    ]);

    const imageTemplate = `You are a knowledgeable and insightful assistant capable of analyzing images to identify any potential household repair needs. Your goal is to detect any visible issues related to household maintenance, such as plumbing, electrical, HVAC, carpentry, painting, roofing, flooring, masonry, window and door issues, or landscaping. Based on your observations, suggest necessary repairs or improvements.

    After analyzing the image, generate a standalone question for the user to confirm or explore further based on your findings. For example, if you notice a crack in a wall, you might ask, "Do you need assistance with repairing this wall crack?"

    If no household repair issues are detected, respond with, "I'm sorry, I couldn't identify any household repair-related issues from the image," and avoid making unsupported conclusions.

    content:{content}
    standalone question:`;

    // const imageTemplate = `Describe the image provided in content,if no then as i can know that content.data looks like'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1...' why you are not able to detect it. content:{content}`;
    const imagePrompt = PromptTemplate.fromTemplate(imageTemplate);
    
    const imageChain = imagePrompt.pipe(llm).pipe(new StringOutputParser());
   
    
    
    const img_processChain = RunnableSequence.from([
      { standalone_question: imageChain },
      { context: retrieverChain, question: prevResult=>prevResult.standalone_question },
      answerChain,
    ]);

    
    
    if (query.startsWith("data:image/")) {
      // console.log(query)
      const response2 = await img_processChain.invoke({
        content: [
          {
            type: "media",
            mimeType: "image/jpeg",
            data: query, // passing the base64-encoded image
            encoding: "base64",
          },
        ],
      });
      // console.log(response2)
      return response2;
    } 
    else if(query === 'clear-chat')
    {
      convHistory.splice(0, convHistory.length);
      console.log(convHistory);

    }
    else if (typeof query === "string") {
     
      const response = await queryChain.invoke({
        question: `${query}`,
        conv_history: convHistory.join('\n'),
      });
      convHistory.push(`Human: ${query}`);
      convHistory.push(`AI: ${response}`);
      console.log(convHistory);
      return response;
    }
    
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

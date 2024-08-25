from PyPDF2 import PdfReader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv
load_dotenv()


def process_pdf_and_query(query):
    # Load the PDF
    pdfreader = PdfReader('/home/sid/Downloads/SCDATA.pdf')
    
    # Read text from PDF
    raw_text = ''
    for i, page in enumerate(pdfreader.pages):
        content = page.extract_text()
        if content:
            raw_text += content
    
    # Split the text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
    texts = text_splitter.split_text(raw_text)
   
    
    # Download embeddings and create a FAISS vector store
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    document_search = FAISS.from_texts(texts, embedding=embeddings)
    document_search.save_local("faiss_index")


    def get_conversational_chain():

        prompt_template = """
        Answer the question as detailed as possible from the provided context, in a friendly manner and in simple terms. Provide answer in 
        atleast 100 words. If no context is found then try to answer it on you own but when answering on your own keep answers short and add a warning
        that "The above answer is provided without any context from provided documents".\n\n
        Context:\n {context}?\n
        Question: \n{question}\n

        Answer:
        """

        model = ChatGoogleGenerativeAI(model="gemini-pro",
                                temperature=0.5,max_output_tokens = 100)

        prompt = PromptTemplate(template = prompt_template, input_variables = ["context", "question"])
        chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

        return chain



    def user_input(user_question):
        embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
        
        new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        docs = new_db.similarity_search(user_question)

        chain = get_conversational_chain()

        response = chain(
            {"input_documents":docs, "question": user_question}
            , return_only_outputs=True)

        print(response)
    
    return user_input(query)


process_pdf_and_query("average repair cost would be?")
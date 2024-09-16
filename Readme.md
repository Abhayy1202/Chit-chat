# PDF Chatbot

This project is a PDF chatbot application that enables users to upload PDF files, interact with a chatbot that processes PDF content and submit queries. The application consists of a React frontend and a Node.js backend integrated with Supabase for data storage and Google Gemini API for natural language understanding.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [License](#license)

### Prerequisites

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **Supabase**: Set up a project on [Supabase](https://supabase.com/)
- **Google Gemini API**: Obtain API keys from Google Generative AI SDK

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Abhayy1202/PdfGenie.git
   cd PdfGenie
   ```

2. **Install dependencies**:
   **Backend**:
   ```bash
   cd backend
   npm install
   ```
   **Frontend**:
   ```bash
   cd frontend
   npm install
   ```

## Environment Variables
- Create a **.env** file in the backend folder and add the following environment variables:
```bash
PORT=3000
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
GEMINI_API_KEY=<your-gemini-api-key>
   ```

## Features

- **PDF Upload**: Users can upload PDFs which are parsed and stored on the server.
- **Chatbot Interaction**: Users can ask the chatbot questions related to PDF content or household repair queries.
- **Image Upload**: Allows users to upload images that are analyzed and processed.
- **Quotation Requests**: Users can request quotations by providing their contact details through a form.
- **Google Gemini API**: The chatbot leverages Google Gemini API for NLP tasks.
- **Supabase Integration**: Data is stored and retrieved using Supabase as a backend service.

## Technologies

- **Frontend**:
  - React
  - Axios
- **Backend**:
  - Node.js
  - Express.js
  - Multer (for file handling)
  - Supabase (for data storage)
  - Google Gemini API (for NLP tasks)
  - Axios (for making API requests)
- **PDF Parsing**:
  - pdf-parse (to extract data from PDFs)
- **Database**:
  - Supabase (vector database)

## Getting Started



## Project Structure

### Backend Files Overview:
- **server.js**: The main entry point for the Node.js server, which handles routing, file uploads, PDF parsing, and communication with the Google Gemini API​(server).
 
- **chatCommunicator.js**: Handles interaction with Google Gemini API to process text and images​(server).

- **pdfParser.js**: A utility to extract text from uploaded PDFs using the pdf-parse module​(server).

- **assets/**: Directory to store uploaded PDFs and images.

### Frontend Files Overview:

- **App.jsx**: The main React component that initializes the application and handles the routing between different pages.

- **components/**: A directory containing reusable React components, such as the chatbot interface, file upload component, and quotation form.

## API Endpoints
- **POST /upload**: Uploads a PDF document and parses the content for future chatbot queries.

- **POST /chat-bot**: Sends a query to the chatbot and returns a response. The query can be related to PDF content or general questions.

- **POST /quotation**: Collects user details for a quotation and responds with a thank-you message.

- **POST /process-image**: Uploads and processes an image (either from local files or a URL). The image is converted to base64 and analyzed by the chatbot​(server).

- **POST /clear**: Clears the current chat history.

## Future Enhancement

- **Authentication**: Add Supabase Auth to manage user accounts.

- **File History**: Allow users to view previously uploaded files.

- **Advanced PDF Parsing**: Improve PDF parsing logic to handle more complex documents (e.g., tables, images).

- **Rich Response Templates**: Improve chatbot responses to be more dynamic and context-aware.

- **Error Handling**: Add more detailed error handling for API failures and invalid inputs.

## License
- This project is licensed under the MIT License.
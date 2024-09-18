import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "./components/MobileHeader";
import { Sidebar } from "./components/Sidebar";
import { PDFViewer } from "./components/PDFViewer";
import { ChatInterface } from "./components/ChatInterface";
import { DragHandle } from "./components/DragHandle";
import "./App.css";

function App() {
  const [query, setQuery] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [chatWidth, setChatWidth] = useState(384);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingChat, setIsDraggingChat] = useState(false);

  const clearChat = async () => {
    const response = await axios.post("http://localhost:3000/clear", {
      headers: { "Content-Type": "application/json" },
      timeout: 10000 * 2,
    });
    console.log(response.data);
    setQuery([]);
  };

  const handlePDF= async()=>{
    console.log(file);
    if(file)
    {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("File uploaded:",response);
        // setQuery(
        //   { role: "assistant", content: response.data.data },
        // );
        // console.log("PDF handle run")

      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }

  useEffect(() => {
    if(file){
      handlePDF();
    }
  }, [file]);

  const handleSend = async () => {
    // Check if input or file is empty
   if (!input.trim() && !file) {
     console.log("No input or file to send.");
     return;
   }

   const userMessage = {
     role: "user",
     content: input,
     image: file?.type!=='application/pdf' ? URL.createObjectURL(file) : null,
   };

   // Update query state with user message
   setQuery((prev) => [...prev, userMessage]);
   setInput(""); // Clear input field
   setLoading(true); // Set loading to true

   try {
     let assistantMessage;

     if (file.type!=="application/pdf") {
       //functionality to be added to frontend later
       console.log("Uploading file:", file);

       // Prepare formData for file upload
       const formData = new FormData();
       formData.append("image", file);

       const response = await axios.post(
         "http://localhost:3000/process-image",
         formData,
         {
           headers: { "Content-Type": "multipart/form-data" },
           timeout: 10000, // Set timeout of 10 seconds
         }
       );

       assistantMessage = response.data;
     } else {
       console.log("Sending text input:", input);

       const response = await axios.post(
         "http://localhost:3000/chat-bot",
         { query: input },
         {
           headers: { "Content-Type": "application/json" },
           timeout: 10000 * 2, // Set timeout of 10 seconds
         }
       );

       assistantMessage = response.data.data;

       assistantMessage = assistantMessage
         .replace(/\n/g, "<br>")
         .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");


       // If "quotation" is in the message, show form
       if (input.includes("quotation" || "quotations")) {
         setShowDetailsForm(true);
       }
     }

     // Update the query with the assistant's response
     setQuery((prevMessages) => [
       ...prevMessages,
       { role: "assistant", content: assistantMessage },
     ]);
   } catch (error) {
     // Detailed error handling
     console.error(
       "Error occurred:",
       error.response ? error.response.data : error.message
     );

     setQuery((prevMessages) => [
       ...prevMessages,
       {
         role: "assistant",
         content: `Error occurred: ${
           error.response ? error.response.data.error : error.message
         }`,
       },
     ]);
   } finally {
     setLoading(false); // Set loading to false in any case
   }
 };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleDetailsSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);

     try {
       const response = await axios.post(
         "http://localhost:3000/quotation",
         userDetails,
         {
           headers: { "Content-Type": "application/json" },
         }
       );

       const responseData = response.data.data;
       setQuery((prevMessages) => [
         ...prevMessages,
         { role: "assistant", content: responseData },
       ]);

       //setMessages([...messages, { role: 'user', content: 'Quotation request submitted successfully!'  }]);

       setShowDetailsForm(false); // Hide the form
     } catch (error) {
       console.error(
         "Error:",
         error.response ? error.response.data : error.message
       );
       setQuery((prevMessages) => [
         ...prevMessages,
         {
           role: "assistant",
           content:
             "Error occurred: " +
             (error.response ? error.response.data.error : error.message),
         },
       ]);
     } finally {
       setLoading(false);
     }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDraggingSidebar) {
        const newWidth = e.clientX;
        setSidebarWidth(
          Math.max(200, Math.min(newWidth, window.innerWidth - 400))
        );
      } else if (isDraggingChat) {
        const newWidth = window.innerWidth - e.clientX;
        setChatWidth(
          Math.max(200, Math.min(newWidth, window.innerWidth - 400))
        );
      }
    },
    [isDraggingSidebar, isDraggingChat]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingSidebar(false);
    setIsDraggingChat(false);
  }, []);

  useEffect(() => {
    if (isDraggingSidebar || isDraggingChat) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingSidebar, isDraggingChat, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-dvh bg-gray-100 lg:flex-row">
      <div className="flex flex-col w-full">
        <MobileHeader
          setSidebarOpen={setSidebarOpen}
          setChatOpen={setChatOpen}
          sidebarOpen={sidebarOpen}
          chatOpen={chatOpen}
        />
        <div className="flex flex-grow">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarWidth={sidebarWidth}
            setFile={setFile}
            file={file}
            handlePDF={handlePDF}
          />
        
          <DragHandle onMouseDown={() => setIsDraggingSidebar(true)} />
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <PDFViewer file={file}/>
            <DragHandle onMouseDown={() => setIsDraggingChat(true)} />
            <ChatInterface
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
              chatWidth={chatWidth}
              query={query}
              loading={loading}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              showDetailsForm={showDetailsForm}
              setShowDetailsForm={setShowDetailsForm}
              userDetails={userDetails}
              handleDetailsChange={handleDetailsChange}
              handleDetailsSubmit={handleDetailsSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

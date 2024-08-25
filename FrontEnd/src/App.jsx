import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Handle sending text input or file
  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMessage = {
      role: "user",
      content: input,
      image: file ? URL.createObjectURL(file) : null,
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "http://127.0.0.1:5000/process-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const assistantMessage = response.data.response;
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          { role: "assistant", content: assistantMessage },
        ]);
      } else {
        // Handle text input
        const response = await axios.post(
          "http://127.0.0.1:5000/chatbot",
          { message: input },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (input.includes("quotation")) {
          setShowDetailsForm(true);
        }
        const responseData = response.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          { role: "assistant", content: responseData.response },
        ]);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setMessages((prevMessages) => [
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

  // Handle file input change
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    e.target.value = ""; // Clear the file input value
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.image && (
                <div className="image-preview">
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                </div>
              )}
              {msg.content && !msg.image && <p>{msg.content}</p>}
            </div>
          ))}
          {loading && <div className="message assistant">Thinking...</div>}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
          />
          <label className="upload-button">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-paperclip"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </label>
          <button className="send-button" onClick={handleSend}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send-horizontal"
            >
              <path d="m3 3 3 9-3 9 19-9Z" />
              <path d="M6 12h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

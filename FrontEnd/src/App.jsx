import React, { useState } from "react";
import axios from "axios";
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

  const clearChat = async () => {
    const response = await axios.post("http://localhost:3000/clear", {
      headers: { "Content-Type": "application/json" },
      timeout: 10000 * 2, // Set timeout of 10 seconds
    });
    console.log(response.data);
    setQuery([]);
  };
  // Handle sending text input or file
  const handleSend = async () => {
    // Check if input or file is empty
    if (!input.trim() && !file) {
      console.log("No input or file to send.");
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
      image: file ? URL.createObjectURL(file) : null,
    };

    // Update query state with user message
    setQuery((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field
    setLoading(true); // Set loading to true

    try {
      let assistantMessage;

      if (file) {
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

        // If "quotation" is in the message, show form
        if (input.includes("quotation"||"quotations")) {
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

  // Handle file input change
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    e.target.value = ""; // Clear the file input value to allow re-upload
  };

  // Handle form input changes
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // Handle form submission
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

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          <button className="close-button" onClick={clearChat}>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Clear Text
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trash"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
          {/* Render chat messages */}
          {query.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {/* Render image if present */}
              {msg.image && (
                <div className="image-preview">
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                </div>
              )}
              {/* Render text message if content is present */}
              {msg.content && !msg.image && <p>{msg.content}</p>}
            </div>
          ))}
          {/* Show "Thinking..." message when loading */}
          {loading && <div className="message assistant">Thinking...</div>}
        </div>

        {/* Input and send button */}
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
          />

          {/* Upload button for file */}
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

          {/* Send button */}
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

      {showDetailsForm && (
        <div className="overlay">
          <div className="details-form">
            <h2>Provide Details for Quotation</h2>
            <form onSubmit={handleDetailsSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleDetailsChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleDetailsChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleDetailsChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={userDetails.address}
                  onChange={handleDetailsChange}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowDetailsForm(false)}
                className="close-button"
              >
                Close
              </button>

              <span className="divider-h"></span>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

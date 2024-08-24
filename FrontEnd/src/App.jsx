import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
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
    setFile(null); // Clear the file input after sending
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
        setMessages([
          ...messages,
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
        setMessages([
          ...messages,
          userMessage,
          { role: "assistant", content: responseData.response },
        ]);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setMessages([
        ...messages,
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
        "http://127.0.0.1:5000/quotation",
        userDetails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = response.data;
      setShowDetailsForm(false); // Hide the form
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setMessages([
        ...messages,
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
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="uploaded-image"
                />
              )}
              {msg.content && !msg.image && msg.content}
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
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button className="upload-button-text">Upload File</button>
          </label>
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      {/* Conditional overlay for the details form */}
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

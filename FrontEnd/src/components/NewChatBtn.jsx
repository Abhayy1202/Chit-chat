import React, { useRef } from "react";

export const NewChatButton = ({ setFile ,handlePDF }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };


  const handleFileChange =  async(event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
      // await handlePDF();
    } else {
      console.error("Please select a PDF file");
     
    }
    // Reset the file input
    event.target.value = "";
    
  };

  return (
    <div className="h-16 m-2 bg-[rgba(255,255,255,0.2)] flex-shrink-0 p-0">
      <div
        className="box-border rounded-sm border-2 border-gray-300 border-dashed cursor-pointer text-center h-full flex flex-col justify-center items-center"
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          accept=".pdf"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-white text-center">
          <span
            aria-label="plus"
            className="inline-flex items-center align-middle mr-1"
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="plus"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
              <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
            </svg>
          </span>
          New Chat
        </div>
        <div className="text-[#ffffff8c] block mt-1">Drop PDF here</div>
      </div>
    </div>
  );
};

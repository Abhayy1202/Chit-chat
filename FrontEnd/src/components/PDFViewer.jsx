import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export const PDFViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <div className="flex-1 bg-white p-4 overflow-auto">
      <div className="bg-gray-200 p-2 mb-4 flex justify-between items-center">
        <span>{file ? file.name : "No file selected"}</span>
        {file && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={previousPage}
              disabled={pageNumber <= 1}
            >
              Previous
            </Button>
            <span className="mx-2">
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {file ? (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("Error while loading document!", error);
              setError("Failed to load PDF. Please try again.");
              setLoading(false);
            }}
            loading={<div>Loading PDF...</div>}
          >
            {loading && <div>Loading page...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          <div>
            No PDF file selected. Please upload a PDF file to view it here.
          </div>
        )}
      </div>
    </div>
  );
};

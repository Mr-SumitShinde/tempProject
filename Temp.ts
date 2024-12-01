import React, { useState } from "react";
import Modal from "react-modal";
import { renderAsync } from "docx-preview";

Modal.setAppElement("#root");

const DocxViewer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [docContent, setDocContent] = useState(null);

  const openModal = async () => {
    setModalIsOpen(true);

    try {
      const response = await fetch("/sample.docx");
      if (!response.ok) {
        throw new Error("Failed to fetch the document");
      }

      const arrayBuffer = await response.arrayBuffer();
      const container = document.createElement("div");

      // Render the document into a container
      await renderAsync(arrayBuffer, container);
      setDocContent(container);
    } catch (error) {
      console.error("Error rendering document:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDocContent(null); // Clear content when modal is closed
  };

  const copyToClipboard = async () => {
    if (!docContent) {
      alert("Document not loaded yet.");
      return;
    }

    try {
      const blob = new Blob([docContent.innerHTML], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);
      alert("Document copied to clipboard with images!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div>
      <button onClick={openModal}>Open DOCX File</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="DOCX Viewer"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "70%",
            overflow: "hidden",
          },
        }}
      >
        <button onClick={closeModal} style={{ marginBottom: "10px" }}>
          Close
        </button>
        <button onClick={copyToClipboard} style={{ marginBottom: "10px" }}>
          Copy to Clipboard
        </button>
        <div
          style={{
            height: "calc(100% - 40px)",
            overflowY: "auto",
            padding: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
          }}
        >
          {docContent ? (
            <div
              ref={(el) => {
                if (el) el.appendChild(docContent); // Append rendered content to modal
              }}
            />
          ) : (
            <p>Loading document...</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DocxViewer;
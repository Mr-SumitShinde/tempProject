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

      // Render the document content
      await renderAsync(arrayBuffer, container);
      setDocContent(container.innerHTML); // Save the HTML content
    } catch (error) {
      console.error("Error loading document:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setDocContent(null); // Clear the content on close
  };

  const copyToClipboard = async () => {
    if (!docContent) {
      alert("Document content not loaded yet.");
      return;
    }

    try {
      // Copy the rendered HTML content to the clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([docContent], { type: "text/html" }),
        }),
      ]);
      alert("Document content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy content:", error);
      alert("Failed to copy content.");
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
          dangerouslySetInnerHTML={{ __html: docContent }}
        />
      </Modal>
    </div>
  );
};

export default DocxViewer;
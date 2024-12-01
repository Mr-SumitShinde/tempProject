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

      // Use docx-preview to render the document
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
          },
        }}
      >
        <button onClick={closeModal}>Close</button>
        {docContent ? (
          <div
            ref={(el) => {
              if (el) el.appendChild(docContent); // Append rendered content to modal
            }}
          />
        ) : (
          <p>Loading document...</p>
        )}
      </Modal>
    </div>
  );
};

export default DocxViewer;
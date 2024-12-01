import React, { useState } from "react";
import Modal from "react-modal";
import { renderAsync } from "docx-preview";

const DocxViewer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [docContainer, setDocContainer] = useState(null);

  const openModal = async () => {
    setModalIsOpen(true);
    const response = await fetch("/path/to/sample.docx");
    const arrayBuffer = await response.arrayBuffer();

    const container = document.createElement("div");
    renderAsync(arrayBuffer, container).catch((err) => console.error(err));
    setDocContainer(container);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        <div dangerouslySetInnerHTML={{ __html: docContainer?.outerHTML }} />
      </Modal>
    </div>
  );
};

export default DocxViewer;
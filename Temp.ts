import React, { useState } from 'react';
import Modal from 'react-modal';
import mammoth from 'mammoth';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docxContent, setDocxContent] = useState<string>('');

  const loadDocxFromAssets = async () => {
    try {
      const response = await fetch('/assets/sample.docx'); // Path to the file in the public folder
      if (!response.ok) {
        throw new Error(`Error fetching the document: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocxContent(result.value);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading DOCX file:', error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>Display DOCX in Modal</h1>
      <button onClick={loadDocxFromAssets}>Open DOCX</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Document Preview"
        style={{
          content: { maxWidth: '80%', margin: 'auto', padding: '20px' },
        }}
      >
        <button onClick={closeModal} style={{ float: 'right' }}>
          Close
        </button>
        <div dangerouslySetInnerHTML={{ __html: docxContent }} />
      </Modal>
    </div>
  );
};

export default App;
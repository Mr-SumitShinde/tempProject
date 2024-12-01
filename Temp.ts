import React, { useState } from 'react';
import Modal from 'react-modal';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docxContent, setDocxContent] = useState<string>('');

  const loadDocxFromAssets = async () => {
    try {
      const response = await fetch('/assets/sample.docx'); // Path to your .docx file
      if (!response.ok) {
        throw new Error(`Error fetching the document: ${response.statusText}`);
      }

      // Read the file as binary
      const arrayBuffer = await response.arrayBuffer();
      const binaryData = new Uint8Array(arrayBuffer);

      // Use PizZip to unzip the file
      const zip = new PizZip(binaryData);

      // Use Docxtemplater to parse the document
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Render the content of the .docx file
      const text = doc.getFullText();
      setDocxContent(text);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading DOCX file:', error);
      alert('Failed to load the DOCX file. Please check the console for details.');
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
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {docxContent}
        </pre>
      </Modal>
    </div>
  );
};

export default App;
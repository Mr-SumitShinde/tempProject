import React from 'react';
import mammoth from 'mammoth';

const CopyDocxContent: React.FC = () => {
  const handleCopyContent = async () => {
    try {
      const filePath = `${process.env.PUBLIC_URL}/assets/sample.docx`;

      // Fetch the .docx file
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Could not fetch the document');
      }
      const arrayBuffer = await response.arrayBuffer();

      // Extract the text and images from the .docx file
      const { value: extractedContent } = await mammoth.extractRawText({ arrayBuffer });

      // Copy the content to the clipboard
      navigator.clipboard.writeText(extractedContent).then(() => {
        alert('Document content copied to clipboard!');
      });
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Failed to copy document content. Check the console for details.');
    }
  };

  return (
    <div>
      <button onClick={handleCopyContent}>Copy Document Content</button>
    </div>
  );
};

export default CopyDocxContent;
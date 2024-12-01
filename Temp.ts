import React from "react";

const DocumentPreview = () => {
  const handlePreviewClick = () => {
    // Replace 'sample.doc' with the actual path or URL of your document
    const documentUrl = "/path/to/sample.doc";

    // Open in a new tab
    window.open(documentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handlePreviewClick}>
      Open Document Preview
    </button>
  );
};

export default DocumentPreview;
import React from 'react';

const DownloadEmailTemplate: React.FC = () => {
  const handleDownload = () => {
    // Construct the file URL
    const fileUrl = `${process.env.PUBLIC_URL}/assets/email-template.html`;

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'email-template.html'; // Specify the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={handleDownload}>Download Email Template</button>
    </div>
  );
};

export default DownloadEmailTemplate;
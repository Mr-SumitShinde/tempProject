import React from "react";

const DownloadPDF: React.FC = () => {
  const handleDownload = async () => {
    try {
      // Perform the fetch request
      const response = await fetch("https://example.com/api/pdf", {
        method: "GET", // Or POST, based on your API
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const result = await response.json();
      const pdfFile = result.data.attribute.file;

      // Convert the file data into a Blob object
      const blob = new Blob([pdfFile], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "downloaded-file.pdf"; // Specify the desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
};

export default DownloadPDF;
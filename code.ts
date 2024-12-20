const handleDownload = async () => {
  const certificate = document.getElementById("certificate-template");
  if (!certificate) return;

  const canvas = await html2canvas(certificate, {
    scale: 2, // Increase resolution
    useCORS: true, // Ensure cross-origin images load
  });

  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "certificate.png";
  link.click();
};
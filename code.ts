const handleDownload = async () => {
  const certificate = document.getElementById("certificate-template");
  if (!certificate) return;

  const scale = window.devicePixelRatio || 2;
  const canvas = await html2canvas(certificate, {
    scale: scale, // Match the device's pixel density
    useCORS: true,
  });

  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "certificate.png";
  link.click();
};
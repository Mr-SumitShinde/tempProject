const copyDocxContent = async (docContent) => {
  if (!docContent) {
    alert("Document content not loaded yet.");
    return;
  }

  try {
    // Use Clipboard API to copy HTML content
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([docContent], { type: "text/html" }),
      }),
    ]);
    alert("Document content copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy content:", error);
    alert("Failed to copy content.");
  }
};
function modifyUrl(url: string): string {
  return url.includes('?') ? url.replace(/&?$/, '&') : `${url}?`;
}

// Usage example
console.log(modifyUrl("https://example.com?param=value")); // Outputs: https://example.com?param=value&
console.log(modifyUrl("https://example.com"));             // Outputs: https://example.com?
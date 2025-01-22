if (options?.body instanceof FormData) {
  const formDataEntries: [string, any][] = [];
  options.body.forEach((value, key) => {
    formDataEntries.push([key, value]);
  });

  for (const [key, value] of formDataEntries) {
    if (typeof value === 'object' && value !== null && !(value instanceof Blob)) {
      const jsonBlob = new Blob([JSON.stringify(value)], { type: 'application/json' });
      options.body.set(key, jsonBlob);
    }
  }
}
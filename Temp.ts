function ValpreAPIRequest(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET',
  url: string,
  options?: RequestOptions
): Promise<Response> {
  const isFormData = options?.body instanceof FormData;
  const isBlob = options?.body instanceof Blob;

  // Set headers (avoid setting 'Content-Type' for FormData and Blob)
  const headers = !isFormData && !isBlob
    ? {
        'Content-Type': 'application/json',
        ...options?.headers,
      }
    : {
        ...options?.headers,
      };

  // Prepare bodyContent
  const bodyContent =
    isFormData
      ? (() => {
          const formData = new FormData();
          options.body.forEach((value, key) => {
            if (typeof value === 'object' && !(value instanceof Blob)) {
              formData.set(
                key,
                new Blob([JSON.stringify(value)], { type: 'application/json' })
              );
            } else {
              formData.set(key, value);
            }
          });
          return formData;
        })()
      : isBlob
      ? options.body
      : headers['Content-Type'] === 'application/json'
      ? JSON.stringify(options?.body)
      : options?.body;

  // Make the request
  return fetch(url, {
    method,
    headers,
    body: method !== 'GET' && method !== 'DELETE' ? bodyContent : undefined,
  });
}

export default ValpreAPIRequest;
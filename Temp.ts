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
  const bodyContent = (() => {
    if (isFormData && options.body instanceof FormData) {
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
    } else if (isBlob) {
      return options.body;
    } else if (headers['Content-Type'] === 'application/json') {
      return JSON.stringify(options?.body);
    } else {
      return options?.body;
    }
  })();

  // Make the request
  return fetch(url, {
    method,
    headers,
    body: method !== 'GET' && method !== 'DELETE' ? bodyContent : undefined,
  });
}

export default ValpreAPIRequest;
import RequestOptions from "../config";

function ValpreAPIrequest<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET',
  url: string,
  options?: RequestOptions<T>
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // Define headers
      const headers = options?.body instanceof FormData
        ? { ...options?.headers } // Let the browser handle Content-Type for FormData
        : {
            'Content-Type': 'application/json',
            ...options?.headers,
          };

      // Process body content
      const bodyContent = (() => {
        if (options?.body instanceof FormData) {
          // Convert JSON objects in FormData to Blob
          for (const [key, value] of options.body.entries()) {
            if (typeof value === 'object' && value !== null && !(value instanceof Blob)) {
              const jsonBlob = new Blob([JSON.stringify(value)], { type: 'application/json' });
              options.body.set(key, jsonBlob);
            }
          }
          return options.body;
        } else if (options?.body instanceof Blob) {
          return options.body;
        } else if (headers['Content-Type'] === 'application/json') {
          return JSON.stringify(options?.body);
        } else if (
          headers['Content-Type'] === 'text/plain' ||
          headers['Content-Type'] === 'application/xml'
        ) {
          return options?.body; // Handle as plain text or XML string
        } else {
          return options?.body; // Fallback for other cases
        }
      })();

      // Make the API request
      const response = await fetch(url, {
        method: method,
        headers:
          options?.body instanceof FormData || options?.body instanceof Blob
            ? {} // Skip headers for FormData or Blob
            : headers,
        body: method !== 'GET' && method !== 'DELETE' ? bodyContent : undefined,
      });

      // Handle the response
      if (!response.ok) {
        reject(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      // Parse response based on Content-Type
      const contentType = response.headers.get('Content-Type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/plain')) {
        data = await response.text();
      } else if (contentType?.includes('application/octet-stream')) {
        data = await response.blob();
      } else {
        data = await response.text();
      }

      resolve(data);
    } catch (error) {
      reject(`API ${method} call error: ${error}`);
    }
  });
}

export default ValpreAPIrequest;
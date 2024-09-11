function request<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET', url: string, options?: RequestOptions<T>): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      // Correctly handle body for Blob and FormData
      const bodyContent = (() => {
        if (options?.body instanceof FormData || options?.body instanceof Blob) {
          // For FormData and Blob, do not modify the body and don't set the Content-Type header
          return options.body;
        } else if (headers['Content-Type'] === 'application/json') {
          return JSON.stringify(options?.body);
        } else if (headers['Content-Type'] === 'text/plain' || headers['Content-Type'] === 'application/xml') {
          return options?.body; // Handle as plain text or XML string
        } else {
          return options?.body; // Fallback for other cases
        }
      })();

      const response = await fetch(url, {
        method: method,
        headers: options?.body instanceof FormData || options?.body instanceof Blob ? {} : headers, // Avoid setting Content-Type for FormData/Blob
        body: method !== 'GET' && method !== 'DELETE' ? bodyContent : undefined,
      });

      if (!response.ok) {
        reject(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

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
type RequestOptions<T> = {
  headers?: Record<string, string>;
  body?: T;
};

// Generic request function (already implemented)
function request<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET', url: string, options?: RequestOptions<T>): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const bodyContent = (() => {
        if (headers['Content-Type'] === 'application/json') {
          return JSON.stringify(options?.body);
        } else if (headers['Content-Type'] === 'text/plain' || headers['Content-Type'] === 'application/xml') {
          return options?.body; // Handle as plain text or XML string
        } else if (options?.body instanceof FormData || options?.body instanceof Blob) {
          return options.body; // FormData and Blob don't need stringifying
        } else {
          return options?.body;
        }
      })();

      const response = await fetch(url, {
        method: method,
        headers: headers['Content-Type'] === 'multipart/form-data' ? {} : headers,
        body: method !== 'GET' ? bodyContent : undefined,
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

// Wrapper function for GET
function get<T>(url: string, options?: RequestOptions<T>): Promise<any> {
  return request('GET', url, options);
}

// Wrapper function for POST
function post<T>(url: string, options?: RequestOptions<T>): Promise<any> {
  return request('POST', url, options);
}

// Wrapper function for PUT
function put<T>(url: string, options?: RequestOptions<T>): Promise<any> {
  return request('PUT', url, options);
}

// Wrapper function for PATCH
function patch<T>(url: string, options?: RequestOptions<T>): Promise<any> {
  return request('PATCH', url, options);
}

// Wrapper function for DELETE
function del<T>(url: string, options?: RequestOptions<T>): Promise<any> {
  return request('DELETE', url, options);
}
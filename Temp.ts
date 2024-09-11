type RequestOptions<T> = {
  headers?: Record<string, string>;
  body?: T;
};

function post<T>(url: string, options?: RequestOptions<T>): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
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
      reject(`API POST call error: ${error}`);
    }
  });
}

// Example usage without async/await
post('https://api.example.com/create', {
  body: { name: 'John Doe' },
  headers: { Authorization: 'Bearer token' },
})
  .then((response) => {
    console.log('Response:', response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
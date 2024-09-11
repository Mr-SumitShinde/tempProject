type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

function get(url: string, options?: RequestOptions): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      let query = '';
      if (options?.params) {
        query = new URLSearchParams(options.params).toString();
        url = `${url}?${query}`;
      }

      const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      const response = await fetch(url, { method: 'GET', headers });

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
      reject(`API GET call error: ${error}`);
    }
  });
}

// Example usage without async/await
get('https://api.example.com/data')
  .then((response) => {
    console.log('Response:', response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
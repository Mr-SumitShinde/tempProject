type RequestOptions = {
  headers?: Record<string, string>;
  body?: Record<string, any> | FormData;
};

async function post<T>(url: string, options?: RequestOptions): Promise<T> {
  try {
    // Set headers if provided, defaults to JSON unless FormData is passed
    const headers = options?.body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
          ...options?.headers,
        };

    // Stringify the body if it is not FormData
    const body = options?.body instanceof FormData
      ? options.body
      : JSON.stringify(options?.body || {});

    // Make the API POST call
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Parse the response body
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('API POST call error:', error);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    const response = await post<{ success: boolean }>('https://api.example.com/data', {
      body: { name: 'John', age: 30 },
      headers: { Authorization: 'Bearer token' },
    });
    console.log(response);
  } catch (error) {
    console.error('Error posting data:', error);
  }
})();
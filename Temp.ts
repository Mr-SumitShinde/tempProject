type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

async function get<T>(url: string, options?: RequestOptions): Promise<T> {
  try {
    // Build query params if provided
    let query = '';
    if (options?.params) {
      query = new URLSearchParams(options.params).toString();
      url = `${url}?${query}`;
    }

    // Set headers if provided
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // Make the API GET call
    const response = await fetch(url, { method: 'GET', headers });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Parse the response body
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('API GET call error:', error);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    const response = await get<{ name: string }>('https://api.example.com/data', {
      params: { id: '123' },
      headers: { Authorization: 'Bearer token' },
    });
    console.log(response);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
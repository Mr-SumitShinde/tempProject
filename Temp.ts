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
      'Content-Type': 'application/json', // Default Content-Type
      ...options?.headers,
    };

    // Make the API GET call
    const response = await fetch(url, { method: 'GET', headers });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Determine the content type of the response
    const contentType = response.headers.get('Content-Type');

    let data: T;

    // Parse the response based on the content type
    if (contentType?.includes('application/json')) {
      data = await response.json(); // Parse as JSON
    } else if (contentType?.includes('text/plain')) {
      data = (await response.text()) as unknown as T; // Parse as plain text
    } else if (contentType?.includes('application/octet-stream')) {
      data = (await response.blob()) as unknown as T; // Parse as Blob
    } else {
      data = (await response.text()) as unknown as T; // Fallback to text
    }

    return data;
  } catch (error) {
    console.error('API GET call error:', error);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    const jsonResponse = await get<{ name: string }>('https://api.example.com/data', {
      params: { id: '123' },
      headers: { Authorization: 'Bearer token' },
    });
    console.log('JSON response:', jsonResponse);

    const textResponse = await get<string>('https://api.example.com/text');
    console.log('Text response:', textResponse);

    const blobResponse = await get<Blob>('https://api.example.com/file');
    console.log('Blob response:', blobResponse);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
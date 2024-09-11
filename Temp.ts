type RequestOptions<T> = {
  headers?: Record<string, string>;
  body?: T;
};

async function post<T, R>(url: string, options?: RequestOptions<T>): Promise<R> {
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
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');

    let data: R;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/plain')) {
      data = (await response.text()) as unknown as R;
    } else if (contentType?.includes('application/octet-stream')) {
      data = (await response.blob()) as unknown as R;
    } else {
      data = (await response.text()) as unknown as R;
    }

    return data;
  } catch (error) {
    console.error('API POST call error:', error);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    const postResponse = await post<{ name: string }, { id: number }>('https://api.example.com/data', {
      body: { name: 'John' },
      headers: { Authorization: 'Bearer token' },
    });
    console.log(postResponse);
  } catch (error) {
    console.error('Error posting data:', error);
  }
})();
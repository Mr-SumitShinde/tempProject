async function post(url: string, options?: RequestOptions<any>): Promise<any> {
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

    return data;
  } catch (error) {
    console.error('API POST call error:', error);
    throw error;
  }
}
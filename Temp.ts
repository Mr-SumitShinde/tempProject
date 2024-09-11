async function get(url: string, options?: RequestOptions): Promise<any> {
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
    console.error('API GET call error:', error);
    throw error;
  }
}
type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
};

async function post(url: string, options?: RequestOptions): Promise<any> {
  try {
    const headers = {
      'Content-Type': 'application/json', // Default Content-Type
      ...options?.headers,
    };

    let body;

    // Handle different body types based on Content-Type
    if (headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(options?.body); // Stringify for JSON
    } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      const urlEncodedBody = new URLSearchParams();
      Object.keys(options?.body || {}).forEach(key => {
        urlEncodedBody.append(key, options?.body[key]);
      });
      body = urlEncodedBody.toString(); // URL-encoded body
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      body = options?.body; // FormData is sent as-is
      delete headers['Content-Type']; // Let the browser set the correct boundary
    } else if (headers['Content-Type'] === 'text/plain') {
      body = options?.body; // Plain text body
    } else if (headers['Content-Type'] === 'application/octet-stream') {
      body = options?.body; // Binary data body
    } else {
      body = options?.body; // Custom or other types of data
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');

    let data;

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
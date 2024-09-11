type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
};

async function post(url: string, options?: RequestOptions): Promise<any> {
  const headers = {
    ...options?.headers,
    ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
  };

  let body;

  if (headers['Content-Type'] === 'application/json') {
    body = JSON.stringify(options?.body);
  } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    const urlEncodedBody = new URLSearchParams();
    Object.keys(options?.body || {}).forEach(key => {
      urlEncodedBody.append(key, options?.body[key]);
    });
    body = urlEncodedBody.toString();
  } else if (options?.body instanceof FormData) {
    body = options?.body;
  } else {
    body = options?.body;
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

  if (contentType?.includes('application/json')) {
    return await response.json();
  } else if (contentType?.includes('text/plain')) {
    return await response.text();
  } else if (contentType?.includes('application/octet-stream')) {
    return await response.blob();
  } else {
    return await response.text();
  }
}
import { ValpreAPIConfig } from '../config';

export async function transformData(response: Response, config: ValpreAPIConfig): Promise<Response> {
  let data;
  const contentType = response.headers.get('content-type') || '';

  if (config.responseType) {
    switch (config.responseType) {
      case 'json':
        data = await response.json();
        break;
      case 'blob':
        data = await response.blob();
        break;
      case 'arrayBuffer':
        data = await response.arrayBuffer();
        break;
      case 'text':
        data = await response.text();
        break;
      default:
        data = await response.text(); // Default to text
    }
  } else {
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else if (contentType.includes('application/octet-stream')) {
      data = await response.arrayBuffer();
    } else {
      data = await response.blob(); // Fallback to blob for other types
    }
  }

  (response as any).data = data;
  return response;
}


URL 

export function buildURL(url: string, params?: Record<string, any>): string {
  if (!params) return url;

  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach(val => searchParams.append(key, val.toString()));
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}


concurrent

export function all(promises: Promise<any>[]): Promise<any[]> {
  return Promise.all(promises);
}

export function spread(callback: (...args: any[]) => any): (arr: any[]) => any {
  return (arr) => callback(...arr);
}



progress

export function trackDownloadProgress(response: Response, onProgress: (progressEvent: ProgressEvent) => void): Response {
  const contentLength = response.headers.get('Content-Length');
  if (!contentLength) {
    return response;
  }

  const total = parseInt(contentLength, 10);
  let loaded = 0;

  const reader = response.body?.getReader();

  const stream = new ReadableStream({
    start(controller) {
      function push() {
        reader?.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          loaded += value?.length || 0;
          onProgress({
            loaded,
            total,
            lengthComputable: true,
          } as ProgressEvent);
          controller.enqueue(value);
          push();
        });
      }

      push();
    },
  });

  return new Response(stream, { headers: response.headers });
}

export async function sendRequestWithProgress(config: ValpreAPIConfig): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(config.method || 'GET', config.url!, true);

    // Set headers
    if (config.headers) {
      Object.keys(config.headers).forEach((key) => {
        xhr.setRequestHeader(key, (config.headers as any)[key]);
      });
    }

    if (config.onUploadProgress) {
      xhr.upload.onprogress = config.onUploadProgress;
    }

    xhr.onload = () => {
      resolve(new Response(xhr.responseText, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: new Headers(xhr.getAllResponseHeaders()),
      }));
    };

    xhr.onerror = () => reject(new Error('Network Error'));

    xhr.send(config.body);
  });
}
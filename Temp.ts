Certainly! Below is the documentation for the `ValpreAPI` library, which outlines its features, usage, configuration options, and examples. This documentation can be included in your project's README file or other documentation resources.

---

# ValpreAPI Documentation

ValpreAPI is a powerful, flexible, and type-safe HTTP client library designed for both browser and Node.js environments. It provides an easy-to-use API for making HTTP requests, with advanced features like interceptors, retry logic, progress tracking, and custom data transformations.

## Features

- **Type-safe HTTP client**: Designed with TypeScript to ensure strong type safety across your application.
- **Interceptors**: Modify requests and responses globally before they are handled.
- **Retry Logic**: Automatic retry of failed requests with customizable retry conditions and delays.
- **Progress Tracking**: Track upload and download progress of requests.
- **Custom Transformations**: Apply custom transformations to request and response data.
- **CSRF Protection**: Built-in support for adding CSRF tokens to requests.
- **Cancelable Requests**: Easily cancel ongoing requests.

## Installation

You can install ValpreAPI via npm or yarn:

```bash
npm install valpre-api
```

or

```bash
yarn add valpre-api
```

## Basic Usage

Here is an example of how to use ValpreAPI to make a basic HTTP GET request:

```typescript
import ValpreAPI from 'valpre-api';

const api = new ValpreAPI({
  baseURL: 'https://api.example.com',
});

api.get('/users')
  .then(response => {
    console.log('User data:', response);
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });
```

## Configuration

### ValpreAPIConfig

The `ValpreAPIConfig` interface defines the configuration options for requests made using ValpreAPI.

```typescript
interface ValpreAPIConfig extends RequestInit {
    url?: string;
    baseURL?: string;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    cancelToken?: { signal: AbortSignal };
    onUploadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void;
    onDownloadProgress?: (progressEvent: ProgressEvent<EventTarget>) => void;
    responseType?: 'json' | 'blob' | 'text' | 'arrayBuffer';
    retries?: number;
    retryDelay?: number;
    retryCondition?: (error: any, attempt: number) => boolean;
    adapter?: (config: ValpreAPIConfig) => Promise<Response>;
    transformRequest?: (data: any, headers: Record<string, string>) => any;
    transformResponse?: (data: any) => any;
    agent?: HttpAgent | HttpsAgent; // Node.js specific
}
```

### Example Configurations

```typescript
const api = new ValpreAPI({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  withCredentials: true,
  retries: 3,
  retryDelay: 1000,
  transformRequest: (data, headers) => {
    // Custom request transformation
    return JSON.stringify(data);
  },
  transformResponse: (data) => {
    // Custom response transformation
    return data;
  },
});
```

## HTTP Methods

ValpreAPI provides methods for all standard HTTP requests:

### `get(url: string, config?: ValpreAPIConfig): Promise<Response>`
### `post(url: string, data: any, config?: ValpreAPIConfig): Promise<Response>`
### `put(url: string, data: any, config?: ValpreAPIConfig): Promise<Response>`
### `delete(url: string, config?: ValpreAPIConfig): Promise<Response>`
### `patch(url: string, data: any, config?: ValpreAPIConfig): Promise<Response>`
### `head(url: string, config?: ValpreAPIConfig): Promise<Response>`
### `options(url: string, config?: ValpreAPIConfig): Promise<Response>`

### Example

```typescript
api.post('/users', { name: 'John Doe' })
  .then(response => {
    console.log('User created:', response);
  })
  .catch(error => {
    console.error('Error creating user:', error);
  });
```

## Interceptors

Interceptors allow you to run custom code or modify requests/responses before they are handled.

### Adding an Interceptor

```typescript
api.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer token';
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});
```

### Ejecting an Interceptor

```typescript
const requestInterceptor = api.interceptors.request.use(config => config);
api.interceptors.request.eject(requestInterceptor);
```

## Retry Logic

ValpreAPI allows you to automatically retry failed requests.

### Example

```typescript
api.get('/unstable-endpoint', {
  retries: 5,
  retryDelay: 2000,
  retryCondition: (error, attempt) => {
    return error.message.includes('Network Error') && attempt < 3;
  }
})
  .then(response => {
    console.log('Request succeeded:', response);
  })
  .catch(error => {
    console.error('Request failed:', error);
  });
```

## Progress Tracking

You can track upload and download progress using the `onUploadProgress` and `onDownloadProgress` options.

### Example

```typescript
api.post('/upload', fileData, {
  onUploadProgress: progressEvent => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log('Upload progress:', percentCompleted + '%');
  },
  onDownloadProgress: progressEvent => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log('Download progress:', percentCompleted + '%');
  }
})
  .then(response => {
    console.log('File uploaded successfully:', response);
  })
  .catch(error => {
    console.error('Upload error:', error);
  });
```

## CSRF Protection

ValpreAPI can automatically attach CSRF tokens to requests if configured.

### Example

```typescript
const api = new ValpreAPI({
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withCredentials: true,
});

api.post('/protected-endpoint', data)
  .then(response => {
    console.log('Request succeeded:', response);
  })
  .catch(error => {
    console.error('Request failed:', error);
  });
```

## Canceling Requests

ValpreAPI supports request cancellation via the `AbortController` API.

### Example

```typescript
const controller = new AbortController();

api.get('/long-request', {
  cancelToken: { signal: controller.signal }
})
  .then(response => {
    console.log('Request succeeded:', response);
  })
  .catch(error => {
    if (controller.signal.aborted) {
      console.log('Request was canceled');
    } else {
      console.error('Request error:', error);
    }
  });

// Cancel the request
controller.abort();
```

## Error Handling

ValpreAPI provides a helper to identify if an error is specific to ValpreAPI.

### Example

```typescript
api.get('/endpoint')
  .then(response => {
    console.log('Request succeeded:', response);
  })
  .catch(error => {
    if (ValpreAPI.isValpreAPIError(error)) {
      console.error('ValpreAPI error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
  });
```

## Concurrency Utilities

ValpreAPI offers utilities for managing multiple concurrent requests.

### `ValpreAPI.all(promises: Array<Promise<any>>): Promise<any[]>`

### `ValpreAPI.spread(callback: Function): (arr: any[]) => any`

### Example

```typescript
const request1 = api.get('/endpoint1');
const request2 = api.get('/endpoint2');

ValpreAPI.all([request1, request2])
  .then(ValpreAPI.spread((response1, response2) => {
    console.log('Response 1:', response1);
    console.log('Response 2:', response2);
  }))
  .catch(error => {
    console.error('Error in one of the requests:', error);
  });
```

## Advanced Configuration

### Node.js Agent Configuration

For Node.js environments, you can configure custom HTTP and HTTPS agents.

```typescript
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

const api = new ValpreAPI({
  baseURL: 'https://api.example.com',
  agent: new HttpsAgent({ keepAlive: true }),
});
```

## Conclusion

ValpreAPI is designed to be a comprehensive HTTP client library that balances ease of use with advanced features. Whether you're building a small project or a complex application, ValpreAPI provides the tools you need to manage HTTP requests effectively.

For more detailed examples and advanced use cases, please refer to the full documentation or explore the codebase.
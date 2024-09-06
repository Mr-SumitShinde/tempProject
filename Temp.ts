Here’s a detailed documentation for the interceptor feature in the `ValpreAPI` library.

---

## **Interceptors in `ValpreAPI`**

### **Introduction to Interceptors**

Interceptors in `ValpreAPI` are functions that allow you to run custom logic before a request is sent or after a response is received. They provide a powerful mechanism to modify requests and responses globally, enabling actions such as adding headers (e.g., authentication tokens), transforming data, logging, or handling errors centrally.

Interceptors in `ValpreAPI` are based on a similar concept to those in popular HTTP libraries like Axios, allowing you to handle or modify requests and responses easily.

### **How Interceptors Work**

- **Request Interceptors**: These interceptors are executed before the HTTP request is sent. They allow you to modify the request configuration, such as adding headers or changing request parameters.
  
- **Response Interceptors**: These interceptors are executed after the HTTP response is received but before it is passed to the calling code. They allow you to modify or log the response, handle errors, or retry failed requests.

Both request and response interceptors can be added using the `interceptors` property available on the `ValpreAPI` instance.

---

### **Adding Request and Response Interceptors**

#### **1. Request Interceptor**

You can add a request interceptor to modify or log request configurations before they are sent. For example, adding an authentication token to every request header:

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
});

api.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer your-auth-token`;
    console.log('Request Config:', config);
    return config;
}, (error) => {
    // Handle errors in request configuration
    return Promise.reject(error);
});
```

- **Config Modification**: The interceptor function receives the request `config` object and returns the modified `config` or throws an error.
- **Error Handling**: The second parameter of `use()` allows you to handle any errors that occur when setting up the request.

#### **2. Response Interceptor**

Response interceptors let you modify or inspect the response after it is received from the server, but before it is handed to the application.

```typescript
api.interceptors.response.use((response) => {
    // Modify the response data
    console.log('Response Data:', response.data);
    return response;
}, (error) => {
    // Handle the error and potentially retry the request or show a message
    if (error.response && error.response.status === 401) {
        console.log('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
});
```

- **Response Transformation**: Modify the response object, extract specific data, or log responses for monitoring.
- **Error Handling**: The second parameter of `use()` allows you to handle errors in the response, such as checking for specific HTTP status codes.

---

### **Interceptors API**

#### **Adding an Interceptor**

Interceptors are added using the `use` method:

```typescript
api.interceptors.request.use(onFulfilled, onRejected);
api.interceptors.response.use(onFulfilled, onRejected);
```

- **onFulfilled**: A function that takes the `config` (for requests) or `response` (for responses) and returns the modified config or response. It can also return a promise.
- **onRejected**: A function that handles errors during the request or response phase. It receives the error object and can return a promise or throw an error.

#### **Ejecting an Interceptor**

If you no longer need an interceptor, you can remove it using the `eject` method. The `use` method returns an ID that can be passed to `eject`:

```typescript
const requestInterceptorId = api.interceptors.request.use(onFulfilled, onRejected);

// Later, to remove the interceptor:
api.interceptors.request.eject(requestInterceptorId);
```

- **`eject(id)`**: Removes an interceptor by its ID. This can be used if you need to remove specific logic or modify how interceptors work during runtime.

#### **Running Interceptors**

Interceptors are executed in the order they are added. The `ValpreAPI` library ensures that the request interceptors are executed before the request is made, and response interceptors are executed after the response is received.

---

### **Detailed Example**

Here’s a complete example that demonstrates both request and response interceptors:

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
});

// Adding request interceptor
api.interceptors.request.use((config) => {
    // Add a token to all outgoing requests
    config.headers['Authorization'] = `Bearer my-auth-token`;
    config.headers['Custom-Header'] = 'CustomValue';
    return config;
}, (error) => {
    // Handle request setup error
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Adding response interceptor
api.interceptors.response.use((response) => {
    // Log response
    console.log('Response data:', response.data);
    return response;
}, (error) => {
    // Handle response errors
    if (error.response && error.response.status === 401) {
        console.error('Unauthorized! Redirecting...');
        // Add redirection logic or token refresh here
    } else if (error.response && error.response.status === 500) {
        console.error('Server Error!');
    }
    return Promise.reject(error);
});

// Making a request
async function fetchData() {
    try {
        const response = await api.request({
            url: '/user/profile',
            method: 'GET'
        });
        console.log('Profile data:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
```

---

### **Common Use Cases for Interceptors**

1. **Authentication**: Automatically attach authentication tokens to request headers.
2. **Logging**: Log request and response details for debugging or monitoring.
3. **Error Handling**: Centralize error handling logic (e.g., redirect to login on 401 errors).
4. **Response Transformation**: Automatically transform or filter response data.
5. **Request Cancellation**: Handle request cancellation scenarios before a request is sent.

---

### **Error Handling in Interceptors**

Interceptors can throw errors, and those errors will propagate through the promise chain, allowing you to handle them in a centralized place.

- **Request Errors**: Errors in request interceptors typically relate to issues in the request configuration (e.g., missing headers, invalid parameters).
- **Response Errors**: Response errors occur when the server returns an error response, such as a 404 or 500 error.

```typescript
api.interceptors.response.use(
    response => response,
    error => {
        if (ValpreAPI.isValpreAPIError(error)) {
            console.error('Error details:', error.config, error.message);
        }
        return Promise.reject(error);
    }
);
```

---

### **Conclusion**

Interceptors in `ValpreAPI` are powerful tools that allow you to customize the behavior of HTTP requests and responses. They enable centralization of logic such as authentication, logging, error handling, and data transformation, making it easier to manage complex application workflows.

By leveraging request and response interceptors, you can ensure consistency across your application’s network communication while keeping your codebase clean and maintainable.
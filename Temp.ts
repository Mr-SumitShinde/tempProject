Here’s a brief description of the remaining methods in `ValpreAPI` that you can include in your documentation:

### **3. `request` Method**

**Description**:
The `request` method is the core function used to make HTTP requests. It takes a configuration object as an argument, which can include URL, method, headers, data, and other options. This method handles all aspects of the request, including applying defaults, processing interceptors, and handling retries.

**Usage**:
```typescript
const response = await api.request({
    url: '/endpoint',
    method: 'GET',
    params: { id: 123 },
});
```

**Key Points**:
- The `request` method is flexible and can be used for all HTTP methods (GET, POST, PUT, DELETE, etc.).
- It supports features like interceptors, retry logic, and request/response transformations.

### **4. `get`, `post`, `put`, `delete`, etc. Methods**

**Description**:
These are convenience methods that simplify making HTTP requests of specific types (GET, POST, PUT, DELETE, etc.). They are shortcuts to the `request` method, automatically setting the appropriate HTTP method.

**Usage**:
```typescript
const response = await api.get('/endpoint', { params: { id: 123 } });
const response = await api.post('/endpoint', { data: { name: 'John' } });
```

**Key Points**:
- These methods reduce the need to specify the HTTP method explicitly.
- They accept the same options as `request`, but with the method pre-defined.

### **5. `interceptors` Property**

**Description**:
The `interceptors` property allows you to attach functions that intercept requests or responses before they are handled by the request method or after the response is received. This can be used to modify requests (e.g., adding headers) or to handle responses (e.g., processing data).

**Usage**:
```typescript
api.interceptors.request.use(config => {
    config.headers['Authorization'] = 'Bearer token';
    return config;
});

api.interceptors.response.use(response => {
    return response.data;
});
```

**Key Points**:
- The `interceptors` property contains two sub-properties: `request` and `response`, each of which manages a list of interceptors.
- Interceptors can be used to centralize logic like authentication, logging, or data transformation.

### **6. `retry` Method (Internal/Configurable)**

**Description**:
The `retry` method is part of the internal retry logic that automatically retries a request if it fails under certain conditions. This method can be configured through the `ValpreAPIConfig` to handle retries based on criteria such as network errors or specific status codes.

**Key Points**:
- This method enhances reliability by automatically retrying failed requests according to configured rules.
- It is usually configured through the `request` method’s `config` parameter rather than being called directly.

### **7. `CancelToken` Static Method**

**Description**:
The `CancelToken` method allows you to create tokens that can be used to cancel requests. This is particularly useful for aborting long-running requests or when the result of a request is no longer needed (e.g., navigating away from a page).

**Usage**:
```typescript
const cancelToken = ValpreAPI.CancelToken.source();

api.get('/endpoint', {
    cancelToken: cancelToken.token
});

// Later, to cancel the request:
cancelToken.cancel('Operation canceled by the user.');
```

**Key Points**:
- `CancelToken` provides a mechanism to cancel requests, preventing them from completing.
- This is useful for handling scenarios like user navigation changes or timeouts.

### **8. `isValpreAPIError` Static Method**

**Description**:
The `isValpreAPIError` method is a utility function used to check whether a given error is an instance of an error thrown by `ValpreAPI`. This is useful for distinguishing between errors thrown by the library and other types of errors.

**Usage**:
```typescript
try {
    await api.get('/endpoint');
} catch (error) {
    if (ValpreAPI.isValpreAPIError(error)) {
        console.error('Request failed:', error.message);
    }
}
```

**Key Points**:
- This method helps with error handling by allowing you to specifically catch and handle `ValpreAPI`-related errors.
- It returns `true` if the error is a `ValpreAPIError`, and `false` otherwise.

### **9. `all` Static Method**

**Description**:
The `all` method allows you to execute multiple promises concurrently, similar to `Promise.all`. This can be useful when you need to make several requests simultaneously and wait for all of them to complete.

**Usage**:
```typescript
const [response1, response2] = await ValpreAPI.all([
    api.get('/endpoint1'),
    api.get('/endpoint2')
]);
```

**Key Points**:
- `all` is a wrapper around `Promise.all`, designed to work seamlessly with `ValpreAPI` promises.
- It’s ideal for handling multiple concurrent API requests.

### **10. `spread` Static Method**

**Description**:
The `spread` method is a utility function that enables you to spread the results of a promise array into individual arguments. This is useful when used in combination with `ValpreAPI.all` to handle multiple results more cleanly.

**Usage**:
```typescript
ValpreAPI.all([
    api.get('/endpoint1'),
    api.get('/endpoint2')
]).then(ValpreAPI.spread((response1, response2) => {
    console.log(response1.data, response2.data);
}));
```

**Key Points**:
- `spread` simplifies handling multiple results by spreading them into individual arguments.
- It’s a syntactic sugar for destructuring the results from `ValpreAPI.all`.

These descriptions should help clarify the purpose and usage of each method in the `ValpreAPI` class for your documentation.
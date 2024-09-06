Here’s a detailed documentation for the **Utility Methods** in the `ValpreAPI` library:

---

## **Utility Methods in `ValpreAPI`**

### **Introduction to Utility Methods**

`ValpreAPI` provides several built-in utility methods to help developers handle common asynchronous tasks and manage request and response handling more effectively. These methods are similar to those found in popular HTTP libraries and are designed to simplify managing concurrent requests, spreading results across multiple functions, and identifying `ValpreAPI`-specific errors.

The key utility methods available in `ValpreAPI` are:
- `all`
- `spread`
- `isValpreAPIError`

---

### **1. `all`**

The `all` method is used to execute multiple asynchronous requests concurrently. It works similarly to JavaScript’s native `Promise.all()`. By using `ValpreAPI.all()`, you can send multiple requests at once and wait for all of them to complete.

#### **How It Works**
- You pass an array of promises (usually API requests) to `all`.
- The method will resolve when all the promises in the array have completed, returning the results in an array.
- If any of the requests fail, the entire `all` call will reject with the error of the first failed promise.

#### **Example Usage**

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
});

// Perform multiple requests concurrently
ValpreAPI.all([
    api.request({ url: '/users', method: 'GET' }),
    api.request({ url: '/posts', method: 'GET' }),
    api.request({ url: '/comments', method: 'GET' })
]).then((responses) => {
    const [usersResponse, postsResponse, commentsResponse] = responses;
    console.log('Users:', usersResponse.data);
    console.log('Posts:', postsResponse.data);
    console.log('Comments:', commentsResponse.data);
}).catch((error) => {
    console.error('One of the requests failed:', error);
});
```

#### **Parameters**
- **promises**: An array of promises, typically API requests.

#### **Return Value**
- Resolves with an array containing the results of all successful requests.
- Rejects if any of the requests fail, returning the first error encountered.

---

### **2. `spread`**

The `spread` method allows you to pass the results of `ValpreAPI.all()` as individual arguments to a function. This is useful when working with multiple concurrent requests, as it lets you spread the results into separate variables instead of working with an array.

#### **How It Works**
- After using `ValpreAPI.all()`, you can apply `ValpreAPI.spread()` to spread the results into individual arguments for the callback function.
  
#### **Example Usage**

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
});

// Perform concurrent requests and spread the results
ValpreAPI.all([
    api.request({ url: '/users', method: 'GET' }),
    api.request({ url: '/posts', method: 'GET' })
]).then(ValpreAPI.spread((usersResponse, postsResponse) => {
    console.log('Users:', usersResponse.data);
    console.log('Posts:', postsResponse.data);
})).catch((error) => {
    console.error('Request failed:', error);
});
```

#### **Parameters**
- **callback**: A function that accepts the spread results from multiple promises.

#### **Return Value**
- A function that takes the results array and applies it as individual arguments to the provided callback function.

---

### **3. `isValpreAPIError`**

The `isValpreAPIError` method helps you identify whether an error was thrown by `ValpreAPI`. This is useful for distinguishing `ValpreAPI`-specific errors from general JavaScript errors or errors from other libraries.

#### **How It Works**
- If an error is thrown during an HTTP request, you can check whether the error is a `ValpreAPIError` by passing the error object to `isValpreAPIError`.
  
#### **Example Usage**

```typescript
api.request({
    url: '/some-endpoint',
    method: 'GET',
}).then((response) => {
    console.log('Response:', response.data);
}).catch((error) => {
    if (ValpreAPI.isValpreAPIError(error)) {
        // Handle ValpreAPI-specific error
        console.error('ValpreAPI error:', error.message);
    } else {
        // Handle non-ValpreAPI errors
        console.error('General error:', error.message);
    }
});
```

#### **Parameters**
- **error**: The error object to check.

#### **Return Value**
- Returns `true` if the error is a `ValpreAPIError`.
- Returns `false` if the error is not related to `ValpreAPI`.

---

### **Use Cases for Utility Methods**

1. **Managing Multiple Requests**:
   - Use `ValpreAPI.all()` when you need to execute several HTTP requests concurrently and wait for all of them to finish, such as fetching user data and related posts at the same time.

2. **Simplifying Response Handling**:
   - Use `ValpreAPI.spread()` to avoid dealing with arrays when working with the results of multiple requests. This method helps you destructure results into individual arguments, improving readability.

3. **Consistent Error Handling**:
   - Use `isValpreAPIError()` to ensure you can distinguish between errors that come from `ValpreAPI` (such as network errors or response issues) and errors from other parts of your code. This allows you to handle each type of error more effectively.

---

### **Complete Example Using Utility Methods**

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
});

async function fetchData() {
    try {
        // Perform multiple concurrent requests
        const [usersResponse, postsResponse] = await ValpreAPI.all([
            api.request({ url: '/users', method: 'GET' }),
            api.request({ url: '/posts', method: 'GET' })
        ]);

        // Use spread to handle the results
        ValpreAPI.spread((users, posts) => {
            console.log('Users:', users.data);
            console.log('Posts:', posts.data);
        });

    } catch (error) {
        // Check if the error is from ValpreAPI
        if (ValpreAPI.isValpreAPIError(error)) {
            console.error('ValpreAPI-specific error:', error.message);
        } else {
            console.error('Unexpected error:', error.message);
        }
    }
}

fetchData();
```

---

### **Summary**

The utility methods in `ValpreAPI` offer powerful tools for handling multiple requests, spreading results across different functions, and identifying `ValpreAPI`-specific errors. These methods provide convenience and help maintain clean, efficient code in complex scenarios.

- **`all()`**: Execute multiple requests concurrently and resolve once all are completed.
- **`spread()`**: Spread the results of `all()` into individual function arguments for better readability.
- **`isValpreAPIError()`**: Identify errors thrown specifically by `ValpreAPI`, helping with precise error handling.

These utility methods make `ValpreAPI` more flexible and developer-friendly, allowing for more efficient API management and better handling of asynchronous operations.

--- 

This documentation provides detailed examples and explanations of how to use each of the utility methods effectively in the `ValpreAPI` library.
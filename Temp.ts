Here’s a detailed documentation for the `CancelToken` feature in the `ValpreAPI` library:

---

## **`CancelToken` in `ValpreAPI`**

### **Introduction to `CancelToken`**

`CancelToken` in `ValpreAPI` allows you to cancel requests that have not yet completed. This is useful in scenarios where you want to abort an HTTP request due to user interactions or changing conditions, such as when a user navigates away from a page or when an API call becomes unnecessary.

By using `CancelToken`, you can ensure that resources are not wasted on requests that are no longer needed, improving the performance and responsiveness of your application.

---

### **How `CancelToken` Works**

- **Creating a Token**: You can create a `CancelToken` instance using `ValpreAPI.CancelToken.source()`. This generates a token and a `cancel` function that can be called to abort the request.
  
- **Attaching a Token to a Request**: The generated token is attached to the request using the `cancelToken` property in the request configuration.

- **Canceling a Request**: You can call the `cancel` function at any time to cancel the request. Once a request is canceled, it will not be completed, and an error will be thrown, which you can handle accordingly.

---

### **Using `CancelToken` to Cancel Requests**

#### **1. Creating and Using a `CancelToken`**

To cancel a request, you need to create a `CancelToken` and attach it to the request configuration.

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
});

// Create a cancel token source
const source = ValpreAPI.CancelToken.source();

// Make a request with the cancel token
api.request({
    url: '/endpoint',
    method: 'GET',
    cancelToken: source.token,
}).then((response) => {
    console.log('Response received:', response.data);
}).catch((error) => {
    if (ValpreAPI.isValpreAPIError(error) && error.message === 'Request canceled') {
        console.log('Request was canceled:', error.message);
    } else {
        console.error('Request failed:', error.message);
    }
});

// Cancel the request
source.cancel('Request canceled by the user.');
```

- **`CancelToken.source()`**: Creates a new `CancelToken` along with a `cancel` function.
- **`cancelToken`**: The token that is attached to the request configuration.
- **`source.cancel(message)`**: The function used to cancel the request. You can provide a custom message to indicate why the request was canceled.

#### **2. Handling Canceled Requests**

When a request is canceled, a special error is thrown, which you can handle using `try-catch` or `.catch()` in a promise chain. The error message will include the reason for cancellation.

Example of error handling:

```typescript
try {
    const response = await api.request({
        url: '/endpoint',
        method: 'GET',
        cancelToken: source.token
    });
    console.log('Response:', response.data);
} catch (error) {
    if (ValpreAPI.isValpreAPIError(error) && error.message === 'Request canceled by the user.') {
        console.log('Request was canceled:', error.message);
    } else {
        console.error('Error occurred:', error.message);
    }
}
```

---

### **CancelToken API**

#### **Creating a CancelToken**

You can create a cancel token using the `CancelToken.source()` method. This creates an object with two properties:

- **`token`**: The actual `CancelToken` instance that will be attached to the request.
- **`cancel`**: A function that, when called, cancels the request.

```typescript
const source = ValpreAPI.CancelToken.source();
```

#### **Attaching the CancelToken to a Request**

Once the token is created, you can attach it to the request configuration using the `cancelToken` property:

```typescript
const config = {
    url: '/endpoint',
    method: 'GET',
    cancelToken: source.token
};
api.request(config);
```

#### **Canceling the Request**

To cancel the request, simply call the `cancel` function at any point:

```typescript
source.cancel('Operation canceled by the user.');
```

Once this function is called, the request will be aborted, and an error will be thrown.

---

### **Common Use Cases for `CancelToken`**

1. **Aborting Long-Running Requests**: You can cancel requests that take too long to complete, especially in situations where the user might navigate away from a page before the request finishes.

```typescript
const source = ValpreAPI.CancelToken.source();
setTimeout(() => {
    source.cancel('Request timed out');
}, 5000); // Cancel request if it takes longer than 5 seconds
```

2. **Canceling Redundant Requests**: In scenarios where multiple requests might be sent (e.g., typing in a search box), you can cancel previous requests if new ones are made.

```typescript
let lastRequestToken;

function search(query) {
    if (lastRequestToken) {
        lastRequestToken.cancel('New search started');
    }
    
    lastRequestToken = ValpreAPI.CancelToken.source();

    api.request({
        url: '/search',
        method: 'GET',
        params: { q: query },
        cancelToken: lastRequestToken.token
    }).then((response) => {
        console.log('Search results:', response.data);
    }).catch((error) => {
        if (ValpreAPI.isValpreAPIError(error) && error.message === 'New search started') {
            console.log('Previous search was canceled');
        } else {
            console.error('Search failed:', error.message);
        }
    });
}
```

3. **Handling Component Unmounts**: When using `ValpreAPI` in a frontend framework (e.g., React), you can cancel requests when a component is unmounted to prevent memory leaks.

```typescript
useEffect(() => {
    const source = ValpreAPI.CancelToken.source();

    api.request({
        url: '/user/profile',
        method: 'GET',
        cancelToken: source.token
    }).then((response) => {
        setUserProfile(response.data);
    }).catch((error) => {
        if (ValpreAPI.isValpreAPIError(error) && error.message === 'Component unmounted') {
            console.log('Request canceled due to component unmount');
        }
    });

    return () => {
        source.cancel('Component unmounted');
    };
}, []);
```

---

### **Error Handling with `CancelToken`**

When a request is canceled, `ValpreAPI` will throw an error that contains the message you provided when calling `source.cancel()`. The error can be identified by checking if it's a `ValpreAPIError` and by checking the error message.

```typescript
api.request({
    url: '/data',
    cancelToken: source.token
}).catch((error) => {
    if (ValpreAPI.isValpreAPIError(error)) {
        if (error.message === 'Request canceled by the user.') {
            console.log('Request was canceled:', error.message);
        } else {
            console.error('Other ValpreAPI Error:', error.message);
        }
    }
});
```

---

### **Complete Example Using `CancelToken`**

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000
});

// Create a cancel token source
const source = ValpreAPI.CancelToken.source();

// Make a request with the cancel token
api.request({
    url: '/data',
    method: 'GET',
    cancelToken: source.token,
}).then((response) => {
    console.log('Data received:', response.data);
}).catch((error) => {
    if (ValpreAPI.isValpreAPIError(error) && error.message === 'Request canceled by the user.') {
        console.log('Request was canceled:', error.message);
    } else {
        console.error('Error:', error.message);
    }
});

// Cancel the request after some condition
setTimeout(() => {
    source.cancel('Request canceled by the user.');
}, 2000);
```

---

### **Summary**

The `CancelToken` feature in `ValpreAPI` allows you to cancel ongoing HTTP requests efficiently. This can be especially useful in scenarios where requests become unnecessary, take too long, or when the user navigates away from a component or page.

By using `CancelToken`, you can improve the performance and user experience of your application, ensuring that no unnecessary requests are made or completed once they are no longer needed.
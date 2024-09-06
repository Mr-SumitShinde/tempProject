Here’s a detailed documentation for the retry logic feature in the `ValpreAPI` library.

---

## **Retry Logic in `ValpreAPI`**

### **Introduction to Retry Logic**

Retry logic in `ValpreAPI` allows you to automatically retry failed requests based on specific conditions, such as network errors or certain status codes. This is particularly useful in scenarios where network instability or temporary server issues might cause a request to fail, and retrying the request after a short delay can resolve the issue.

Retries are handled at the request level, and you can configure the number of retries, the retry conditions, and the delay between retries.

---

### **How Retry Logic Works**

- **Retries on Certain Errors**: You can specify which errors should trigger a retry, such as network failures or specific HTTP status codes (e.g., 500 for server errors).
- **Configurable Retry Attempts**: You can configure how many times a request should be retried before giving up.
- **Customizable Retry Delay**: You can control how long the library waits before retrying a failed request, either with a fixed delay or an exponential backoff.

Retries are triggered automatically when a request fails based on the conditions you define.

---

### **Adding Retry Logic**

#### **1. Setting Up Retry Configuration**

You can configure retry behavior by specifying the number of retry attempts, a delay between retries, and the conditions that should trigger a retry. This can be done at the request level by passing the options when calling the `request` method.

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
});

const config = {
    url: '/data',
    method: 'GET',
    retries: 3, // Retry up to 3 times
    retryDelay: 1000, // 1 second delay between retries
    retryCondition: (error: any) => {
        // Retry only for network errors or 5xx server errors
        return !error.response || error.response.status >= 500;
    }
};

api.request(config)
    .then(response => console.log('Data:', response.data))
    .catch(error => console.error('Request failed after retries:', error));
```

- **`retries`**: Specifies the maximum number of retry attempts.
- **`retryDelay`**: Defines the delay (in milliseconds) between each retry attempt.
- **`retryCondition`**: A function that determines whether or not the request should be retried based on the error received.

---

### **Retry API**

#### **Retry Configuration Options**

1. **`retries` (number)**:
   - Specifies the number of retry attempts for a failed request.
   - **Default**: `0` (no retries).
   - Example: `retries: 3` will retry the request up to three times before failing.

2. **`retryDelay` (number | function)**:
   - The delay (in milliseconds) between each retry attempt.
   - Can be a fixed number or a function that returns a delay (e.g., for exponential backoff).
   - **Default**: `0` (no delay).
   - Example: `retryDelay: 1000` will wait 1 second between each retry attempt.

3. **`retryCondition` (function)**:
   - A function that receives the error and determines whether the request should be retried.
   - Returns `true` if the request should be retried, and `false` otherwise.
   - **Default**: Retries on network errors (i.e., no response) and HTTP status codes 5xx (server errors).
   - Example: `retryCondition: (error) => !error.response || error.response.status >= 500` will retry only for network errors and server errors.

---

### **Retry Example**

Here’s an example of how you can use retry logic to handle network failures and retry the request:

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
});

async function fetchData() {
    try {
        const response = await api.request({
            url: '/posts/1',
            method: 'GET',
            retries: 3, // Retry 3 times
            retryDelay: 2000, // Wait 2 seconds between retries
            retryCondition: (error) => {
                // Retry on network errors or 5xx status codes
                return !error.response || error.response.status >= 500;
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Failed after retries:', error);
    }
}

fetchData();
```

In this example:

- The request will be retried up to 3 times if it encounters a network error or a server error (status code 500 or higher).
- The library will wait 2 seconds between each retry attempt.

---

### **Custom Retry Delay Logic (Exponential Backoff)**

You can implement an exponential backoff strategy for retry delays, where the delay between retries increases exponentially with each attempt:

```typescript
const config = {
    url: '/data',
    method: 'GET',
    retries: 5, // Retry up to 5 times
    retryDelay: (retryCount: number) => {
        // Exponential backoff: 1000ms * 2^retryCount
        return 1000 * Math.pow(2, retryCount);
    },
    retryCondition: (error) => {
        return !error.response || error.response.status >= 500;
    }
};

api.request(config)
    .then(response => console.log('Data:', response.data))
    .catch(error => console.error('Failed after retries:', error));
```

In this case:

- The retry delay increases with each retry (1 second, 2 seconds, 4 seconds, 8 seconds, etc.).
- This strategy is useful to avoid overwhelming the server with repeated requests in a short period.

---

### **Error Handling with Retries**

You can still catch and handle errors after all retry attempts have failed:

```typescript
api.request({
    url: '/data',
    method: 'GET',
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => !error.response || error.response.status >= 500
})
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Request failed after retries:', error);
    });
```

In this example, if the request fails after 3 retries, the error is caught in the `.catch()` block where you can handle it.

---

### **Common Use Cases for Retry Logic**

1. **Network Instability**: Retry logic is particularly useful in situations where network connections may temporarily fail. Automatic retries can ensure that transient errors don’t result in a complete failure.
   
2. **Server-Side Issues**: Retrying requests in the event of a server error (status codes 5xx) can be helpful, especially if the issue is temporary and might resolve after a short delay.

3. **Rate Limiting**: In cases where a server implements rate limiting, you might want to retry a request after a delay to give the server time to reset your rate limit.

---

### **Handling Exhausted Retries**

Once all retries are exhausted, the error will be propagated back to the application, allowing you to handle it as you would any other error.

```typescript
api.request({
    url: '/data',
    method: 'GET',
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => !error.response || error.response.status >= 500
})
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        // Handle the final error after all retry attempts have been exhausted
        console.error('Request failed after retries:', error);
    });
```

---

### **Conclusion**

Retry logic in `ValpreAPI` enhances the resilience of your application by automatically retrying failed requests based on custom conditions. This feature is especially useful for handling network issues, server errors, and temporary failures, improving the reliability of your HTTP requests.

By leveraging configurable retries, delays, and retry conditions, you can fine-tune how your application responds to transient failures, making your application more fault-tolerant and responsive to intermittent issues.
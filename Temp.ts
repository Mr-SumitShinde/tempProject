Sure! Below is the documentation for **Release 1.0** of the `ValpreAPI` library, detailing the limited access for the following features:

- **Create an instance**
- **Basic HTTP Methods**: `get`, `post`, `put`, `delete`, `patch`, `head`, `options`
- **Request method**

---

# **ValpreAPI - Release 1.0 Documentation**

## **Introduction**

The `ValpreAPI` library provides a flexible and easy-to-use API for handling HTTP requests. In **Release 1.0**, only a subset of core functionality is available to the end user, while keeping all features present in the codebase for future expansion. This version allows developers to work with basic HTTP methods and create instances of the API.

---

## **Getting Started**

### **Installation**

To install the library, use npm or yarn:

```bash
npm install @barclays/valpre-api-services
```

or

```bash
yarn add @barclays/valpre-api-services
```

---

## **Creating an Instance**

The `ValpreAPI` class allows you to create an API instance with a base configuration. This configuration includes settings like `baseURL`, `headers`, and `timeout`.

### **Creating a New Instance**

```typescript
import { ValpreAPIServices } from '@barclays/valpre-api-services';

const api = new ValpreAPIServices({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
});
```

### **Config Options**

- `baseURL`: The base URL for all requests made by this instance.
- `timeout`: The maximum time to wait for a response before the request times out (in milliseconds).

---

## **HTTP Methods**

In **Release 1.0**, the following HTTP methods are available:

1. **GET**
2. **POST**
3. **PUT**
4. **DELETE**
5. **PATCH**
6. **HEAD**
7. **OPTIONS**

### **1. GET Request**

Use the `get` method to retrieve data from an API endpoint.

```typescript
api.get('/todos/1')
  .then(response => console.log('Data:', response))
  .catch(error => console.error('Error:', error));
```

### **2. POST Request**

Use the `post` method to send data to the server.

```typescript
api.post('/posts', {
    title: 'New Post',
    body: 'This is the content of the post.',
    userId: 1
  })
  .then(response => console.log('Post Created:', response))
  .catch(error => console.error('Error:', error));
```

### **3. PUT Request**

Use the `put` method to update existing data.

```typescript
api.put('/posts/1', {
    title: 'Updated Title',
    body: 'Updated content.',
    userId: 1
  })
  .then(response => console.log('Post Updated:', response))
  .catch(error => console.error('Error:', error));
```

### **4. DELETE Request**

Use the `delete` method to remove data from the server.

```typescript
api.delete('/posts/1')
  .then(response => console.log('Post Deleted:', response))
  .catch(error => console.error('Error:', error));
```

### **5. PATCH Request**

Use the `patch` method to partially update existing data.

```typescript
api.patch('/posts/1', {
    title: 'Partially Updated Title'
  })
  .then(response => console.log('Post Updated:', response))
  .catch(error => console.error('Error:', error));
```

### **6. HEAD Request**

Use the `head` method to check headers without retrieving the body content.

```typescript
api.head('/posts')
  .then(response => console.log('Headers:', response.headers))
  .catch(error => console.error('Error:', error));
```

### **7. OPTIONS Request**

Use the `options` method to request the HTTP options available for a resource.

```typescript
api.options('/posts')
  .then(response => console.log('Options:', response))
  .catch(error => console.error('Error:', error));
```

---

## **Request Method**

The `request` method gives you full control over making a custom HTTP request. This allows you to specify additional details such as headers, request body, and query parameters.

### **Custom Request**

```typescript
api.request({
    url: '/posts',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer my-token'
    }
  })
  .then(response => console.log('Custom Request Response:', response))
  .catch(error => console.error('Error:', error));
```

### **Config Options for `request()`**

- `url`: The URL to request.
- `method`: HTTP method (e.g., `GET`, `POST`, etc.).
- `headers`: Custom headers for the request.
- `body`: The request payload (for methods like `POST` and `PUT`).

---

## **Error Handling**

All requests are wrapped in promises and can either resolve with a response or reject with an error. It's important to use `.catch()` to handle any potential errors.

```typescript
api.get('/invalid-url')
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Error:', error));
```

In the case of a network error or an invalid URL, the error will be caught and can be logged or handled appropriately.

---

## **Feature Availability in Release 1.0**

In **Release 1.0**, the following features are available:

- **Instance Creation**: Create a new instance of `ValpreAPIServices`.
- **HTTP Methods**: `get`, `post`, `put`, `delete`, `patch`, `head`, and `options`.
- **Custom Requests**: Full control over the request using the `request` method.

Other advanced features (such as `setDefaults`, `create`, utility methods like `spread` and `all`) are not exposed in this release but remain present in the codebase for future expansion.

---

## **Future Expansion**

In future releases of the `ValpreAPI` library, more features will be exposed, including:

- **Utility Methods**: Methods like `setDefaults`, `create`, `all`, and `spread` will be available.
- **Error Utilities**: Better error-handling utilities will be introduced.
- **Advanced Configuration**: Further configurability will be provided for interceptors, retries, and request transforms.

Stay tuned for future updates!

---

## **Conclusion**

`ValpreAPI - Release 1.0` provides essential methods for making HTTP requests and managing APIs. The simplified interface ensures ease of use while maintaining flexibility for custom requests. Future releases will unlock more advanced features, providing even greater control and customization.

---

### **Feedback and Contributions**

We welcome feedback and contributions to improve `ValpreAPI`. Please reach out if you have any suggestions or issues with the library.

---

This documentation explains the limited-access version of `ValpreAPI` (Release 1.0). If you need access to more features, stay tuned for upcoming releases!

Let me know if you'd like further customization to the documentation!
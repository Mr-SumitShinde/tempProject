Sure! Below is the documentation for the release of the **ValpreAPIServices** library version **1.0**. This documentation will cover the purpose of the library, how to install and use it, and provide detailed explanations for each of the functions: `valpreAPIGet`, `valpreAPIPost`, `valpreAPIPut`, `valpreAPIPatch`, and `valpreAPIDel`.

---

# **ValpreAPIServices Library** - Version 1.0

## **Overview**
The **ValpreAPIServices** library provides a simple and unified interface for making HTTP requests using `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` methods. The library abstracts the underlying complexities of making API calls and ensures smooth handling of different content types such as `JSON`, `Blob`, `FormData`, and plain text.

With the core of the library powered by the `valpreAPIRequest` function, the package provides individual functions for each HTTP method to simplify and structure API interaction.

---

## **Installation**

You can install the library via npm or yarn:

### Using npm:
```bash
npm install valpre-api-services
```

### Using yarn:
```bash
yarn add valpre-api-services
```

---

## **Usage**

After installation, you can import and use the individual functions for making API requests.

### Importing the functions:
```typescript
import { 
  valpreAPIGet, 
  valpreAPIPost, 
  valpreAPIPut, 
  valpreAPIPatch, 
  valpreAPIDel 
} from 'valpre-api-services';
```

---

## **Functions**

### 1. **`valpreAPIGet`**
Performs an HTTP `GET` request to retrieve data from an API.

#### Usage:
```typescript
valpreAPIGet(url: string, options?: RequestOptions)
```

#### Parameters:
- **`url`**: The endpoint URL for the GET request.
- **`options`**: (Optional) An object containing request headers and query parameters.

#### Example:
```typescript
valpreAPIGet('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer token' }
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 2. **`valpreAPIPost`**
Performs an HTTP `POST` request to send data to an API.

#### Usage:
```typescript
valpreAPIPost(url: string, options?: RequestOptions)
```

#### Parameters:
- **`url`**: The endpoint URL for the POST request.
- **`options`**: (Optional) An object containing request headers and the body payload.

#### Example:
```typescript
valpreAPIPost('https://api.example.com/create', {
  body: { name: 'John Doe', age: 30 },
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 3. **`valpreAPIPut`**
Performs an HTTP `PUT` request to update existing data via an API.

#### Usage:
```typescript
valpreAPIPut(url: string, options?: RequestOptions)
```

#### Parameters:
- **`url`**: The endpoint URL for the PUT request.
- **`options`**: (Optional) An object containing request headers and the body payload.

#### Example:
```typescript
valpreAPIPut('https://api.example.com/update', {
  body: { id: 1, name: 'John Doe', age: 31 },
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 4. **`valpreAPIPatch`**
Performs an HTTP `PATCH` request to partially update data via an API.

#### Usage:
```typescript
valpreAPIPatch(url: string, options?: RequestOptions)
```

#### Parameters:
- **`url`**: The endpoint URL for the PATCH request.
- **`options`**: (Optional) An object containing request headers and the body payload.

#### Example:
```typescript
valpreAPIPatch('https://api.example.com/modify', {
  body: { age: 31 },
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 5. **`valpreAPIDel`**
Performs an HTTP `DELETE` request to delete data from an API.

#### Usage:
```typescript
valpreAPIDel(url: string, options?: RequestOptions)
```

#### Parameters:
- **`url`**: The endpoint URL for the DELETE request.
- **`options`**: (Optional) An object containing request headers.

#### Example:
```typescript
valpreAPIDel('https://api.example.com/delete/1', {
  headers: { 'Authorization': 'Bearer token' }
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

---

## **Request Options**

The optional `RequestOptions` parameter can be passed to customize headers and body content for each request.

### Structure of `RequestOptions`:
```typescript
type RequestOptions<T = any> = {
  headers?: Record<string, string>;
  body?: T;
};
```

#### Example with Headers and Body:
```typescript
const options = {
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  },
  body: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com'
  }
};
```

---

## **Response Handling**

Each function returns a `Promise` that resolves the parsed response from the API. The response can be of various types such as `JSON`, `Blob`, `Text`, depending on the content type of the response.

If the request fails (e.g., due to network errors or non-2xx status codes), the `Promise` will be rejected with an appropriate error message.

#### Example:
```typescript
valpreAPIPost('https://api.example.com/data', {
  body: { name: 'John Doe' },
  headers: { 'Content-Type': 'application/json' }
})
  .then(response => {
    console.log('Success:', response);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

## **Error Handling**

If a request fails due to network issues or the server returns a non-successful status code (i.e., outside the `2xx` range), the promise will be rejected with a detailed error message, such as:

- `Error: 404 - Not Found`
- `Error: 500 - Internal Server Error`
- `API POST call error: Network Error`

This allows the developer to catch and handle errors appropriately in their application.

---

## **Changelog for Version 1.0**

- Initial release of **ValpreAPIServices** library.
- Provides five HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- Automatically handles various content types, including `application/json`, `text/plain`, `application/xml`, `Blob`, and `FormData`.
- Handles both request and response parsing seamlessly.
- Customizable request options with headers and body.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

This documentation provides a detailed overview of the **ValpreAPIServices** library for version **1.0**. If you have any specific details or customizations you'd like to add, feel free to let me know!
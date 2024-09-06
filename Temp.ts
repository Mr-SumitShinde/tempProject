Here’s a detailed documentation for the `transformData` feature in the `ValpreAPI` library:

---

## **`transformData` in `ValpreAPI`**

### **Introduction to `transformData`**

In `ValpreAPI`, the `transformData` function plays a crucial role in converting data between different formats during the HTTP request and response cycle. This function is used to automatically process request payloads before they are sent to the server and to parse responses after they are received.

By using `transformData`, you can ensure that your data is correctly formatted, whether you need to serialize an object into JSON, handle form data, or process response data into a more usable form.

---

### **How `transformData` Works**

- **Request Transformation**: Before the request is sent to the server, the request data is transformed into the appropriate format. This typically involves serializing an object into a JSON string or converting form data into the correct format.
  
- **Response Transformation**: After the response is received from the server, the raw response data is parsed and transformed into a more usable format. For example, a JSON response string might be parsed into an object.

---

### **Configuring `transformData`**

`transformData` is typically set via request/response configuration in the `ValpreAPIConfig`. Developers can provide custom transformation logic to control how data is formatted for both requests and responses.

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    transformRequest: (data, headers) => {
        // Custom logic to transform request data
        return JSON.stringify(data);
    },
    transformResponse: (data) => {
        // Custom logic to transform response data
        return JSON.parse(data);
    }
});
```

---

### **Adding Custom `transformData` Logic**

#### **1. Transforming Request Data**

To modify or format request data before it is sent to the server, you can provide a custom `transformRequest` function. This function can modify the request data and headers.

Example:

```typescript
api.interceptors.request.use((config) => {
    config.transformRequest = (data, headers) => {
        // Example: Convert the request data to JSON and add a custom header
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
    };
    return config;
});
```

- **Parameters**:
  - `data`: The request data to be sent to the server.
  - `headers`: The request headers, which can be modified if necessary.

- **Return Value**:
  - This function should return the transformed data, such as a JSON string, a FormData object, or another format.

#### **2. Transforming Response Data**

To modify or parse response data received from the server, you can provide a custom `transformResponse` function.

Example:

```typescript
api.interceptors.response.use((response) => {
    response.config.transformResponse = (data) => {
        // Example: Automatically parse the response as JSON
        try {
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Failed to parse response as JSON');
        }
    };
    return response;
});
```

- **Parameters**:
  - `data`: The raw response data from the server, typically a string.
  
- **Return Value**:
  - This function should return the transformed data, such as a parsed JSON object or other formatted data.

---

### **Default Behavior of `transformData`**

By default, if no custom `transformRequest` or `transformResponse` functions are provided, `ValpreAPI` will attempt to transform data using basic JSON serialization and parsing logic.

- **Request**: It will serialize the request data to a JSON string if it's an object.
  
- **Response**: It will parse the response data into an object if the response has a `Content-Type` of `application/json`.

#### Default Transformation Logic:

```typescript
const defaultTransformRequest = (data: any, headers: any) => {
    if (typeof data === 'object' && data !== null) {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
    }
    return data;
};

const defaultTransformResponse = (data: string) => {
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
};
```

---

### **Common Use Cases for `transformData`**

1. **Form Data**: If your application needs to send form data to the server, `transformRequest` can help convert JavaScript objects into `FormData` objects.

```typescript
api.interceptors.request.use((config) => {
    config.transformRequest = (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return formData;
    };
    return config;
});
```

2. **Handling Non-JSON Responses**: If your server returns non-JSON data, such as plain text or XML, `transformResponse` can help parse and handle the data correctly.

```typescript
api.interceptors.response.use((response) => {
    response.config.transformResponse = (data) => {
        // Example: Handling plain text responses
        if (typeof data === 'string') {
            return data;
        }
        return JSON.parse(data);
    };
    return response;
});
```

3. **Error Handling in Response Transformation**: You can use `transformResponse` to handle scenarios where the server returns malformed or unexpected data.

```typescript
api.interceptors.response.use((response) => {
    response.config.transformResponse = (data) => {
        try {
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Response could not be parsed as JSON');
        }
    };
    return response;
});
```

---

### **Complete Example of Custom `transformData`**

```typescript
const api = ValpreAPI.create({
    baseURL: 'https://api.example.com',
    timeout: 5000
});

// Custom transformation logic for requests and responses
api.interceptors.request.use((config) => {
    config.transformRequest = (data, headers) => {
        // Example: Convert data to FormData for file uploads
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        headers['Content-Type'] = 'multipart/form-data';
        return formData;
    };
    return config;
});

api.interceptors.response.use((response) => {
    response.config.transformResponse = (data) => {
        // Example: Parse response as JSON, but handle errors
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Response could not be parsed as JSON:', error);
            return data;  // Return raw data if JSON parsing fails
        }
    };
    return response;
});

// Example API request
async function uploadFile() {
    const file = document.querySelector('#fileInput').files[0];
    try {
        const response = await api.request({
            url: '/upload',
            method: 'POST',
            data: { file }
        });
        console.log('File uploaded successfully:', response.data);
    } catch (error) {
        console.error('File upload failed:', error);
    }
}

uploadFile();
```

---

### **Summary**

`transformData` is a powerful feature in `ValpreAPI` that allows you to customize the transformation of request and response data. It simplifies handling various data formats like JSON, FormData, and raw text while offering flexibility for custom scenarios.

By leveraging `transformRequest` and `transformResponse`, you can ensure that your data is properly serialized before being sent to the server and appropriately parsed after being received, making your API integration more robust and efficient.
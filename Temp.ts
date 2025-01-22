To redirect users to a logout page when a session timeout occurs (handled by the backend), you can check for specific HTTP response statuses (e.g., 401 Unauthorized or 403 Forbidden) in the fetch response. If such a status is detected, redirect the user to the logout page.

Here’s how you can modify your ValpreAPIRequest function to handle session timeouts without affecting existing features:


---

Modified Code to Handle Session Timeout

function ValpreAPIRequest(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET',
  url: string,
  options?: RequestOptions
): Promise<Response> {
  const isFormData = options?.body instanceof FormData;
  const isBlob = options?.body instanceof Blob;

  const headers = !isFormData && !isBlob
    ? {
        'Content-Type': 'application/json',
        ...options?.headers,
      }
    : {
        ...options?.headers,
      };

  const bodyContent = (() => {
    if (isFormData && options.body instanceof FormData) {
      const formData = new FormData();
      options.body.forEach((value, key) => {
        if (typeof value === 'object' && !(value instanceof Blob)) {
          formData.set(
            key,
            new Blob([JSON.stringify(value)], { type: 'application/json' })
          );
        } else {
          formData.set(key, value);
        }
      });
      return formData;
    } else if (isBlob) {
      return options.body;
    } else if (headers['Content-Type'] === 'application/json') {
      return JSON.stringify(options?.body);
    } else {
      return options?.body;
    }
  })();

  return fetch(url, {
    method,
    headers,
    body: method !== 'GET' && method !== 'DELETE' ? bodyContent : undefined,
  })
    .then((response) => {
      // Check for session timeout (e.g., 401 Unauthorized)
      if (response.status === 401) {
        // Redirect to the logout page
        window.location.href = '/logout';
        return Promise.reject(
          new Error('Session timed out. Redirecting to logout.')
        );
      }

      // Optionally handle other error statuses here if needed

      return response;
    })
    .catch((error) => {
      console.error(`Request failed for ${method} ${url}:`, error);
      throw error;
    });
}

export default ValpreAPIRequest;


---

How It Works

1. Check Response Status:

After the fetch call, check the response.status in the .then block.

If the status code matches a session timeout indicator (commonly 401), redirect the user to the logout page.



2. Redirect to Logout Page:

Use window.location.href = '/logout' to navigate the user to the logout page.



3. Reject the Promise:

Return a rejected Promise with an appropriate error message so that the calling code is aware of the redirection.



4. Preserve Existing Features:

Other features remain unaffected because only specific status codes trigger the redirection.





---

Non-Intrusive Behavior

If the response is not 401, the function behaves as usual, returning the response for further processing by the caller.

Other errors (e.g., network issues) are caught and logged in the .catch block.



---

Advanced Options

1. Handle Logout URL Dynamically:

If the logout URL might vary, you can pass it as part of the options parameter or fetch it from a config file:

const logoutUrl = options?.logoutUrl || '/logout';
if (response.status === 401) {
  window.location.href = logoutUrl;
}



2. Notify the User:

Before redirecting, you can display a message (e.g., a modal) informing the user about the session timeout.



3. Centralized Redirection:

Extract the redirection logic to a utility function if it is used in multiple places:

function handleSessionTimeout() {
  window.location.href = '/logout';
}





---

This approach ensures your existing features are not impacted while providing a seamless way to handle session timeouts. Let me know if you need further refinements!


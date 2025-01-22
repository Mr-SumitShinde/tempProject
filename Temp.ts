function ValpreAPIRequest(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET',
  url: string,
  options?: RequestOptions
): Promise<Response> {
  const isFormData = options?.body instanceof FormData;
  const isBlob = options?.body instanceof Blob;

  // Set headers (skip 'Content-Type' for FormData or Blob)
  const headers = !isFormData && !isBlob
    ? {
        'Content-Type': 'application/json',
        ...options?.headers,
      }
    : {
        ...options?.headers,
      };

  // Prepare body content
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
      if (response.status === 401) {
        // Handle session timeout
        clearClientDataOnLogout();
        window.location.href = '/logout';
        throw new Error('Session timed out. Redirecting to logout.');
      }

      if (!response.ok) {
        // Handle other HTTP errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response;
    })
    .catch((error) => {
      console.error(`Request failed for ${method} ${url}:`, error);
      throw error; // Re-throw so the caller can handle it.
    });
}

// Helper function to clear client-side data on logout
function clearClientDataOnLogout(): void {
  // Clear authentication tokens from localStorage, sessionStorage, and cookies
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  document.cookie = 'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;';

  // Reset any global state (if applicable, e.g., Redux, Context API)
  // Example:
  // dispatch({ type: 'RESET_STATE' });
}

export default ValpreAPIRequest;
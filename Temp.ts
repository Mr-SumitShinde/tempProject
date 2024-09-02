async request(config: ValpreAPIConfig): Promise<Response> {
  // Merge defaults with the incoming config
  config = { ...this.defaults, ...config };

  // Apply request interceptors synchronously
  this.interceptors.request.forEach(interceptor => {
    config = interceptor.fulfilled(config) || config;
  });

  if (config.cancelToken) {
    config.signal = config.cancelToken.signal;
  }

  applyCSRFToken(config);

  // Build URL with query params
  config.url = buildURL(config.url!, config.params);

  let response: Response;

  if (typeof window === 'undefined') {
    // Node.js environment
    response = await this.httpAdapter(config);
  } else {
    // Browser environment
    if (config.onUploadProgress) {
      response = await sendRequestWithProgress(config);
    } else {
      response = await fetch(config.url!, config);

      // Handle download progress
      if (config.onDownloadProgress) {
        response = trackDownloadProgress(response, config.onDownloadProgress);
      }
    }
  }

  // Handle HTTP status errors
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  response = await transformData(response, config);

  this.interceptors.response.forEach(interceptor => {
    response = interceptor.fulfilled(response) || response;
  });

  return response;
}
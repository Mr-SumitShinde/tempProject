async request(config: ValpreAPIConfig): Promise<Response> {
  // Run request interceptors
  config = await this.interceptors.request.run(config);

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

  // Run response interceptors
  response = await this.interceptors.response.run(response);

  return response;
}
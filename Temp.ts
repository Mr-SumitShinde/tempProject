async request(config: ValpreAPIServicesConfig): Promise<any> { // Change to 'any' to reflect different data types
    config = { ...this.defaults, ...config };

    if (config.baseURL && !/^https?:\/\//i.test(config.url!)) {
        config.url = `${config.baseURL.replace(/\/+$/, '')}/${config.url!.replace(/^\/+/, '')}`;
    }

    config = await this.interceptors.request.run(config);

    applyCSRFToken(config);
    config.body = handleRequestData(config.body, config.headers as Record<string, string>, config.transformRequest);

    const requestFn = () => this.adapter(config);
    const response = await addRetryCapability(config, requestFn);

    // Automatically handle the response body based on content type
    const contentType = response.headers.get('Content-Type') || '';

    let parsedBody: any;
    if (contentType.includes('application/json')) {
        parsedBody = await response.json(); // Parse JSON automatically
    } else if (contentType.includes('text/')) {
        parsedBody = await response.text(); // Parse text automatically
    } else {
        parsedBody = await response.blob(); // Handle binary data (e.g., images, files)
    }

    const transformedResponse = await handleResponseData(response, config.responseType, config.transformResponse);
    
    // Return the parsed body along with the original response
    return {
        ...transformedResponse,
        data: parsedBody, // Add parsed data to the response
    };
}
async request(config: ValpreAPIServicesConfig): Promise<any> {
    // Merge default config with user-provided config
    config = { ...this.defaults, ...config };

    // Add baseURL if it's not an absolute URL
    if (config.baseURL && !/^https?:\/\//i.test(config.url!)) {
        config.url = `${config.baseURL.replace(/\/+$/, '')}/${config.url!.replace(/^\/+/, '')}`;
    }

    // Run request interceptors
    config = await this.interceptors.request.run(config);

    // Apply CSRF token if needed
    applyCSRFToken(config);

    // Transform request body if applicable
    config.body = handleRequestData(
        config.body,
        config.headers as Record<string, string>,
        config.transformRequest
    );

    // Call the adapter (httpAdapter)
    const requestFn = () => this.adapter(config);
    const response = await addRetryCapability(config, requestFn);

    // Handle response parsing
    const contentType = response.headers.get('Content-Type') || '';
    let parsedBody: any;

    if (config.autoParseResponse !== false) {
        try {
            if (contentType.includes('application/json')) {
                parsedBody = await response.json(); // Parse JSON
            } else if (contentType.includes('text/')) {
                parsedBody = await response.text(); // Parse text
            } else {
                parsedBody = await response.blob(); // Handle binary data
            }
        } catch (error: any) {
            throw new Error(`Failed to parse response: ${error.message}`);
        }
    } else {
        // If autoParseResponse is disabled, return the raw response
        parsedBody = response;
    }

    // Apply response interceptors and return the final parsed response
    const transformedResponse = await handleResponseData(
        response,
        config.responseType,
        config.transformResponse
    );

    return {
        ...transformedResponse,
        data: parsedBody,
    };
}
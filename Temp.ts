async request(config: ValpreAPIServicesConfig): Promise<any> {
    config = { ...this.defaults, ...config };

    if (config.baseURL && !/^https?:\/\//i.test(config.url!)) {
        config.url = `${config.baseURL.replace(/\/+$/, '')}/${config.url!.replace(/^\/+/, '')}`;
    }

    config = await this.interceptors.request.run(config);

    applyCSRFToken(config);
    config.body = handleRequestData(config.body, config.headers as Record<string, string>, config.transformRequest);

    const requestFn = () => this.adapter(config);
    const response = await addRetryCapability(config, requestFn);

    const contentType = response.headers.get('Content-Type') || '';
    let parsedBody: any;

    // Allow users to disable automatic parsing via config
    if (config.autoParseResponse !== false) { 
        try {
            if (contentType.includes('application/json')) {
                parsedBody = await response.json();
            } else if (contentType.includes('text/')) {
                parsedBody = await response.text();
            } else {
                parsedBody = await response.blob();
            }
        } catch (error) {
            throw new Error(`Failed to parse response: ${error.message}`);
        }
    } else {
        parsedBody = response; // Return the raw response if autoParseResponse is disabled
    }

    const transformedResponse = await handleResponseData(response, config.responseType, config.transformResponse);
    return {
        ...transformedResponse,
        data: parsedBody,
    };
}
async request(config: ValpreAPIServicesConfig): Promise<Response> {
    config = { ...this.defaults, ...config };

    if (config.baseURL && !/^https?:\/\//i.test(config.url!)) {
        config.url = `${config.baseURL.replace(/\/+$/, '')}/${config.url!.replace(/^\/+/, '')}`;
    }

    config = await this.interceptors.request.run(config);

    applyCSRFToken(config);
    config.body = handleRequestData(config.body, config.headers as Record<string, string>, config.transformRequest);

    const requestFn = () => this.adapter(config);
    const response = await addRetryCapability(config, requestFn);

    const transformedResponse = await handleResponseData(response, config.responseType, config.transformResponse);

    return this.interceptors.response.run(transformedResponse);
}
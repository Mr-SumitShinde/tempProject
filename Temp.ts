import { httpAdapter } from './httpAdapter';
import { ValpreAPIConfig, defaults } from './config';
import { InterceptorManager } from './interceptors';
import { CancelToken } from './cancelToken';
import * as InstanceMethods from './instanceMethods';
import * as UtilityMethods from './utilityMethods';
import { applyCSRFToken } from './utils/csurf';
import { addRetryCapability } from './utils/retry';
import { sendRequestWithProgress } from './utils/progress';
import { handleRequestData, handleResponseData } from './utils/jsonHandling';
import { isFormData, handleFormData } from './utils/formData';

export class ValpreAPI {
    defaults: ValpreAPIConfig;
    interceptors: {
        request: InterceptorManager<ValpreAPIConfig>;
        response: InterceptorManager<Response>;
    };
    private adapter: (config: ValpreAPIConfig) => Promise<Response>;

    constructor(config: ValpreAPIConfig = {}, adapter?: (config: ValpreAPIConfig) => Promise<Response>) {
        this.defaults = { ...defaults, ...config };
        this.adapter = adapter || httpAdapter;
        this.interceptors = {
            request: new InterceptorManager<ValpreAPIConfig>(),
            response: new InterceptorManager<Response>(),
        };
    }

    async request(config: ValpreAPIConfig): Promise<Response> {
        // Apply defaults and interceptors
        config = { ...this.defaults, ...config };
        config = await this.interceptors.request.run(config);

        // Apply CSRF token if necessary
        applyCSRFToken(config);

        // Handle form data or JSON data
        if (isFormData(config.body)) {
            config.body = handleFormData(config.body);
        } else {
            config.body = handleRequestData(config.body);
        }

        // Retry logic
        const requestFn = () => this.adapter(config);
        const response = await addRetryCapability(config, requestFn);

        // Handle response transformation
        const transformedResponse = await handleResponseData(response, config.responseType);

        // Run response interceptors
        return this.interceptors.response.run(transformedResponse);
    }

    get(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instanceGet.call(this, url, config);
    }

    post(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instancePost.call(this, url, data, config);
    }

    put(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instancePut.call(this, url, data, config);
    }

    delete(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instanceDelete.call(this, url, config);
    }

    patch(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instancePatch.call(this, url, data, config);
    }

    head(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instanceHead.call(this, url, config);
    }

    options(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
        return InstanceMethods.instanceOptions.call(this, url, config);
    }

    static setDefaults(newDefaults: Partial<ValpreAPIConfig>): void {
        UtilityMethods.setGlobalDefaults(newDefaults);
    }

    static create(instanceConfig: ValpreAPIConfig): ValpreAPI {
        return UtilityMethods.createInstance(instanceConfig);
    }

    static CancelToken = CancelToken;

    static isValpreAPIError(error: any): error is ValpreAPIError {
        return UtilityMethods.isValpreAPIError(error);
    }

    static all = (promises: Array<Promise<any>>): Promise<any[]> => {
        return Promise.all(promises);
    };

    static spread = (callback: Function): (arr: any[]) => any => {
        return function wrap(arr: any[]) {
            return callback(...arr);
        };
    };
}
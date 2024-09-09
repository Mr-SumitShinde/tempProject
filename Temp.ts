// valpre-api-services.ts
import { httpAdapter } from './httpAdapter';
import { ValpreAPIServicesConfig, defaults } from './config';
import { InterceptorManager } from './interceptors';
import { CancelToken } from './cancelToken';
import * as InstanceMethods from './instanceMethods';
import * as UtilityMethods from './utilityMethods';
import { ValpreAPIServicesError } from './utils/errorHandling';
import { addRetryCapability } from './utils/retry';
import { handleRequestData, handleResponseData } from './utils/transformData';
import { applyCSRFToken } from './utils/csurf';

export class ValpreAPIServices {
    defaults: ValpreAPIServicesConfig;
    interceptors: {
        request: InterceptorManager<ValpreAPIServicesConfig>;
        response: InterceptorManager<Response>;
    };
    private adapter: (config: ValpreAPIServicesConfig) => Promise<Response>;

    constructor(config: ValpreAPIServicesConfig = {}, adapter?: (config: ValpreAPIServicesConfig) => Promise<Response>) {
        this.defaults = { ...defaults, ...config };
        this.adapter = adapter || httpAdapter;
        this.interceptors = {
            request: new InterceptorManager<ValpreAPIServicesConfig>(),
            response: new InterceptorManager<Response>(),
        };
    }

    async request(config: ValpreAPIServicesConfig): Promise<Response> {
        config = { ...this.defaults, ...config };
        config = await this.interceptors.request.run(config);

        applyCSRFToken(config);
        config.body = handleRequestData(config.body, config.headers as Record<string, string>, config.transformRequest);

        const requestFn = () => this.adapter(config);
        const response = await addRetryCapability(config, requestFn);

        const transformedResponse = await handleResponseData(response, config.responseType, config.transformResponse);
        return this.interceptors.response.run(transformedResponse);
    }

    // Corrected methods
    get(url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instanceGet.call(this, url, config);
    }

    post(url: string, data: any, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instancePost.call(this, url, data, config);
    }

    put(url: string, data: any, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instancePut.call(this, url, data, config);
    }

    delete(url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instanceDelete.call(this, url, config);
    }

    patch(url: string, data: any, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instancePatch.call(this, url, data, config);
    }

    head(url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instanceHead.call(this, url, config);
    }

    options(url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
        return InstanceMethods.instanceOptions.call(this, url, config);
    }

    // Utility methods
    static setDefaults(newDefaults: Partial<ValpreAPIServicesConfig>): void {
        UtilityMethods.setGlobalDefaults(newDefaults);
    }

    static create(instanceConfig: ValpreAPIServicesConfig): ValpreAPIServices {
        return UtilityMethods.createInstance(instanceConfig);
    }

    static CancelToken = CancelToken;

    static isValpreAPIServicesError(error: any): error is ValpreAPIServicesError {
        return UtilityMethods.isValpreAPIServicesError(error);
    }

    static all(promises: Array<Promise<any>>): Promise<any[]> {
        return Promise.all(promises);
    }

    static spread(callback: Function): (arr: any[]) => any {
        return function wrap(arr: any[]) {
            return callback(...arr);
        };
    }
}
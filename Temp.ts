import { httpAdapter } from './httpAdapter';
import { ValpreAPIConfig, defaults } from '../config';
import { InterceptorManager } from '../interceptors';
import { CancelToken } from '../cancelToken';
import * as Methods from './methods';
import * as InstanceMethods from './instanceMethods';
import * as UtilityMethods from './utilityMethods';

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

    request(config: ValpreAPIConfig): Promise<Response> {
        return this.adapter(config);
    }

    // HTTP methods - connecting to instance-specific methods
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

    // Utility methods
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

    // Concurrency utilities
    static all = (promises: Array<Promise<any>>): Promise<any[]> => {
        return Promise.all(promises);
    };

    static spread = (callback: Function): (arr: any[]) => any => {
        return function wrap(arr: any[]) {
            return callback(...arr);
        };
    };
}
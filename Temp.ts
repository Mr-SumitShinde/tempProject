// valpreAPI.ts
import { createError, ValpreAPIError } from './utils/errorHandling';
import { ValpreAPIConfig } from './types';
import { httpAdapter } from './httpAdapter';
import { InterceptorManager } from './interceptors';

export class ValpreAPI {
    defaults: ValpreAPIConfig;
    interceptors: {
        request: InterceptorManager<ValpreAPIConfig>;
        response: InterceptorManager<any>;
    };

    constructor(defaultConfig: ValpreAPIConfig) {
        this.defaults = defaultConfig;
        this.interceptors = {
            request: new InterceptorManager<ValpreAPIConfig>(),
            response: new InterceptorManager<any>(),
        };
    }

    async request(config: ValpreAPIConfig): Promise<any> {
        try {
            // Run request interceptors
            const requestConfig = await this.interceptors.request.run(config);
            // Make the HTTP request using the adapter
            const response = await httpAdapter(requestConfig);
            // Run response interceptors
            const finalResponse = await this.interceptors.response.run(response);
            return finalResponse;
        } catch (error) {
            // Handle errors with detailed information
            if (error.response) {
                throw createError(
                    `Request failed with status code ${error.response.status}`,
                    config,
                    null,
                    error.request,
                    error.response
                );
            } else if (error.request) {
                throw createError(
                    'No response received from the server',
                    config,
                    'ECONNABORTED',
                    error.request
                );
            } else {
                throw createError(
                    `Request setup failed: ${error.message}`,
                    config
                );
            }
        }
    }

    setDefault(defaultConfig: ValpreAPIConfig): void {
        this.defaults = { ...this.defaults, ...defaultConfig };
    }

    static create(defaultConfig: ValpreAPIConfig): ValpreAPI {
        return new ValpreAPI(defaultConfig);
    }

    static isValpreAPIError(error: any): error is ValpreAPIError {
        return error.isValpreAPIError === true;
    }

    static all(promises: Promise<any>[]): Promise<any[]> {
        return Promise.all(promises);
    }

    static spread(callback: (...args: any[]) => any): (arr: any[]) => any {
        return function wrap(arr: any[]) {
            return callback(...arr);
        };
    }
}
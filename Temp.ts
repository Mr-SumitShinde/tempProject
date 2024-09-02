import { httpAdapter } from './httpAdapter';
import { ValpreAPIConfig, defaults } from '../config';
import { InterceptorManager } from '../interceptors';
import { CancelToken } from '../cancelToken';
import * as Methods from './methods';
import * as InstanceMethods from './instanceMethods';
import * as AxiosLikeMethods from './axiosLikeMethods';

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
        return this
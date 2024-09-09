// instanceMethods.ts
import { ValpreAPIServicesConfig } from './config';
import { ValpreAPIServices } from './valpre-api-services';

export function instanceGet(this: ValpreAPIServices, url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    // Call request directly, instead of calling `this.get()`
    return this.request({ ...config, method: 'GET', url });
}

export function instancePost(this: ValpreAPIServices, url: string, data: any, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'POST', url, body: data });
}

export function instancePut(this: ValpreAPIServices, url: string, data: any, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'PUT', url, body: data });
}

export function instanceDelete(this: ValpreAPIServices, url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'DELETE', url });
}

export function instancePatch(this: ValpreAPIServices, url: string, data: any, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'PATCH', url, body: data });
}

export function instanceHead(this: ValpreAPIServices, url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'HEAD', url });
}

export function instanceOptions(this: ValpreAPIServices, url: string, config: ValpreAPIServicesConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'OPTIONS', url });
}
import { ValpreAPI } from './valpreAPI';

export function instanceRequest(this: ValpreAPI, config: ValpreAPIConfig): Promise<Response> {
    return this.request(config);
}

export function instanceGet(this: ValpreAPI, url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.get(url, config);
}

export function instancePost(this: ValpreAPI, url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.post(url, data, config);
}

export function instancePut(this: ValpreAPI, url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.put(url, data, config);
}

export function instanceDelete(this: ValpreAPI, url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.delete(url, config);
}

export function instancePatch(this: ValpreAPI, url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.patch(url, data, config);
}

export function instanceHead(this: ValpreAPI, url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.head(url, config);
}

export function instanceOptions(this: ValpreAPI, url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.options(url, config);
}
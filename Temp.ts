import { ValpreAPIConfig } from '../config';
import { request } from './request';

export function get(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'GET', url });
}

export function post(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'POST', url, body: JSON.stringify(data) });
}

export function put(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'PUT', url, body: JSON.stringify(data) });
}

export function del(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'DELETE', url });
}

export function patch(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'PATCH', url, body: JSON.stringify(data) });
}

export function head(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'HEAD', url });
}

export function options(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return request({ ...config, method: 'OPTIONS', url });
}
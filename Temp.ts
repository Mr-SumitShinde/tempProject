import { ValpreAPIServices } from './valpre-api-services';
import { setDefaults, ValpreAPIServicesConfig } from './config';
import { ValpreAPIServicesError } from './utils/errorHandling';

export function setGlobalDefaults(newDefaults: Partial<ValpreAPIServicesConfig>): void {
    Object.assign(setDefaults, newDefaults);
}

export function isValpreAPIServicesError(error: any): error is ValpreAPIServicesError {
    return error instanceof ValpreAPIServicesError;
}

export function createInstance(config: ValpreAPIServicesConfig): ValpreAPIServices {
    return new ValpreAPIServices(config);
}

export function all(promises: Array<Promise<any>>): Promise<any[]> {
    return Promise.all(promises);
}

export function spread(callback: Function): (arr: any[]) => any {
    return function wrap(arr: any[]) {
        return callback(...arr);
    };
}
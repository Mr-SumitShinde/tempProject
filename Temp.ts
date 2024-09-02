import { ValpreAPI } from './valpreAPI';
import { setDefaults } from '../config';
import { ValpreAPIError } from '../utils/errorHandling';

export function setGlobalDefaults(newDefaults: Partial<ValpreAPIConfig>): void {
    setDefaults(newDefaults);
}

export function isValpreAPIError(error: any): error is ValpreAPIError {
    return error instanceof ValpreAPIError;
}

export function createInstance(config: ValpreAPIConfig): ValpreAPI {
    return ValpreAPI.create(config);
}
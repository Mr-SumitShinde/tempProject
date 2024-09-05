// src/utils/errorHandling.ts
import { ValpreAPIConfig } from '../types';

export interface ValpreAPIError extends Error {
    config?: ValpreAPIConfig;
    code?: string;
    request?: any;
    response?: any;
    isValpreAPIError: boolean;
}

export function createError(
    message: string,
    config: ValpreAPIConfig,
    code?: string,
    request?: any,
    response?: any
): ValpreAPIError {
    const error = new Error(message) as ValpreAPIError;
    error.config = config;
    error.code = code;
    error.request = request;
    error.response = response;
    error.isValpreAPIError = true;

    return error;
}
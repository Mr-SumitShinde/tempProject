import { ValpreAPIConfig } from '../config';

export async function retryRequest(
    requestFn: () => Promise<Response>,
    retries: number = 3,
    delay: number = 1000,
    retryCondition?: (error: any, attempt: number) => boolean
): Promise<Response> {
    let lastError: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await requestFn();
        } catch (err) {
            lastError = err;

            if (attempt === retries || (retryCondition && !retryCondition(err, attempt))) {
                throw lastError;
            }

            await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
    }

    throw lastError;
}

export function addRetryCapability(config: ValpreAPIConfig, requestFn: () => Promise<Response>): Promise<Response> {
    const retries = config.retries !== undefined ? config.retries : 3;
    const retryDelay = config.retryDelay !== undefined ? config.retryDelay : 1000;
    const retryCondition = config.retryCondition;

    return retryRequest(requestFn, retries, retryDelay, retryCondition);
}
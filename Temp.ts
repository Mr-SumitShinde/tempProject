import { ValpreAPIServicesConfig } from './config';

export async function httpAdapter(config: ValpreAPIServicesConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const { signal } = controller;

        const options: RequestInit = {
            method: config.method,
            headers: config.headers as HeadersInit,
            body: typeof config.body === 'string' || config.body instanceof URLSearchParams || config.body instanceof FormData
                ? config.body
                : JSON.stringify(config.body),
            signal,
        };

        fetch(config.url!, options)
            .then(async (res) => {
                const contentType = res.headers.get('Content-Type') || '';
                let parsedBody: any;

                try {
                    if (contentType.includes('application/json')) {
                        parsedBody = await res.json();
                    } else if (contentType.includes('text/')) {
                        parsedBody = await res.text();
                    } else {
                        parsedBody = await res.blob();
                    }
                } catch (error: any) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                    return;
                }

                if (res.ok) {
                    resolve(new Response(parsedBody, {
                        status: res.status,
                        statusText: res.statusText,
                        headers: res.headers,
                    }));
                } else {
                    reject(new Error(`HTTP Error: ${res.status} - ${res.statusText}`));
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    reject(new Error('Request timed out'));
                } else {
                    reject(new Error(`Network Error: ${err.message}`));
                }
            });

        if (config.timeout) {
            setTimeout(() => {
                controller.abort();
            }, config.timeout);
        }
    });
}
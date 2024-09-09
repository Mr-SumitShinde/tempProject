import { ValpreAPIServicesConfig } from './config';

export async function httpAdapter(config: ValpreAPIServicesConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
        // Using the fetch API to make the request
        const options: RequestInit = {
            method: config.method,
            headers: config.headers as HeadersInit,
            body: typeof config.body === 'string' ? config.body : JSON.stringify(config.body),
        };

        // Use the fetch API to send the request
        fetch(config.url!, options)
            .then(async (res) => {
                const body = await res.text();
                const response = new Response(body, {
                    status: res.status,
                    statusText: res.statusText,
                    headers: new Headers(
                        Object.entries(res.headers as unknown as Record<string, string>).reduce(
                            (acc, [key, value]) => {
                                acc[key] = value;
                                return acc;
                            },
                            {} as Record<string, string>
                        )
                    ),
                });

                resolve(response);
            })
            .catch((err) => {
                reject(err);
            });

        // Handle timeout if it's set in the configuration
        if (config.timeout) {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, config.timeout);
        }
    });
}
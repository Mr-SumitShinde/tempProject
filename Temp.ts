import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import { ValpreAPIConfig } from '../config';
import { createError } from '../utils/errorHandling';

export async function httpAdapter(config: ValpreAPIConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(config.url!);
        const isHttps = parsedUrl.protocol === 'https:';
        const options: http.RequestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : isHttps ? 443 : 80,
            path: `${parsedUrl.pathname}${parsedUrl.search}`,
            method: config.method,
            headers: config.headers as http.OutgoingHttpHeaders,
            agent: config.agent, // Now valid since agent is defined in the config
        };

        const requestModule = isHttps ? https : http;
        const req = requestModule.request(options, (res) => {
            const chunks: Buffer[] = [];

            res.on('data', (chunk) => {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                const response = new Response(body, {
                    status: res.statusCode || 0,
                    statusText: res.statusMessage || '',
                    headers: new Headers(
                        Object.entries(res.headers).reduce((acc, [key, value]) => {
                            if (Array.isArray(value)) {
                                acc[key] = value.join(', ');
                            } else if (value !== undefined) {
                                acc[key] = value;
                            }
                            return acc;
                        }, {} as Record<string, string>)
                    ),
                });
                resolve(response);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (config.timeout) {
            req.setTimeout(config.timeout, () => {
                req.abort();
                reject(new Error('Request timed out'));
            });
        }

        if (config.body) {
            if (typeof config.body === 'string' || Buffer.isBuffer(config.body)) {
                req.write(config.body);
            } else {
                req.write(JSON.stringify(config.body));
            }
        }

        req.end();
    });
}
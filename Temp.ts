npm install stream-http https-browserify url


import http from 'http';
import https from 'https';
import { URL } from 'url';

export async function httpAdapter(config: any) {
    return new Promise((resolve, reject) => {
        const { url, method = 'GET', headers = {}, data = null } = config;

        // Parse the URL using the polyfilled URL module
        const parsedUrl = new URL(url);

        // Determine whether to use http or https
        const transport = parsedUrl.protocol === 'https:' ? https : http;

        const options = {
            method,
            headers,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
        };

        // Make the HTTP/HTTPS request using the polyfilled http/https modules
        const req = transport.request(options, (res) => {
            let responseData = '';

            // Collect the response data
            res.on('data', (chunk) => {
                responseData += chunk;
            });

            // Resolve the promise when the response ends
            res.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve({
                        data,
                        status: res.statusCode,
                        headers: res.headers,
                        config,
                        request: req,
                    });
                } catch (error) {
                    reject(new Error('Failed to parse response data'));
                }
            });
        });

        // Handle request errors
        req.on('error', (err) => {
            reject(err);
        });

        // Write request data if provided
        if (data) {
            req.write(data);
        }

        req.end();
    });
}
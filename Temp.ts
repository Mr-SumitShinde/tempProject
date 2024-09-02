import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import { InterceptorManager } from './interceptors';
import { CancelToken } from './cancelToken';
import { transformData } from './utils/transformData';
import { retryRequest, RetryOptions } from './utils/retry';
import { applyCSRFToken } from './utils/csurf';
import { trackDownloadProgress, sendRequestWithProgress } from './utils/progress';
import { buildURL } from './utils/url';
import { all, spread } from './utils/concurrent';
import { defaults, ValpreAPIConfig } from './config';

export class ValpreAPI {
  defaults: ValpreAPIConfig;
  interceptors: {
    request: InterceptorManager<ValpreAPIConfig>;
    response: InterceptorManager<Response>;
  };

  constructor(config: ValpreAPIConfig = {}) {
    this.defaults = { ...defaults, ...config };
    this.interceptors = {
      request: new InterceptorManager<ValpreAPIConfig>(),
      response: new InterceptorManager<Response>(),
    };
  }

  async request(config: ValpreAPIConfig): Promise<Response> {
    // Merge defaults with the incoming config
    config = await this.interceptors.request.run({ ...this.defaults, ...config });

    if (config.cancelToken) {
      config.signal = config.cancelToken.signal;
    }

    applyCSRFToken(config);

    // Build URL with query params
    config.url = buildURL(config.url!, config.params);

    let response: Response;

    if (typeof window === 'undefined') {
      // Node.js environment
      response = await this.httpAdapter(config);
    } else {
      // Browser environment
      if (config.onUploadProgress) {
        response = await sendRequestWithProgress(config);
      } else {
        response = await fetch(config.url!, config);

        // Handle download progress
        if (config.onDownloadProgress) {
          response = trackDownloadProgress(response, config.onDownloadProgress);
        }
      }
    }

    // Handle HTTP status errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    response = await transformData(response, config);

    // Run response interceptors
    response = await this.interceptors.response.run(response);

    return response;
  }

  private async httpAdapter(config: ValpreAPIConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(config.url!);
      const isHttps = parsedUrl.protocol === 'https:';
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: config.method,
        headers: config.headers,
        agent: config.agent,
      };

      const requestModule = isHttps ? https : http;
      const req = requestModule.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          const response = new Response(body, {
            status: res.statusCode || 0,
            statusText: res.statusMessage || '',
            headers: new Headers(res.headers as Record<string, string>),
          });
          resolve(response);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      if (config.body) {
        req.write(config.body);
      }

      req.end();
    });
  }

  get(url: string, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'GET', url });
  }

  post(url: string, data: any, config: ValpreAPIConfig = {}): Promise<Response> {
    return this.request({ ...config, method: 'POST', url, body: JSON.stringify(data) });
  }

  // Other HTTP methods (put, delete, etc.) can be added here in a similar manner

  static CancelToken = CancelToken;

  static create(instanceConfig: ValpreAPIConfig): ValpreAPI {
    return new ValpreAPI(instanceConfig);
  }

  static all = all;
  static spread = spread;
}

export default ValpreAPI;
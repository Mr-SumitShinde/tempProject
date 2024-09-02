export class ValpreAPIError extends Error {
    public config: any;
    public request?: any;
    public response?: Response;

    constructor(message: string, config: any, request?: any, response?: Response) {
        super(message);
        this.config = config;
        this.request = request;
        this.response = response;
    }
}

export function createError(message: string, config: any, request?: any, response?: Response) {
    return new ValpreAPIError(message, config, request, response);
}
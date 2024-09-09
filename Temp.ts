import { ValpreAPIServicesConfig } from './config';
import { ValpreAPIServices } from './valpre-api-services';

// Define a limited class that only exposes selected features
export class ValpreAPIServicesLimited {
    private api: ValpreAPIServices;

    constructor(config: ValpreAPIServicesConfig) {
        this.api = new ValpreAPIServices(config);
    }

    // Expose only the allowed HTTP methods
    get(url: string, config?: ValpreAPIServicesConfig) {
        return this.api.get(url, config);
    }

    post(url: string, data: any, config?: ValpreAPIServicesConfig) {
        return this.api.post(url, data, config);
    }

    put(url: string, data: any, config?: ValpreAPIServicesConfig) {
        return this.api.put(url, data, config);
    }

    delete(url: string, config?: ValpreAPIServicesConfig) {
        return this.api.delete(url, config);
    }

    patch(url: string, data: any, config?: ValpreAPIServicesConfig) {
        return this.api.patch(url, data, config);
    }

    head(url: string, config?: ValpreAPIServicesConfig) {
        return this.api.head(url, config);
    }

    options(url: string, config?: ValpreAPIServicesConfig) {
        return this.api.options(url, config);
    }

    // Request method for direct control
    request(config: ValpreAPIServicesConfig) {
        return this.api.request(config);
    }

    // Prevent access to other internal methods
    // For example, don't expose instance methods, utility methods, etc.
}
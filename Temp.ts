import { addRetryCapability } from './utils/retry';
import { ValpreAPIConfig } from './config';

export class ValpreAPI {
    // Other methods and properties...

    async request(config: ValpreAPIConfig): Promise<Response> {
        const requestFn = () => this.adapter(config);
        return addRetryCapability(config, requestFn);
    }

    // Other methods and properties...
}
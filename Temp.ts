import { ValpreAPIServicesConfig } from './config';
import * as UtilityMethods from './utilityMethods';
import { CancelToken } from './cancelToken';
import { ValpreAPIServicesError } from './utils/errorHandling';

export class ValpreAPIServices {

    // ... existing code ...

    // Utility methods

    static setDefaults(newDefaults: Partial<ValpreAPIServicesConfig>): void {
        UtilityMethods.setGlobalDefaults(newDefaults);
    }

    static create(instanceConfig: ValpreAPIServicesConfig): ValpreAPIServices {
        return UtilityMethods.createInstance(instanceConfig);
    }

    static CancelToken = CancelToken;

    static isValpreAPIServicesError(error: any): error is ValpreAPIServicesError {
        return UtilityMethods.isValpreAPIServicesError(error);
    }

    static all(promises: Array<Promise<any>>): Promise<any[]> {
        return UtilityMethods.all(promises);
    }

    static spread(callback: Function): (arr: any[]) => any {
        return UtilityMethods.spread(callback);
    }
}
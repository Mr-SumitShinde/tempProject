type FulfilledFn<T> = (value: T) => T | Promise<T>;
type RejectedFn = (error: any) => any;

interface Interceptor<T> {
    fulfilled: FulfilledFn<T>;
    rejected?: RejectedFn;
    priority: number;
}

export class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null> = [];

    use(fulfilled: FulfilledFn<T>, rejected?: RejectedFn, priority: number = 0): number {
        const interceptor: Interceptor<T> = { fulfilled, rejected, priority };
        this.interceptors.push(interceptor);
        this.sortInterceptors();
        return this.interceptors.length - 1;
    }

    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
        this.cleanupInterceptors();
    }

    private sortInterceptors(): void {
        this.interceptors.sort((a, b) => {
            if (a === null) return 1;
            if (b === null) return -1;
            return b.priority - a.priority;
        });
    }

    private cleanupInterceptors(): void {
        this.interceptors = this.interceptors.filter(interceptor => interceptor !== null);
    }

    async run(value: T): Promise<T> {
        for (const interceptor of this.interceptors) {
            if (interceptor !== null) {
                try {
                    value = await interceptor.fulfilled(value);
                } catch (error) {
                    if (interceptor.rejected) {
                        value = await interceptor.rejected(error);
                    } else {
                        throw error;
                    }
                }
            }
        }
        return value;
    }
}
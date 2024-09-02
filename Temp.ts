export type FulfilledFn<V> = (value: V) => V | Promise<V>;
export type RejectedFn = (error: any) => any;

export class InterceptorManager<V> {
  private handlers: Array<{ fulfilled: FulfilledFn<V>; rejected?: RejectedFn }> = [];

  // Adds an interceptor to the stack
  use(fulfilled: FulfilledFn<V>, rejected?: RejectedFn): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  // Removes an interceptor by id
  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null as any;
    }
  }

  // Iterates through each handler synchronously
  forEach(fn: (handler: { fulfilled: FulfilledFn<V>; rejected?: RejectedFn }) => void): void {
    this.handlers.forEach(handler => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }

  // Processes all interceptors synchronously or asynchronously
  async run(config: V): Promise<V> {
    let modifiedConfig = config;

    for (const handler of this.handlers) {
      if (handler.fulfilled) {
        try {
          // Ensure that if the fulfilled function returns a promise, it gets awaited
          modifiedConfig = await handler.fulfilled(modifiedConfig);
        } catch (error) {
          // If a rejection handler exists, use it, otherwise rethrow the error
          if (handler.rejected) {
            handler.rejected(error);
          } else {
            throw error;
          }
        }
      }
    }

    return modifiedConfig;
  }
}
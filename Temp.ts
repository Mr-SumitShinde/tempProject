//Hi
// GenericService.ts
import { IService } from './IService';

export class GenericService<T> implements IService<T> {
    private controller: AbortController | null = null;

    async fetchWithCallbacks(url: string, options: RequestInit, callback: (data: any) => void, errorCallback: (error: any) => void): Promise<void> {
        this.controller = new AbortController();
        const signal = this.controller.signal;

        try {
            const response = await fetch(url, { ...options, signal });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            callback(data);
        } catch (error) {
            if (error.name !== 'AbortError') {
                errorCallback(error);
            }
        }
    }

    getAll(callback: (data: T[]) => void, errorCallback: (error: any) => void): void {
        this.fetchWithCallbacks('/api/items', { method: 'GET' }, callback, errorCallback);
    }

    getById(id: string, callback: (data: T) => void, errorCallback: (error: any) => void): void {
        this.fetchWithCallbacks(`/api/items/${id}`, { method: 'GET' }, callback, errorCallback);
    }

    create(item: T, callback: (data: T) => void, errorCallback: (error: any) => void): void {
        this.fetchWithCallbacks('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        }, callback, errorCallback);
    }

    update(id: string, item: T, callback: (data: T) => void, errorCallback: (error: any) => void): void {
        this.fetchWithCallbacks(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        }, callback, errorCallback);
    }

    delete(id: string, callback: () => void, errorCallback: (error: any) => void): void {
        this.fetchWithCallbacks(`/api/items/${id}`, { method: 'DELETE' }, callback, errorCallback);
    }

    interrupt(): void {
        if (this.controller) {
            this.controller.abort();
        }
    }
}
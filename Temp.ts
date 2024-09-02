export function trackUploadProgress(xhr: XMLHttpRequest, onUploadProgress: (progressEvent: ProgressEvent) => void): void {
    if (xhr.upload && onUploadProgress) {
        xhr.upload.onprogress = onUploadProgress;
    }
}

export function trackDownloadProgress(xhr: XMLHttpRequest, onDownloadProgress: (progressEvent: ProgressEvent) => void): void {
    if (xhr && onDownloadProgress) {
        xhr.onprogress = onDownloadProgress;
    }
}

export function sendRequestWithProgress(config: RequestInit & { onUploadProgress?: (progressEvent: ProgressEvent) => void, onDownloadProgress?: (progressEvent: ProgressEvent) => void }): Promise<Response> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(config.method || 'GET', config.url!, true);

        // Set request headers
        if (config.headers) {
            Object.keys(config.headers).forEach((key) => {
                xhr.setRequestHeader(key, config.headers[key]);
            });
        }

        // Handle upload progress
        trackUploadProgress(xhr, config.onUploadProgress!);

        // Handle download progress
        trackDownloadProgress(xhr, config.onDownloadProgress!);

        xhr.onload = function () {
            const responseHeaders = xhr.getAllResponseHeaders();
            const responseData = 'response' in xhr ? xhr.response : xhr.responseText;
            const response = new Response(responseData, {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(responseHeaders),
            });
            resolve(response);
        };

        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        };

        xhr.ontimeout = function () {
            reject(new TypeError('Network request timed out'));
        };

        xhr.onabort = function () {
            reject(new TypeError('Network request was aborted'));
        };

        if (config.body) {
            xhr.send(config.body);
        } else {
            xhr.send();
        }
    });
}

function parseHeaders(headers: string): Headers {
    const parsed = new Headers();
    if (!headers) {
        return parsed;
    }
    headers.split('\r\n').forEach(function (line) {
        const parts = line.split(': ');
        const key = parts.shift();
        const value = parts.join(': ');
        if (key) {
            parsed.append(key, value);
        }
    });
    return parsed;
}
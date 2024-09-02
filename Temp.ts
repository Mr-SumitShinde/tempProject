import { ValpreAPIConfig } from '../config';

export function applyCSRFToken(config: ValpreAPIConfig): void {
    if (config.withCredentials && config.xsrfCookieName) {
        const xsrfToken = getCookie(config.xsrfCookieName);
        if (xsrfToken && config.headers) {
            config.headers[config.xsrfHeaderName!] = xsrfToken;
        }
    }
}

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
}
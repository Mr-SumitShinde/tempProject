export const defaults: ValpreAPIConfig = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    method: 'GET',
    timeout: 0, // Default no timeout
    withCredentials: false,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
};

export function setDefaults(newDefaults: Partial<ValpreAPIConfig>): void {
    Object.assign(defaults, newDefaults);
}
export function handleRequestData(
    data: any, 
    headers: Record<string, string>,
    transformRequest?: (data: any, headers: Record<string, string>) => any
): string | undefined {
    if (transformRequest) {
        return transformRequest(data, headers);
    }
    if (typeof data === 'object' && data !== null) {
        return JSON.stringify(data);
    }
    return data;
}

export async function handleResponseData(
    response: Response, 
    responseType?: string,
    transformResponse?: (data: any) => any
): Promise<any> {
    const contentType = response.headers.get('Content-Type') || '';
    let data: any;

    try {
        if (responseType === 'json' || contentType.includes('application/json')) {
            data = await response.json();
        } else if (responseType === 'text') {
            data = await response.text();
        } else if (responseType === 'blob') {
            data = await response.blob();
        } else if (responseType === 'arrayBuffer') {
            data = await response.arrayBuffer();
        } else {
            data = response;
        }
    } catch (error) {
        throw new Error(`Failed to parse response as ${responseType || contentType}: ${error.message}`);
    }

    if (transformResponse) {
        return transformResponse(data);
    }

    return data;
}
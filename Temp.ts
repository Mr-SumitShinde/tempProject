import { ValpreAPIServicesLimited } from './valpre-api-services-limited';
import { ValpreAPIServices } from './valpre-api-services';

// Mock ValpreAPIServices
jest.mock('./valpre-api-services', () => {
    return {
        ValpreAPIServices: jest.fn().mockImplementation(() => ({
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            patch: jest.fn(),
            head: jest.fn(),
            options: jest.fn(),
            request: jest.fn(),
        }))
    };
});

// Mocking the Response object with the json() method
const mockResponse = (data: any) => {
    return {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(data)
    };
};

describe('ValpreAPIServicesLimited', () => {
    let api: ValpreAPIServicesLimited;
    let config = { baseURL: 'https://example.com' };

    beforeEach(() => {
        api = new ValpreAPIServicesLimited(config);
    });

    it('should call the get method with the correct arguments', async () => {
        const url = '/endpoint';
        const mockGet = ValpreAPIServices.prototype.get as jest.Mock;
        mockGet.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.get(url);
        const data = await response.json(); // Retrieve the mocked JSON data
        expect(mockGet).toHaveBeenCalledWith(url, undefined);
        expect(data.data).toBe('mockData');
    });

    it('should call the post method with the correct arguments', async () => {
        const url = '/endpoint';
        const data = { key: 'value' };
        const mockPost = ValpreAPIServices.prototype.post as jest.Mock;
        mockPost.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.post(url, data);
        const responseData = await response.json();
        expect(mockPost).toHaveBeenCalledWith(url, data, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the put method with the correct arguments', async () => {
        const url = '/endpoint';
        const data = { key: 'value' };
        const mockPut = ValpreAPIServices.prototype.put as jest.Mock;
        mockPut.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.put(url, data);
        const responseData = await response.json();
        expect(mockPut).toHaveBeenCalledWith(url, data, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the delete method with the correct arguments', async () => {
        const url = '/endpoint';
        const mockDelete = ValpreAPIServices.prototype.delete as jest.Mock;
        mockDelete.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.delete(url);
        const responseData = await response.json();
        expect(mockDelete).toHaveBeenCalledWith(url, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the patch method with the correct arguments', async () => {
        const url = '/endpoint';
        const data = { key: 'value' };
        const mockPatch = ValpreAPIServices.prototype.patch as jest.Mock;
        mockPatch.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.patch(url, data);
        const responseData = await response.json();
        expect(mockPatch).toHaveBeenCalledWith(url, data, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the head method with the correct arguments', async () => {
        const url = '/endpoint';
        const mockHead = ValpreAPIServices.prototype.head as jest.Mock;
        mockHead.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.head(url);
        const responseData = await response.json();
        expect(mockHead).toHaveBeenCalledWith(url, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the options method with the correct arguments', async () => {
        const url = '/endpoint';
        const mockOptions = ValpreAPIServices.prototype.options as jest.Mock;
        mockOptions.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.options(url);
        const responseData = await response.json();
        expect(mockOptions).toHaveBeenCalledWith(url, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the request method with the correct config', async () => {
        const config = { method: 'GET', url: '/endpoint' };
        const mockRequest = ValpreAPIServices.prototype.request as jest.Mock;
        mockRequest.mockResolvedValue(mockResponse({ data: 'mockData' }));

        const response = await api.request(config);
        const responseData = await response.json();
        expect(mockRequest).toHaveBeenCalledWith(config);
        expect(responseData.data).toBe('mockData');
    });
});
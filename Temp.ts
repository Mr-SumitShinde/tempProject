import { ValpreAPIServicesLimited } from './valpre-api-services-limited';
import { ValpreAPIServices } from './valpre-api-services';

// Mock ValpreAPIServices class
jest.mock('./valpre-api-services');

describe('ValpreAPIServicesLimited', () => {
    let api: ValpreAPIServicesLimited;
    let mockGet: jest.SpyInstance;
    let mockPost: jest.SpyInstance;
    let mockPut: jest.SpyInstance;
    let mockDelete: jest.SpyInstance;
    let mockPatch: jest.SpyInstance;
    let mockHead: jest.SpyInstance;
    let mockOptions: jest.SpyInstance;
    let mockRequest: jest.SpyInstance;

    beforeEach(() => {
        api = new ValpreAPIServicesLimited({ baseURL: 'https://example.com' });

        mockGet = jest.spyOn(ValpreAPIServices.prototype, 'get').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockPost = jest.spyOn(ValpreAPIServices.prototype, 'post').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockPut = jest.spyOn(ValpreAPIServices.prototype, 'put').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockDelete = jest.spyOn(ValpreAPIServices.prototype, 'delete').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockPatch = jest.spyOn(ValpreAPIServices.prototype, 'patch').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockHead = jest.spyOn(ValpreAPIServices.prototype, 'head').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockOptions = jest.spyOn(ValpreAPIServices.prototype, 'options').mockResolvedValue(mockResponse({ data: 'mockData' }));
        mockRequest = jest.spyOn(ValpreAPIServices.prototype, 'request').mockResolvedValue(mockResponse({ data: 'mockData' }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Helper function to mock a Response object
    const mockResponse = (data: any, status = 200): Response => {
        const jsonString = JSON.stringify(data);
        return new Response(jsonString, {
            status,
            headers: { 'Content-type': 'application/json' }
        });
    };

    it('should call the get method with the correct arguments', async () => {
        const url = '/endpoint';
        const response = await api.get(url);
        const data = await response.json();
        expect(mockGet).toHaveBeenCalledWith(url, undefined);
        expect(data.data).toBe('mockData');
    });

    it('should call the post method with the correct arguments', async () => {
        const url = '/endpoint';
        const data = { key: 'value' };
        const response = await api.post(url, data);
        const responseData = await response.json();
        expect(mockPost).toHaveBeenCalledWith(url, data, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the put method with the correct arguments', async () => {
        const url = '/endpoint';
        const data = { key: 'value' };
        const response = await api.put(url, data);
        const responseData = await response.json();
        expect(mockPut).toHaveBeenCalledWith(url, data, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the delete method with the correct arguments', async () => {
        const url = '/endpoint';
        const response = await api.delete(url);
        const responseData = await response.json();
        expect(mockDelete).toHaveBeenCalledWith(url, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the patch method with the correct arguments', async () => {
        const url = '/endpoint';
        const data = { key: 'value' };
        const response = await api.patch(url, data);
        const responseData = await response.json();
        expect(mockPatch).toHaveBeenCalledWith(url, data, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the head method with the correct arguments', async () => {
        const url = '/endpoint';
        const response = await api.head(url);
        const responseData = await response.json();
        expect(mockHead).toHaveBeenCalledWith(url, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the options method with the correct arguments', async () => {
        const url = '/endpoint';
        const response = await api.options(url);
        const responseData = await response.json();
        expect(mockOptions).toHaveBeenCalledWith(url, undefined);
        expect(responseData.data).toBe('mockData');
    });

    it('should call the request method with the correct config', async () => {
        const config = { method: 'GET', url: '/endpoint' };
        const response = await api.request(config);
        const responseData = await response.json();
        expect(mockRequest).toHaveBeenCalledWith(config);
        expect(responseData.data).toBe('mockData');
    });
});
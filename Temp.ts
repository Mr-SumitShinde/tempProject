import { ValpreAPIServicesConfig } from '../src/config';
import { ValpreAPIServicesError } from '../src/utils/errorHandling';
import * as UtilityMethods from '../src/utilityMethods';
import { ValpreAPIServices } from '../src/valpre-api-services';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockConfig: ValpreAPIServicesConfig = {
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
};

describe('UtilityMethods', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should set global defaults correctly', () => {
    const newDefaults = { baseURL: 'https://new-api.com' };
    UtilityMethods.setGlobalDefaults(newDefaults);
    expect(mockConfig.baseURL).toBe(newDefaults.baseURL);
  });

  it('should create a new ValpreAPIServices instance with provided config', () => {
    const instance = UtilityMethods.createInstance(mockConfig);
    expect(instance).toBeInstanceOf(ValpreAPIServices);
    expect(instance.defaults.baseURL).toBe(mockConfig.baseURL);
  });

  it('should return true if the error is an instance of ValpreAPIServicesError', () => {
    const error = new ValpreAPIServicesError('Test Error');
    expect(UtilityMethods.isValpreAPIServicesError(error)).toBe(true);
  });

  it('should return false if the error is not an instance of ValpreAPIServicesError', () => {
    const error = new Error('Generic Error');
    expect(UtilityMethods.isValpreAPIServicesError(error)).toBe(false);
  });

  it('should resolve all promises', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'Response 1' }));
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'Response 2' }));

    const promise1 = fetch(`${mockConfig.baseURL}/todos/1`);
    const promise2 = fetch(`${mockConfig.baseURL}/todos/2`);

    const results = await UtilityMethods.all([promise1, promise2]);
    const jsonResults = await Promise.all(results.map(res => res.json()));

    expect(jsonResults).toEqual([{ data: 'Response 1' }, { data: 'Response 2' }]);
  });

  it('should reject if any promise fails', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: 'Response 1' }));
    fetchMock.mockRejectOnce(new Error('Error in API'));

    const promise1 = fetch(`${mockConfig.baseURL}/todos/1`);
    const promise2 = fetch(`${mockConfig.baseURL}/todos/invalid`);

    try {
      await UtilityMethods.all([promise1, promise2]);
    } catch (error) {
      expect(error.message).toBe('Error in API');
    }
  });

  it('should spread results correctly into the callback', () => {
    const mockCallback = jest.fn();
    const wrapped = UtilityMethods.spread(mockCallback);

    wrapped([1, 2, 3]);

    expect(mockCallback).toHaveBeenCalledWith(1, 2, 3);
  });
});
import { valpreAPIGet } from 'valpre-api-services';

jest.mock('valpre-api-services', () => ({
  valpreAPIGet: jest.fn(() => Promise.reject(new Error('new error'))),
}));


import * as ValpreAPI from 'valpre-api-services';

jest.spyOn(ValpreAPI, 'valpreAPIGet').mockImplementation(() => Promise.reject(new Error('new error')));
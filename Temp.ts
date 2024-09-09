import { applyCSRFToken } from '../src/utils/csurf';
import { ValpreAPIServicesConfig } from '../src/config';

describe('applyCSRFToken', () => {
  let getCookieSpy: jest.SpyInstance;

  beforeEach(() => {
    getCookieSpy = jest.spyOn(document, 'cookie', 'get').mockReturnValue('csrftoken=mockedToken');
  });

  afterEach(() => {
    getCookieSpy.mockRestore();
  });

  it('should apply XSRF token to headers when withCredentials is true and xsrfCookieName is set', () => {
    const config: ValpreAPIServicesConfig = {
      withCredentials: true,
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRF-Token',
      headers: {},
    };

    applyCSRFToken(config);

    expect(config.headers!['X-CSRF-Token']).toBe('mockedToken');
  });

  it('should not apply XSRF token if withCredentials is false', () => {
    const config: ValpreAPIServicesConfig = {
      withCredentials: false,
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRF-Token',
      headers: {},
    };

    applyCSRFToken(config);

    expect(config.headers!['X-CSRF-Token']).toBeUndefined();
  });

  it('should not apply XSRF token if cookie does not exist', () => {
    getCookieSpy.mockReturnValue('');

    const config: ValpreAPIServicesConfig = {
      withCredentials: true,
      xsrfCookieName: 'nonexistentCookie',
      xsrfHeaderName: 'X-CSRF-Token',
      headers: {},
    };

    applyCSRFToken(config);

    expect(config.headers!['X-CSRF-Token']).toBeUndefined();
  });

  it('should not apply XSRF token if xsrfHeaderName is not set', () => {
    const config: ValpreAPIServicesConfig = {
      withCredentials: true,
      xsrfCookieName: 'csrftoken',
      headers: {},
    };

    applyCSRFToken(config);

    expect(config.headers!['X-CSRF-Token']).toBeUndefined();
  });
});
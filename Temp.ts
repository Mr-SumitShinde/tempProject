import { applyCSRFToken } from '../src/utils/csurf';
import { ValpreAPIServicesConfig } from '../src/config';

describe('applyCSRFToken', () => {
  let originalCookie: string;

  beforeEach(() => {
    originalCookie = document.cookie;
    document.cookie = 'csrftoken=mockedToken';
  });

  afterEach(() => {
    document.cookie = originalCookie;
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
    document.cookie = ''; // Clear the mock cookie

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
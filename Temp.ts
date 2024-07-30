import GenericServiceProvider from './genericServiceProvider';

const systemLoader = (window as any).System;

/* Single SPA load function */

export const loadApp = (url: string, appName: string) => async () => {
  const manifestUrl = url + '/manifest.json';
  let mainJS;

  const getFilename = (data) => {
    const fileobj = data?.files?.scripts?.find((script: any) => script.fileName && script.fileName.indexOf('main') !== -1);
    return fileobj?.fileName;
  };

  const sessionBuildIntData = window.sessionStorage.getItem('manifestData');
  const data = sessionBuildIntData && JSON.parse(sessionBuildIntData)[appName];

  const serviceProvider = new GenericServiceProvider();

  if (data) {
    mainJS = `${url}/${getFilename(data)}`;
  } else {
    await serviceProvider.fetchService<any>(
      manifestUrl,
      { method: 'GET', headers: { 'Cache-Control': 'no-cache' } },
      {
        onSuccess: (data) => {
          const intData = sessionBuildIntData ? JSON.parse(sessionBuildIntData) : {};
          intData[appName] = data;
          intData[appName]['description'] = url;
          window.sessionStorage.setItem('manifestData', JSON.stringify(intData));
          mainJS = `${url}/${getFilename(data)}`;
        },
        onError: (err) => {
          console.error('Error in fetching data', err);
          mainJS = '';
        }
      }
    );
  }

  const app = await systemLoader?.import(mainJS);

  if (app?.useDefault) {
    return app.default;
  } else {
    return app;
  }
};

import GenericServiceProvider from './path-to-your-service-provider';

const systemLoader = (window as any).System;

/* Single SPA load function */

export const loadApp = (url: string, appName: string) => async () => {
  const manifestUrl = url + '/manifest.json';
  let mainJS: string | undefined;

  const getFilename = (data: any) => {
    const fileObj = data?.files?.scripts?.find((script: any) => script.fileName && script.fileName.indexOf('main') !== -1);
    return fileObj?.fileName;
  };

  const sessionBuildIntData = window.sessionStorage.getItem('manifestData');
  const data = sessionBuildIntData && JSON.parse(sessionBuildIntData)[appName];

  if (data) {
    mainJS = `${url}/${getFilename(data)}`;
  } else {
    const serviceProvider = new GenericServiceProvider();
    const options = { method: 'GET', headers: { 'Cache-Control': 'no-cache' } };

    mainJS = await new Promise<string | void>((resolve) => {
      serviceProvider.fetchService(
        manifestUrl,
        options,
        {
          onSuccess: (data: any) => {
            const intData = sessionBuildIntData ? JSON.parse(sessionBuildIntData) : {};
            intData[appName] = data;
            intData[appName]['description'] = url;
            window.sessionStorage.setItem('manifestData', JSON.stringify(intData));
            resolve(`${url}/${getFilename(data)}`);
          },
          onError: (error: any) => {
            console.error('Error in fetching data', error);
            resolve();
          }
        }
      );
    });
  }

  const app = await systemLoader?.import(mainJS);
  
  if (app?.useDefault) {
    return app.default;
  } else {
    return app;
  }
};
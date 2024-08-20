import { createAppLifecycles } from './your-react-app-package';

const appsList = [
  {
    id: 'app1',
    name: 'App 1',
    component: import('./App1'),
  },
  {
    id: 'app2',
    name: 'App 2',
    component: import('./App2'),
  },
];

let currentlyMountedApp = null;

const mountApp = async (appLifecycles) => {
  if (currentlyMountedApp === appLifecycles) {
    console.log("App is already mounted");
    return;
  }

  for (let app of appsList) {
    if (app.lifecycles && app.lifecycles !== appLifecycles) {
      try {
        await app.lifecycles.unmount({});
      } catch (error) {
        console.error(`Error unmounting ${app.name}:`, error);
      }
    }
  }

  try {
    await appLifecycles.mount({});
    currentlyMountedApp = appLifecycles;
  } catch (error) {
    console.error(`Error mounting app:`, error);
  }
};

const initializeAppLifecycles = async (app) => {
  if (!app.lifecycles) {
    const AppComponent = (await app.component).default;
    app.lifecycles = createAppLifecycles(AppComponent);
  }
};

const navbar = document.createElement('nav');
navbar.id = 'navbar';
navbar.style.display = 'flex';
navbar.style.justifyContent = 'space-around';
navbar.style.padding = '10px 20px';
navbar.style.backgroundColor = '#333';
navbar.style.color = '#fff';

const createMenuItem = (app) => {
  const menuItem = document.createElement('a');
  menuItem.href = '#';
  menuItem.id = app.id;
  menuItem.textContent = app.name;
  menuItem.style.color = '#fff';
  menuItem.style.textDecoration = 'none';
  menuItem.style.cursor = 'pointer';

  menuItem.addEventListener('click', async () => {
    await initializeAppLifecycles(app);
    await mountApp(app.lifecycles);
  });

  return menuItem;
};

appsList.forEach(app => {
  const menuItem = createMenuItem(app);
  navbar.appendChild(menuItem);
});

document.body.prepend(navbar);

(async () => {
  await initializeAppLifecycles(appsList[0]);
  await mountApp(appsList[0].lifecycles);
})();
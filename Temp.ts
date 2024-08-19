const express = require('express');
const path = require('path');
const cors = require('cors');

// Import the React package and your helper function
const { createReactLifecycles } = require('your-react-package-name');
const Main = require('your-react-package-name').default;

const server = express();
const port = 5000;

server.use(cors());

server.use("", function (req, res, next) {
    if ('POST' != req.method) {
        next();
    } else {
        req.method = 'GET';
        next();
    }
});

// Serve static assets if needed
server.use('', express.static(path.join(__dirname, '_mock')));

// Create React lifecycles for Single-SPA
const reactLifecycles = createReactLifecycles(Main);

// Middleware to handle the Single-SPA lifecycle methods
server.use('/pbwm/launcher', (req, res) => {
    server.set('view engine', 'ejs');
    const htmlContent = `
        <div id="layout-workarea"></div>
        <script type="module">
            import { bootstrap, mount, unmount } from 'your-react-package-name';

            bootstrap({}).then(() => {
                mount({});
            });

            window.addEventListener('unload', () => {
                unmount({});
            });
        </script>
    `;
    res.render('index', { content: htmlContent });
});

server.use('/pbwm/ui', (req, res) => {
    res.sendStatus(200);
});

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
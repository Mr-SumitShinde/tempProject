Certainly! Below is the documentation for the @barclays/valpre-cli:


---

@barclays/valpre-cli

The @barclays/valpre-cli is a command-line interface (CLI) tool designed to streamline the development and management of React-based projects within the Valpre framework. It simplifies project setup, configuration, and the integration of reusable components across microfrontend architectures.


---

Key Features

Easy project scaffolding for React applications.

Built-in templates tailored for enterprise-level microfrontend projects.

Support for TypeScript and React 18.

Seamless integration with Nx monorepo architecture.

Commands to generate reusable components, modules, and services.

Linting, formatting, and test setup included.

Customizable options for Vite, Webpack, and Jest configurations.



---

Installation

To install the CLI globally, use the following command:

npm install -g @barclays/valpre-cli

Alternatively, you can use npx without global installation:

npx @barclays/valpre-cli


---

Commands and Usage

1. Creating a New Application

Scaffold a new React application under the Valpre framework:

valpre-cli create <app-name>

Options:

--template: Specify a template (default, microfrontend, spa).

--typescript: Use TypeScript for the project.

--vite: Set up the project with Vite.


Example:

valpre-cli create my-app --template microfrontend --typescript --vite


---

2. Adding Components

Generate reusable components with default configurations:

valpre-cli generate component <component-name>

Options:

--path: Specify the directory to generate the component.

--scss: Add a SCSS file for the component.


Example:

valpre-cli generate component Button --path src/components --scss


---

3. Adding Modules

Generate modular features:

valpre-cli generate module <module-name>

Options:

--lazy: Create a lazy-loaded module.

--path: Specify the directory to generate the module.


Example:

valpre-cli generate module Dashboard --lazy --path src/modules


---

4. Adding Services

Generate services to handle business logic and API calls:

valpre-cli generate service <service-name>

Options:

--path: Specify the directory to generate the service.

--http: Include HTTP methods for the service.


Example:

valpre-cli generate service AuthService --http --path src/services


---

5. Running Build Commands

Execute a production build for your project:

valpre-cli build

Options:

--env: Specify the environment (dev, prod).

--analyze: Generate a bundle analysis report.


Example:

valpre-cli build --env prod --analyze


---

6. Linting and Formatting

Run linting and formatting checks:

valpre-cli lint
valpre-cli format


---

7. Testing

Run unit tests:

valpre-cli test

Options:

--watch: Run tests in watch mode.

--coverage: Generate a coverage report.


Example:

valpre-cli test --watch --coverage


---

Configuration

The CLI allows customization through a configuration file named valpre.config.json placed at the root of your project.

Sample valpre.config.json

{
  "framework": "react",
  "typescript": true,
  "builder": "vite",
  "linting": true,
  "testing": {
    "tool": "jest",
    "coverage": true
  }
}


---

Integration with Nx

The @barclays/valpre-cli supports Nx workspaces for monorepo projects. It ensures seamless integration of microfrontend applications and shared libraries.

To generate an app in an Nx workspace:

valpre-cli generate app <app-name>


---

FAQ

1. What templates are supported?

The CLI supports default, microfrontend, and spa templates for scaffolding applications.

2. Can I use other build tools?

Currently, the CLI provides support for Vite and Webpack configurations.

3. How do I update the CLI?

Run the following command to update the CLI:

npm update -g @barclays/valpre-cli


---

Contribution

We welcome contributions to improve the CLI. Please follow these steps to contribute:

1. Fork the repository.


2. Create a new branch for your feature.


3. Submit a pull request with detailed documentation.




---

License

The @barclays/valpre-cli is licensed under the MIT License.


---

Let me know if you'd like to include additional sections or tailor the documentation further!


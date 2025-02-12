Here's a comprehensive Show & Tell document covering all the requested topics. It is structured for presentations, internal discussions, and documentation purposes.


---

Show & Tell: Valpre Framework & Components

Author: [Your Name]
Date: [Today's Date]
Audience: UI Developers, Architects, Product Owners, and Stakeholders
Purpose: To provide an overview of Valpre’s ecosystem, including CLI, API services, UI components, UI utilities, and microfrontend development.


---

1. Introduction

The Valpre Framework is an in-house, end-to-end solution designed to accelerate frontend development at Barclays. It includes a CLI, API service, UI components, UI utilities, and microfrontend support to streamline enterprise web application development.

Key Highlights:

🔥 Developer Productivity: Automate setup and coding best practices.

⚡ Optimized UI & API Services: Reusable components & efficient data fetching.

🏗 Microfrontend Architecture: Modular, scalable, and independently deployable.



---

2. Dynamic Rendering

What is Dynamic Rendering?

Dynamic rendering in Valpre allows for conditionally rendering UI elements based on runtime data and user interactions. It is primarily used in:

🏆 Dynamic Forms: Generate UI based on JSON schema.

🔍 Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR).

📊 Real-time UI Updates: Based on API responses.


Implementation Example:

import { DynamicForm } from "@barclays/valpre-components";

const formSchema = [
  { type: "text", label: "Full Name", name: "fullName" },
  { type: "radio", label: "Gender", name: "gender", options: ["Male", "Female"] }
];

<DynamicForm schema={formSchema} />;


---

3. Valpre CLI

What is Valpre CLI?

Valpre CLI is a command-line interface tool that helps developers bootstrap and manage Valpre-based projects efficiently.

Key Features:

🚀 Project Initialization: npx create-valpre-app

📦 Component & Service Generators: valpre generate component Button

✅ Linting & Testing Commands: valpre lint, valpre test

📊 Microfrontend Registration: valpre register-mfe app-name


Usage Example:

npx create-valpre-app my-app --template=react
cd my-app
valpre generate component DataTable


---

4. Valpre API Service

Overview

Valpre API Service is a fetch-based service built to handle HTTP requests in Node.js and browser environments.

Key Features:

✅ Interceptor Support (for authentication, logging, and caching).

🌍 Unified API Client (common API fetch patterns).

🔄 Retry & Error Handling.

📡 Supports REST & GraphQL APIs.


Example:

import { valpreApi } from "@barclays/valpre-api-service";

const fetchData = async () => {
  const response = await valpreApi.get("/users");
  console.log(response.data);
};


---

5. Valpre UI Components

a) DataTable (CSR & SSR)

Valpre DataTable is a high-performance data grid component optimized for both Client-Side Rendering (CSR) and Server-Side Rendering (SSR).

Key Features:

🔄 CSR Mode: Handles sorting, filtering, and pagination on the client.

🌍 SSR Mode: Works with server-side APIs for large datasets.

🎨 Theming & Customization: Supports CSS Modules.


Example for CSR Mode:

import { ValpreDataTable } from "@barclays/valpre-components";

const data = [
  { name: "John Doe", age: 30 },
  { name: "Jane Doe", age: 28 }
];

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" }
];

<ValpreDataTable columns={columns} data={data} />;

Example for SSR Mode:

<ValpreDataTable
  fetchData={(params) => fetch(`/api/users?page=${params.page}`)}
  columns={columns}
/>


---

6. Valpre UI Utils

What is Valpre UI Utils?

A collection of helper functions that simplify UI logic, including:

🖼 Date Formatting

📏 Number Formatting

🔄 Debouncing & Throttling

🔍 Deep Merging Objects


Example:

import { formatDate } from "@barclays/valpre-utils";

console.log(formatDate("2024-02-12", "DD-MM-YYYY")); // Output: 12-02-2024


---

7. Developing Microfrontends with Valpre

Why Microfrontends?

Microfrontends enable independent development and deployment of UI applications. Valpre supports Single-SPA and Module Federation.

Steps to Create a Microfrontend in Valpre

1️⃣ Generate a Microfrontend

valpre generate mfe dashboard

2️⃣ Register in App Shell

registerApplication({
  name: "dashboard",
  app: () => import("@barclays/dashboard"),
  activeWhen: ["/dashboard"],
});

3️⃣ Consume the Microfrontend

<Microfrontend name="dashboard" />


---

8. CI/CD & Deployment

Automated Pipeline:

✅ Linting & Formatting (ESLint, Prettier)
✅ Unit Testing (Jest)
✅ Build & Package Release (Nx, Webpack, Semantic Release)
✅ Docker Deployment (for microfrontends)

Release Workflow

1️⃣ Commit Code
2️⃣ Run CI Pipeline (Lint, Test, Build, Release)
3️⃣ Publish Package to Internal Registry
4️⃣ Deploy to Cloud

Example GitHub Actions Workflow:

name: CI/CD Pipeline
on: push
jobs:
  build:
    steps:
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy


---

9. Roadmap & Future Enhancements

✅ Completed Features:

Valpre CLI for faster project setup.

Valpre API service with interceptors.

DataTable optimized for CSR & SSR.

UI Utils for common functions.


🚀 Upcoming Features:

GraphQL Support in Valpre API.

Dark Mode & Custom Themes for UI Components.

Valpre Design System for standardized UI.



---

10. Conclusion

The Valpre Framework provides an enterprise-ready, scalable frontend ecosystem for React applications. With automated tools, optimized components, and microfrontend support, developers can build, test, and deploy applications faster and more efficiently.


---

🔗 Useful Links

Git Repository: [Insert Link]

Documentation: [Insert Link]

Internal Slack Channel: [Insert Link]



---

Let me know if you want any modifications or additional sections.


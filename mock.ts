📌 Confluence Documentation Structure for Valpre Framework & Common Components

A well-structured Confluence space will help your team access clear, well-documented guidelines, version tracking, and usage instructions for the Valpre Framework. Below is a structured approach for organizing Valpre Framework & Common Components documentation in Confluence.


---

🗂️ Confluence Space Structure for Valpre Framework

📂 Valpre Framework (Main Space)
 ├── 📌 Overview
 │    ├─ Introduction
 │    ├─ Purpose & Objectives
 │    ├─ Architecture Overview
 │    ├─ Key Features & Benefits
 │
 ├── 🛠 Valpre CLI
 │    ├─ Installation & Setup
 │    ├─ CLI Commands & Usage
 │    ├─ Project Initialization (`npx create-valpre-app`)
 │    ├─ Microfrontend Registration (`valpre register-mfe`)
 │    ├─ Troubleshooting & FAQs
 │
 ├── 🔌 Valpre API Service
 │    ├─ Introduction & Purpose
 │    ├─ Setup & Configuration
 │    ├─ Fetching Data (`valpreApi.get`)
 │    ├─ Error Handling & Interceptors
 │    ├─ Authentication & Security
 │    ├─ Changelog & Updates
 │
 ├── 🎨 Valpre UI Components
 │    ├─ Overview of UI Components
 │    ├─ Component List & Versioning
 │    │   ├─ ValpreButton
 │    │   ├─ ValpreDataTable (CSR & SSR)
 │    │   ├─ ValpreModal
 │    │   ├─ ValpreForm
 │    │   ├─ ValpreToast, ValpreDropdown, etc.
 │    ├─ Theming & Customization
 │    ├─ Accessibility & Compliance
 │    ├─ Example Implementations
 │
 ├── 📦 Valpre UI Utils
 │    ├─ Overview of Utility Functions
 │    ├─ Formatting Helpers (Date, Number, Currency)
 │    ├─ Event Handlers (Debounce, Throttle)
 │    ├─ Deep Object Merging
 │    ├─ Usage Examples
 │
 ├── 🔄 Developing Microfrontends with Valpre
 │    ├─ What are Microfrontends?
 │    ├─ Setting Up a Microfrontend
 │    ├─ Registering with App Shell
 │    ├─ Best Practices
 │    ├─ Performance Optimization
 │
 ├── 🚀 CI/CD & Deployment
 │    ├─ Automated Testing & Linting
 │    ├─ Build Process (`Nx` Monorepo)
 │    ├─ Semantic Versioning & Changelog
 │    ├─ Deployment Strategies
 │
 ├── 📊 Changelog & Release Notes
 │    ├─ Component Version Tracking
 │    ├─ Major Feature Updates
 │    ├─ Deprecated Features
 │    ├─ Migration Guides
 │
 ├── ❓ FAQs & Troubleshooting
 │    ├─ Common Issues
 │    ├─ Debugging Guide
 │    ├─ Known Bugs & Fixes
 │
 ├── 📌 Best Practices & Guidelines
 │    ├─ Coding Standards & Conventions
 │    ├─ Performance Optimization Tips
 │    ├─ Accessibility Best Practices
 │    ├─ API Security & Compliance


---

📌 What to Document in Each Section?

1️⃣ Overview (Homepage)

📌 Introduction to Valpre Framework

🎯 Purpose & Objectives

📊 Key Features & Benefits

📂 Quick Links to Each Section

🚀 Getting Started Guide



---

2️⃣ Valpre CLI

Installation Guide (npx create-valpre-app)

Commands Reference (valpre generate component Button)

Generating Microfrontends

Project Setup Best Practices

Troubleshooting CLI Errors



---

3️⃣ Valpre API Service

How to Use the API Service?

Request & Response Handling

Interceptor & Retry Logic

Security & Authentication

GraphQL/REST API Compatibility

Code Examples & Best Practices



---

4️⃣ Valpre UI Components

Component Catalog (Table format for tracking)

How to Use Each Component? (Examples, Props, Use Cases)

Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR)

Styling & Theming

Accessibility & Compliance

Version Tracking & Changelog


📌 Example for ValpreButton

### ValpreButton
**Description**: A customizable button component for all UI actions.

**Props**
| Prop | Type | Description |
|------|------|-------------|
| variant | 'primary' | 'secondary' | Button styles |
| size | 'small' | 'medium' | 'large' | Button size |
| onClick | function | Handles button click |

**Usage Example**
```tsx
<ValpreButton variant="primary" size="medium" onClick={() => alert("Clicked!")}>
  Click Me
</ValpreButton>

Version: 1.2.0
Last Updated: 2025-02-10

---

### **5️⃣ Valpre UI Utils**
- **Utility Function List**
- **Examples of Use Cases**
- **Best Practices for Using Utilities**

📌 Example for **formatDate Utility**

formatDate Utility

Description: Formats a given date into a readable format.

Usage

import { formatDate } from "@barclays/valpre-utils";

console.log(formatDate("2024-02-12", "DD-MM-YYYY")); // Output: 12-02-2024

Version: 1.0.2
Last Updated: 2025-01-22

---

### **6️⃣ Developing Microfrontends**
- **Why Microfrontends?**
- **Registering an MFE**
- **Integrating MFEs into App Shell**
- **Code Splitting & Lazy Loading**
- **Performance Considerations**

📌 Example:

To register a new microfrontend:

registerApplication({
  name: "dashboard",
  app: () => import("@barclays/dashboard"),
  activeWhen: ["/dashboard"],
});


---

7️⃣ CI/CD & Deployment

Linting & Testing (ESLint, Jest)

Versioning (semantic-release)

Build & Release Process

Deployment Pipelines (GitHub Actions/Jenkins)

Dockerized Deployment for Microfrontends


📌 Example for CI/CD Workflow

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

8️⃣ Changelog & Release Notes

Component Versioning Table

Major & Minor Updates

Deprecated Features

Migration Guides


📌 Example for Valpre Components Version Tracking | Component | Current Version | Last Updated | Status | |-----------|---------------|-------------|--------| | ValpreButton | 1.2.0 | 2025-02-10 | Stable | | ValpreDataTable | 2.1.0 | 2025-02-08 | Stable | | ValpreForm | 2.0.0 | 2025-02-12 | Stable |


---

Conclusion

By structuring Valpre’s Confluence documentation in this modular and categorized format, your team will have easy access to important information, standardized guidelines, and a single source of truth for updates.

Let me know if you want modifications to the structure or content breakdown! 🚀


📌 Overview of Valpre Framework & Common Components

🔍 What is Valpre?

The Valpre Framework is an enterprise-grade frontend framework designed to accelerate, standardize, and optimize UI development at Barclays. It provides modular UI components, an API service layer, CLI tools, utilities, and microfrontend support, ensuring a consistent, scalable, and efficient development experience across multiple banking platforms.


---

🎯 Purpose & Objectives

Why was Valpre Created?

Developing enterprise UI applications at scale requires consistency, performance, and maintainability. Valpre solves these challenges by providing: ✅ Pre-built UI components to standardize design and behavior.
✅ API service layer to manage fetch requests with error handling.
✅ CLI tool to automate project setup and improve productivity.
✅ Microfrontend support for scalable, independent deployments.
✅ Strict coding standards & best practices to ensure compliance with Barclays’ development policies.

Key Objectives

Enhance Developer Productivity: Reduce development effort with reusable components.

Improve Code Consistency: Standardized design, theming, and state management.

Optimize Performance: Support for SSR (Server-Side Rendering) & CSR (Client-Side Rendering).

Facilitate Microfrontends: Allow independent feature teams to build and deploy micro-apps.

Ensure Compliance: Accessibility (WCAG), Security, and Coding Standards.



---

🚀 Core Features & Components

1️⃣ Valpre CLI – Command Line Interface

A powerful CLI tool to automate project setup and generate components/services.

✅ Initialize a Valpre-based project:

npx create-valpre-app my-app

✅ Generate components/services dynamically:

valpre generate component Button

✅ Register microfrontends in the app shell:

valpre register-mfe dashboard


---

2️⃣ Valpre API Service – Unified API Fetch Layer

A fetch-based API service that provides a common data-fetching layer with:
✅ Interceptors for authentication & logging.
✅ Retry logic & error handling.
✅ Supports REST & GraphQL APIs.
✅ Works in both Node.js & Browser environments.

Example Usage:

import { valpreApi } from "@barclays/valpre-api-service";

const fetchData = async () => {
  const response = await valpreApi.get("/users");
  console.log(response.data);
};


---

3️⃣ Valpre UI Components – Pre-Built Reusable UI Components

A set of enterprise-ready, reusable UI components to maintain consistency across applications.

✅ CSR Mode (Client-Side Rendering) Example for DataTable:

<ValpreDataTable columns={columns} data={data} />

✅ SSR Mode (Server-Side Rendering) Example:

<ValpreDataTable fetchData={(params) => fetch(`/api/users?page=${params.page}`)} />


---

4️⃣ Valpre UI Utils – Utility Functions

A collection of helper functions to simplify UI development.
✅ Formatting Helpers (Dates, Numbers, Currency).
✅ Event Handlers (Debounce, Throttle).
✅ Object Manipulation (Deep Merge).

Example:

import { formatDate } from "@barclays/valpre-utils";
console.log(formatDate("2025-02-12", "DD-MM-YYYY")); // Output: 12-02-2025


---

5️⃣ Microfrontend Support – Scalable UI Development

Valpre enables modular & independent development using Microfrontend Architecture.

✅ Each microfrontend runs independently.
✅ Independent deployment & scaling.
✅ Seamless integration into App Shell.

Registering a Microfrontend in Valpre:

registerApplication({
  name: "dashboard",
  app: () => import("@barclays/dashboard"),
  activeWhen: ["/dashboard"],
});


---

📊 CI/CD & Deployment Strategy

Valpre ensures a smooth CI/CD workflow with: ✅ Automated Testing (Jest)
✅ Linting & Formatting (ESLint, Prettier)
✅ Versioning & Changelog (semantic-release)
✅ Dockerized Deployment for Microfrontends

CI/CD Pipeline Example (GitHub Actions)

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

📜 Versioning & Changelog Management

A version-tracking system ensures all Valpre components are up to date.

🔗 Changelog Link: View Full Release Notes


---

📌 Key Benefits of Using Valpre

✅ 🚀 Faster Development: Reusable components, CLI automation, and API abstraction.
✅ 🎨 Consistency: Standardized UI/UX across all Barclays applications.
✅ 📈 Scalability: Microfrontend support for independent feature development.
✅ ⚡ Performance: Optimized for both CSR & SSR, ensuring seamless user experience.
✅ 🛡 Security & Compliance: Built-in accessibility, security best practices, and compliance checks.


---

📝 Next Steps

1️⃣ Start using Valpre CLI to create a new project.
2️⃣ Explore Valpre API service and integrate it into your application.
3️⃣ Use Valpre UI Components to build feature-rich UIs.
4️⃣ Adopt Microfrontend Architecture for scalable development.
5️⃣ Follow CI/CD best practices to streamline deployments.

📌 For More Documentation & Guides: Confluence Link


---

🔗 Useful Links

📖 Valpre Framework Documentation: Link

📌 Git Repository: Link

🎨 Design System & UI Guidelines: Link

🛠 CLI Commands & Reference: Link



---

This overview provides a comprehensive introduction to Valpre, covering its purpose, architecture, features, and implementation details. Let me know if you need further refinements! 🚀




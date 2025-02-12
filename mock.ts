Sure! Here is the .md format of the Confluence page:

# UI Common Components - Documentation & Changelog

---

## 📌 Introduction
Welcome to the **UI Common Components Library**. This documentation provides details on how to use various UI components, including their API, props, and usage examples.

### 🛠 Installation
To install the component library, run:
```sh
npm install @barclays/ui-components

🚀 Usage Example

Import and use the components in your React app:

import { Button } from "@barclays/ui-components";

export default function App() {
  return <Button variant="primary">Click Me</Button>;
}


---

📖 Component API Documentation

This section provides details about each component.

🔹 Button Component

Props

Example Usage

<Button variant="primary" size="large" loading>
  Submit
</Button>


---

🔹 Modal Component

Props

Example Usage

<Modal open={true} onClose={() => console.log("Closed")}>
  Hello, World!
</Modal>


---

📜 Changelog

Below is a log of changes made to UI components.

🔄 Latest Version: 1.2.0 (2025-02-12)

📌 Previous Versions

<details>
  <summary>🔹 Version 1.1.0 (2025-01-10)</summary>
  - **Card**: Removed `shadow` prop (use `elevation` instead) ⚠️ **Breaking Change**  
  - **Tooltip**: Fixed accessibility issue  
</details><details>
  <summary>🔹 Version 1.0.0 (2024-12-01)</summary>
  - Initial release of UI components library
</details>
---

🔗 Quick Navigation

Component API

Changelog



---

📝 Notes

For older versions, refer to the GitHub Changelog: View Full Changelog

For any issues or feature requests, raise a Jira Ticket: Create Issue



---

💡 Best Practices

Follow Semantic Versioning (major.minor.patch)

Deprecate old props before removal

Ensure all UI changes are accessibility-compliant



---

✅ Conclusion

This page serves as the single source of truth for UI common components, including their documentation, usage, and changelog.
For any questions, reach out to the UI Components Team.


---

📌 How to Automate This?

If you want to automate the Changelog section, you can:

1. Use Jira Query Macro:

project = UI_COMPONENTS AND fixVersion in (latestReleasedVersion())


2. Embed GitHub Changelog:

- [View GitHub Changelog](https://github.com/barclays/ui-components/blob/main/CHANGELOG.md)


3. Use Expand Macros for Old Versions:

<details>
  <summary>Version 1.1.0</summary>
  - Fixed accessibility issues in Tooltip
</details>




---

💬 Need Customization?

Let me know if you want additional sections, macros, or automation ideas! 🚀

---

### **How to Use This?**
1. **Copy & paste this `.md` file** into your Confluence page.
2. **If Confluence supports Markdown**, it will render the formatting properly.
3. **If Confluence doesn't support Markdown**, paste the content into a **rich-text editor** and manually adjust headings, tables, and code blocks.

Would you like me to modify it further for specific requirements? 🚀


const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = 3001;

// Use cors middleware
app.use(cors());

// Dummy configuration
const formConfig = {
  "defaultValues": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "",
    "age": 30,
    "subscribe": false
  },
  "fields": [
    {
      "name": "firstName",
      "label": "First Name",
      "type": "text",
      "defaultValue": "John",
      "validation": {
        "required": "First Name is required",
        "maxLength": {
          "value": 30,
          "message": "First Name cannot exceed 30 characters"
        }
      }
    },
    {
      "name": "lastName",
      "label": "Last Name",
      "type": "text",
      "defaultValue": "Doe",
      "validation": {
        "required": "Last Name is required",
        "maxLength": {
          "value": 30,
          "message": "Last Name cannot exceed 30 characters"
        }
      }
    },
    {
      "name": "email",
      "label": "Email",
      "type": "email",
      "defaultValue": "",
      "validation": {
        "required": "Email is required",
        "pattern": {
          "value": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$",
          "message": "Invalid email address"
        }
      }
    },
    {
      "name": "age",
      "label": "Age",
      "type": "number",
      "defaultValue": 30,
      "validation": {
        "required": "Age is required",
        "min": {
          "value": 18,
          "message": "Age must be at least 18"
        },
        "max": {
          "value": 99,
          "message": "Age must be less than 100"
        }
      }
    },
    {
      "name": "subscribe",
      "label": "Subscribe to Newsletter",
      "type": "checkbox",
      "defaultValue": false
    }
  ]
};

// Route to get the form configuration
app.get('/form-config', (req, res) => {
  res.json(formConfig);
});

app.listen(port, () => {
  console.log(`Dummy server running at http://localhost:${port}`);
});
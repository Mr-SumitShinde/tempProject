Here’s a suggested documentation outline for the valpre-react-dynamic-form-element component:


---

Valpre React Dynamic Form Element

The valpre-react-dynamic-form-element is a dynamic form rendering component built to render forms based on JSON configuration. It supports various question types such as radio buttons, text inputs, and checklists, with conditional rendering based on user responses. This component is intended to simplify form creation in applications, making forms flexible and customizable without requiring hard-coded structures.

Installation

npm install @barclays/valpre-react-dynamic-form-element

Usage

The component requires a JSON configuration object as input, which defines the form structure, question types, and conditional logic.

import ValpreDynamicForm from '@barclays/valpre-react-dynamic-form-element';

const formConfig = {
  questions: [
    {
      id: 'q1',
      type: 'text',
      label: 'Enter your name',
    },
    {
      id: 'q2',
      type: 'radio',
      label: 'Select your age group',
      options: ['18-25', '26-35', '36-45'],
    },
    {
      id: 'q3',
      type: 'checkbox',
      label: 'Select your hobbies',
      options: ['Reading', 'Traveling', 'Gaming'],
      condition: { questionId: 'q2', value: '18-25' },
    },
  ],
};

const MyApp = () => <ValpreDynamicForm config={formConfig} />;

JSON Configuration

The JSON configuration for the component should follow a specific schema to define questions, options, and conditional logic.

JSON Schema

questions (array): List of question objects, where each object defines a single form element.


Question Properties

id (string): Unique identifier for the question.

type (string): Type of input (text, radio, checkbox, etc.).

label (string): Label to be displayed for the question.

options (array, optional): Options for selection-based questions like radio and checkbox.

condition (object, optional): Defines conditional rendering based on another question’s answer. Structure:

questionId (string): ID of the question this one depends on.

value (string or array): Expected value(s) from the referenced question to render this question.



Example Configuration

{
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "label": "Enter your name"
    },
    {
      "id": "q2",
      "type": "radio",
      "label": "Select your age group",
      "options": ["18-25", "26-35", "36-45"]
    },
    {
      "id": "q3",
      "type": "checkbox",
      "label": "Select your hobbies",
      "options": ["Reading", "Traveling", "Gaming"],
      "condition": { "questionId": "q2", "value": "18-25" }
    }
  ]
}

Conditional Rendering

The condition property allows conditional display based on answers to previous questions. The component will only render a question if the specified conditions are met.

Example

If q2 has a condition with questionId: 'q2' and value: '18-25', q3 will only be displayed if the user selects the option 18-25 for q2.

API

Props

config (object, required): JSON configuration for the form.

onSubmit (function, optional): Callback function triggered upon form submission. Returns the form data.

onChange (function, optional): Callback triggered on each field change, useful for live form validation.


Example Usage

<ValpreDynamicForm
  config={formConfig}
  onSubmit={(data) => console.log('Form Data:', data)}
  onChange={(updatedField) => console.log('Field Updated:', updatedField)}
/>

Validation

Basic validation can be handled within the JSON configuration if required. If further validation is needed, it can be added through the onSubmit or onChange callbacks.

Styling

The component supports modular CSS for styling each form element and can be customized to match the application's design requirements.


---

Let me know if you need additional details or sections for this documentation!


{
  "questions": [
    {
      "id": 1,
      "type": "radio",
      "label": "Do you have a car?",
      "options": ["Yes", "No"],
      "name": "hasCar"
    },
    {
      "id": 2,
      "type": "radio",
      "label": "Do you own a house?",
      "options": ["Yes", "No"],
      "name": "hasHouse"
    },
    {
      "id": 3,
      "type": "text",
      "label": "What is your car model?",
      "name": "carModel",
      "conditions": {
        "logic": "AND",
        "dependencies": [
          { "dependsOn": "hasCar", "value": "Yes" },
          { "dependsOn": "hasHouse", "value": "Yes" }
        ]
      }
    },
    {
      "id": 4,
      "type": "text",
      "label": "How many houses do you own?",
      "name": "numHouses",
      "conditions": {
        "logic": "OR",
        "dependencies": [
          { "dependsOn": "hasCar", "value": "No" },
          { "dependsOn": "hasHouse", "value": "Yes" }
        ]
      }
    }
  ]
}
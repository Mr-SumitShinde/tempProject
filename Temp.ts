[
  {
    "type": "radio",
    "name": "question1",
    "label": "Question 1",
    "options": ["Yes", "No"]
  },
  {
    "type": "radio",
    "name": "question2",
    "label": "Question 2",
    "options": ["A", "B"]
  },
  {
    "type": "checkbox",
    "name": "question3",
    "label": "Question 3",
    "options": ["Option1", "Option2"]
  },
  {
    "type": "input",
    "name": "question4",
    "label": "Question 4",
    "visibleIf": {
      "and": [
        {
          "key": "question1",
          "value": "Yes"
        },
        {
          "key": "question2",
          "value": "A"
        }
      ]
    }
  },
  {
    "type": "input",
    "name": "question5",
    "label": "Question 5",
    "visibleIf": {
      "or": [
        {
          "and": [
            {
              "key": "question1",
              "value": "Yes"
            },
            {
              "key": "question3",
              "value": "Option1"
            }
          ]
        },
        {
          "key": "question2",
          "value": "B"
        }
      ]
    }
  },
  {
    "type": "input",
    "name": "question6",
    "label": "Question 6",
    "visibleIf": {
      "and": [
        {
          "key": "question1",
          "value": "No"
        },
        {
          "or": [
            {
              "key": "question2",
              "value": "B"
            },
            {
              "key": "question3",
              "value": "Option2"
            }
          ]
        }
      ]
    }
  }
]
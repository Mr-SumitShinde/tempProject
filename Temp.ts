const checkConditions = (conditions, formState) => {
  if (!conditions) return true; // No conditions means always render

  const { logic, dependencies } = conditions;
  const results = dependencies.map(dep => formState[dep.dependsOn] === dep.value);

  if (logic === "AND") {
    return results.every(result => result); // All must be true
  } else if (logic === "OR") {
    return results.some(result => result); // At least one must be true
  }
  return false; // Default to not rendering if logic is undefined
};

const renderQuestion = (question) => {
  const shouldRender = checkConditions(question.conditions, formState);
  if (!shouldRender) return null;

  // Render question normally here (radio, text input, etc.)
};

return (
  <>
    {questions.map((question) => renderQuestion(question))}
  </>
);
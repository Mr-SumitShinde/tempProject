import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function MyComponent() {
  throw new Error('Test error'); // Simulated error
  return <div>My Component</div>;
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset application state if needed
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}

export default App;
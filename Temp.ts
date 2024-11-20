import React from 'react';

type LoaderProps = {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
};

const WithLoader: React.FC<LoaderProps> = ({ loading, error, children }) => {
  if (loading) {
    return <div>Loading...</div>; // Replace with your loading spinner component
  }

  if (error) {
    return <div>Error: {error}</div>; // Customize the error message
  }

  return <>{children}</>;
};

export default WithLoader;
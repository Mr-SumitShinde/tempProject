import { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://your-cdn-link.css'; // Replace with your CDN URL
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return <div>My React Component</div>;
};

export default MyComponent;
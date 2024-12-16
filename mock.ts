const App = () => {
  const [currentPage, setCurrentPage] = React.useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div>
      <button onClick={() => setCurrentPage('home')}>Home</button>
      <button onClick={() => setCurrentPage('about')}>About</button>
      {renderPage()}
    </div>
  );
};
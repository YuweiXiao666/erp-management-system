import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Procurement } from './pages/Procurement';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'procurement':
        return <Procurement />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;

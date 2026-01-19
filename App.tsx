import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

const App: React.FC = () => {
  const [inquiryData, setInquiryData] = useState<any>(null);

  const handlePlanPaymentComplete = (data: any) => {
    setInquiryData(data);
  };

  return (
    <Layout>
      <Home />
      <Services onPlanPaymentComplete={handlePlanPaymentComplete} />
      <About />
      <Contact prefillData={inquiryData} />
    </Layout>
  );
};

export default App;
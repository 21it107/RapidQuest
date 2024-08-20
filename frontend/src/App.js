import React from 'react';
import TotalSalesChart from './components/TotalSalesChart';
import NewCustomersChart from './components/NewCustomersChart';
import SalesGrowthRateChart from './components/SalesGrowthRateChart';
import RepeatCustomersChart from './components/RepeatCustomersChart';
import GeographicalDistributionChart from './components/GeographicalDistributionChart';
import LifetimeValueByCohortsChart from './components/LifetimeValueByCohortsChart';

function App() {
  return (
    <div className="App">
      <h1>E-Commerce Analytics Dashboard</h1>
      <TotalSalesChart />
      <NewCustomersChart />
      <SalesGrowthRateChart />
      <RepeatCustomersChart />
      <GeographicalDistributionChart />
      <LifetimeValueByCohortsChart />
    </div>
  );
}

export default App;
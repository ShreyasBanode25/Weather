import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Cards from './Components/Cards';
import Overview from './Components/Overview'; 
import Search from './Components/Search';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  const handleSearch = (data) => {
    setWeatherData(data);
  };

  return (
    <div className="App">
      <Navbar onSearch={handleSearch} />
      {weatherData && <Cards data={weatherData} />}
      <Search />
      <Overview /> {/* This will render the carousel */}
    </div>
  );
}

export default App;


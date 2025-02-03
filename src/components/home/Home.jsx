import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [searchText, setSearchText] = useState('');

  const onChange = (event) => {
    setSearchText(event.target.value);
  };

  const submit = () => {
    console.log('Search submitted:', searchText);
  };

  return (
    <div className='home'>
    <div className="mhome">
      <div className='container-box'>
        <div className="tag">
          <p className='tag-line'>Find Your Perfect Freelancer Services</p>
        </div>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              value={searchText}
              onChange={onChange}
              placeholder="search..."
              className="search-input"
            />
            <button onClick={submit} className="search-button">
              Let's go
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;
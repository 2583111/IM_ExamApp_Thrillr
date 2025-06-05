import React, { useState } from 'react';
import '../Styling/SearchBar.css';
import searchIcon from '../Images/search.svg'; 

export default function NavBar({ onSearchSubmit }) {
  const [searchInput, setSearchInput] = useState('');
  const [focused, setFocused] = useState(false);

  // When user presses “Enter” in the search box, invoke parent callback
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchInput.trim());
    }
  };

  return (
    <nav className="navbar">
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {!focused && (
          <img
            src={searchIcon}
            alt="Search"
            className="search-icon"
          />
        )}
      </div>
    </nav>
  );
}

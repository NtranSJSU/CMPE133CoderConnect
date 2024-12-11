import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './searchResults.scss';
import Posts from '../../components/posts/Posts';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
        setResults(response.data);
      } catch (error) {
        setError('Error fetching search results: ' + error.message);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <Posts posts={results} /> // Pass the posts to the Posts component
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
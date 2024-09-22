import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Assuming we are using a CSS file for styling

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSelectChange = (e) => {
    const { options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedOptions(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate JSON input
    try {
      const data = JSON.parse(jsonInput);  // Attempt to parse the JSON input

      // Check if 'data' is an array
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid input structure: data must be an array');
      }

      // Call the backend API
      const response = await axios.post('https://bfhl-backend-4bob.onrender.com/bfhl', data);
      setResponse(response.data);
    } catch (err) {
      setError('Invalid JSON input: ' + err.message);
      setResponse(null);
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;
    const selectedData = {};

    if (selectedOptions.includes('Alphabets')) {
      selectedData.alphabets = alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      selectedData.numbers = numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      selectedData.highest_alphabet = highest_alphabet;
    }

    return (
      <div className="response-box">
        <h3>Filtered Response:</h3>
        {Object.entries(selectedData).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>JSON Input Processor</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>API Input</label>
          <textarea
            value={jsonInput}
            onChange={handleChange}
            placeholder='{"data":["M","1","334","4","B"]}'
            required
            className="json-input"
          />
        </div>
        <button type='submit' className="submit-btn">Submit</button>
        {error && <p className="error">{error}</p>}
      </form>

      {response && (
        <div className="filter-section">
          <label>Multi Filter</label>
          <select multiple onChange={handleSelectChange} className="multi-select">
            <option value='Alphabets'>Alphabets</option>
            <option value='Numbers'>Numbers</option>
            <option value='Highest lowercase alphabet'>Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      {renderResponse()}
    </div>
  );
};

export default App;

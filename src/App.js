import React, { useState } from 'react';
import './App.css';
import Autocomplete from './components/Autocomplete/index';
import { Button } from './components/Button/index';

function App() {
  const [data, setData] = useState([]);
  const [values, setValues] = useState({
    city: '',
    country: '',
    activeSuggestion: 0,
    filteredSuggestions: data,
    showSuggestions: false,
  });
  const [userInput, setUserInput] = useState(null);

  const handleChange = (e) => {
    e.preventDefault();
    const filteredSuggestions = data.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setValues({
      [e.target.name]: e.target.value,
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
    });
  };
  const handleSubmit = (e, userInput) => {
    e.preventDefault();
    setUserInput(values);
    setValues({
      city: '',
      country: '',
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
    });
  };
  console.log(userInput);
  return (
    <div className="App">
      <form className="container" onSubmit={handleSubmit}>
        <Autocomplete
          name="city"
          label="Enter your city"
          value={values.city}
          onChange={(e) => handleChange(e)}
          placeholder="e.g Berlin"
          suggestion={data}
        />
        <Autocomplete
          name="country"
          label="Enter your country"
          value={values.country}
          onChange={(e) => handleChange(e)}
          placeholder="e.g Germany"
          suggestion={data}
        />
        <Button type="submit" className="confirm" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default App;

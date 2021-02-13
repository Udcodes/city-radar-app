import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Autocomplete from './components/Autocomplete/index';
import { Button } from './components/Button';

function App() {
  const autocompleteRef = useRef(null);
  const TOWN_SUGGESTION_URL = 'https://api.teleport.org/api/cities/';
  const TOWN_METRICS_URL = 'https://api.teleport.org/api/urban_areas/';
  const [data, setData] = useState([]);
  const [town, setTown] = useState({ firstTown: '', secondTown: '' });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState(null);
  const [values, setValues] = useState({
    city: '',
    country: '',
    // activeSuggestion: 0,
    filteredSuggestions: [],
    // showSuggestions: false,
  });
  const [userInput, setUserInput] = useState(null);
  console.log(town, 'town');

  const fetchTownSuggestions = async (searchPhrase) => {
    searchPhrase = town?.firstTown || town?.secondTown;
    await axios
      .get(`${TOWN_SUGGESTION_URL}?search=${searchPhrase}`)
      .then((res) => {
        const cityInfo = res.data?._embedded[
          'city:search-results'
        ][0]?.matching_alternate_names?.map((el) => el.name);
        setData(cityInfo);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data, 'hahahahaha');
    // const resData = data?._embedded?.el?.matching_alternate_names;
    const filtered = data?.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(searchPhrase.toLowerCase()) > -1
    );
    console.log(filteredSuggestions, 'filteredSuggestions');
    setShowSuggestions(true);
    setActiveSuggestion(0);
    setFilteredSuggestions(filtered);
    // setValues({
    //   [e.target.name]: e.target.value,
    //   // activeSuggestion: 0,
    //   filteredSuggestions,
    //   // showSuggestions: true,
    // });
  };

  const onItemSelected = (e) => {
    console.log(town, 'selected');
    setShowSuggestions(false);
    setTown({
      [e.target.name]: e.currentTarget.innerText,
    });
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    // setValues({
    //   // activeSuggestion: 0,
    //   filteredSuggestions: [],
    //   // showSuggestions: false,
    //   [e.target.name]: e.currentTarget.innerText,
    // });
  };
  const onKeyDown = (e) => {
    const { filteredSuggestions } = setFilteredSuggestions;

    if (e.keyCode === 13) {
      setShowSuggestions(false);
      setActiveSuggestion(0);
      setTown({
        [e.target.name]: filteredSuggestions[activeSuggestion],
      });
      // setValues({
      //   // activeSuggestion: 0,
      //   // showSuggestions: false,
      // });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };
  const handleSubmit = (e, userInput) => {
    setUserInput(values);
    setValues({
      city: '',
      country: '',
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
    });
    e.preventDefault();
  };
  console.log(userInput);

  const getCities = async (e) => {
    e.preventDefault();
    await axios
      .get(`${TOWN_SUGGESTION_URL}?search=${values?.city}`)
      .then((res) => {
        const cityInfo = res.data;
        setData({ cityInfo });
      })
      .catch((error) => {
        console.log(error);
      });
    // const apiCall = await fetch(`https://api.teleport.org/api/cities/?`);
  };
  const preLoadData = useCallback(async () => {
    const res = axios.get(`${TOWN_SUGGESTION_URL}`);
    const dataRequest = res.data;
    setData(dataRequest);
  }, []);
  console.log(data, 'dtat');
  //The data are loaded initially
  useEffect(() => {
    preLoadData();
  }, [preLoadData]);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    const { current: autoComponent } = autocompleteRef;
    if (autoComponent && !autoComponent.contains(e.target)) {
      setShowSuggestions(false);
    }
  };
  return (
    <div className="App">
      <form className="wrapper" onSubmit={getCities}>
        <h1 className="title-text">City Radar App</h1>
        <div ref={autocompleteRef}>
          <Autocomplete
            className="left"
            name="firstTown"
            label="Enter town 1"
            value={town?.firstTown}
            onChange={(e) => {
              e.preventDefault();
              setTown({ [e.target.name]: e.currentTarget.value });
              fetchTownSuggestions();
            }}
            placeholder="Enter town 1"
            suggestion={data}
            showSuggestions={showSuggestions}
            activeSuggestion={activeSuggestion}
            onItemSelected={() => onItemSelected}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="empty1" />
        <div ref={autocompleteRef}>
          <Autocomplete
            className="middle"
            name="secondTown"
            label="Enter town 2"
            value={town?.secondTown}
            onChange={(e) => {
              e.preventDefault();
              setTown({ [e.target.name]: e.currentTarget.value });
              fetchTownSuggestions();
            }}
            placeholder="Enter town 2"
            suggestion={data}
            showSuggestions={showSuggestions}
            activeSuggestion={activeSuggestion}
            onItemSelected={() => onItemSelected}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="empty2" />
        {/* <Button className="right" type="submit">
          Compare
        </Button> */}
        <Button type="submit" className="right" fullWidth bgColor="#FF7F50" textColor="black">
          submit
        </Button>
        <div className="content">
          3-Column: This is probably a bit more advanced: The container class is, well, .container,
          and the children are just .left, .right, and .middle. Not sure if it's relevant, but the
          width of .container is 100% of viewport. I should probably add that using Bootstrap is not
          possible, due to reasons out of my control.
        </div>
      </form>
    </div>
  );
}

export default App;

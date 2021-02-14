import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import createPlotlyComponent from 'react-plotly.js/factory';
import './App.css';
import Autocomplete from './components/Autocomplete/index';
import { Button } from './components/Button';
// import RadarChart from './components/RadarChart';

function App(props) {
  const Plotly = { data: 'mike' };
  // const Plot = createPlotlyComponent(Plotly);
  // console.log(Plot, 'PLOT');
  const autocompleteRef = useRef(null);
  const TOWN_SUGGESTION_URL = 'https://api.teleport.org/api/cities/';
  const TOWN_METRICS_URL = 'https://api.teleport.org/api/urban_areas/';
  // const BASE_URL = 'https://api.teleport.org/api/urban_areas/';

  const dataLimit = 10;

  const [cityMetrics, setCityMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [town, setTown] = useState({ firstTown: '', secondTown: '' });
  const [loadingFirstTown, setLoadingFirstTown] = useState(false);
  const [loadingSecondTown, setLoadingSecondTown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState(null);
  // const [values, setValues] = useState({
  //   city: '',
  //   country: '',
  //   // activeSuggestion: 0,
  //   filteredSuggestions: [],
  //   // showSuggestions: false,
  // });
  const [userInput, setUserInput] = useState(null);

  const fetchTownSuggestions = useCallback(
    async (searchPhrase) => {
      searchPhrase = town?.firstTown || town?.secondTown;
      await axios
        .get(`${TOWN_SUGGESTION_URL}?search=${searchPhrase}&limit=${dataLimit}`)
        .then((res) => {
          setLoadingFirstTown(false);
          setLoadingSecondTown(false);
          const cityInfo = res.data?._embedded[
            'city:search-results'
          ][0]?.matching_alternate_names?.map((el) => el.name);
          const filtered = cityInfo?.filter(
            (suggestion) => suggestion?.toLowerCase().indexOf(searchPhrase?.toLowerCase()) > -1
          );
          setShowSuggestions(true);
          setActiveSuggestion(0);
          setFilteredSuggestions(filtered);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [town?.firstTown, town?.secondTown]
  );

  const onTextChange = (e) => {};

  const onItemSelected = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    setTown({
      [e.target.name]: e.currentTarget.innerText,
    });
    setShowSuggestions(false);
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && filteredSuggestions) {
      setShowSuggestions(false);
      setActiveSuggestion(0);
      setTown({
        [e.target.name]: filteredSuggestions[activeSuggestion],
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions?.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  };
  const handleSubmit = (e, userInput) => {
    // setUserInput(values);
    // setValues({
    //   city: '',
    //   country: '',
    //   activeSuggestion: 0,
    //   filteredSuggestions: [],
    //   showSuggestions: false,
    // });
    e.preventDefault();
  };
  console.log(userInput);

  const getCities = useCallback(async (e, searchPhrase) => {
    e.preventDefault();
    await axios
      .get(`${TOWN_SUGGESTION_URL}?search=${values?.city}`)
      .then((res) => {
        const cityInfo = res.data;
        // setData({ cityInfo });
      })
      .catch((error) => {
        console.log(error);
      });
    // const apiCall = await fetch(`https://api.teleport.org/api/cities/?`);
  }, []);

  useEffect(() => {
    setLoading(true);
    const searchValue = town?.firstTown || town?.secondTown;
    const fetchData = async () => {
      await axios
        .get(`${TOWN_METRICS_URL}slug:${searchValue}/scores/`)
        .then((data) => {
          setCityMetrics(data);
          setLoading(false);
        })
        .catch((err) => console(err));
    };
    fetchData();
  }, [town]);
  console.log(cityMetrics, 'cityMetrics');
  // const preLoadData = useCallback(async () => {
  //   const res = axios.get(`${TOWN_SUGGESTION_URL}`);
  //   const dataRequest = res.data;
  //   setData(dataRequest);
  // }, []);
  // console.log(data, 'dtat');
  //The data are loaded initially
  // useEffect(() => {
  //   preLoadData();
  // }, [preLoadData]);

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
      <form className="wrapper" onSubmit={getCities} autocomplete="off">
        <h1 className="title-text">City Radar App</h1>
        <div ref={autocompleteRef}>
          <Autocomplete
            label="Enter town 1:"
            className="input1"
            name="firstTown"
            value={town?.firstTown || ''}
            onChange={(e) => {
              e.preventDefault();
              setLoadingFirstTown(true);
              setLoadingSecondTown(false);
              setTown({ [e.target.name]: e.currentTarget.value });
              fetchTownSuggestions();
            }}
            placeholder="e.g. Berlin"
            suggestion={filteredSuggestions}
            showSuggestions={showSuggestions}
            activeSuggestion={activeSuggestion}
            onItemSelected={(e) => onItemSelected(e)}
            onKeyDown={onKeyDown}
            loading={loadingFirstTown}
          />
        </div>
        <div className="space1" />

        <Button type="submit" className="btn1" fullWidth bgColor="#FF7F50" textColor="black">
          submit
        </Button>
        <div className="middle" />

        <div ref={autocompleteRef}>
          <Autocomplete
            label="Enter town 2:"
            className="input2"
            name="secondTown"
            value={town?.secondTown || ''}
            onChange={(e) => {
              e.preventDefault();
              setLoadingFirstTown(false);
              setLoadingSecondTown(true);
              setTown({ [e.target.name]: e.currentTarget.value });
              fetchTownSuggestions();
            }}
            placeholder="e.g. Dortmund"
            suggestion={filteredSuggestions}
            showSuggestions={showSuggestions}
            activeSuggestion={activeSuggestion}
            onItemSelected={(e) => onItemSelected(e)}
            onKeyDown={onKeyDown}
            loading={loadingSecondTown}
          />
        </div>
        <div className="space2" />

        <Button type="submit" className="btn2" fullWidth bgColor="#FF7F50" textColor="black">
          submit
        </Button>
        {/* <Button className="right" type="submit">
          Compare
        </Button> */}

        <div className="content">
          {/* <RadarChart data={cityMetrics} layout={layout} loading={loading} /> */}
        </div>
      </form>
    </div>
  );
}

export default App;

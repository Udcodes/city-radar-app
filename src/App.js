import axios from 'axios';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './App.scss';
import { ReactComponent as EmptyState } from './assets/svgs/empty.svg';
import AutocompleteComponent from './components/Autocomplete/AutocompleteComponent';
import { Button } from './components/Button';
import {
  errorState,
  layout,
  metricNames,
  plotObject,
  TOWN_METRICS_URL,
  TOWN_SUGGESTION_URL,
} from './helper/utils';

const App = () => {
  const [cityMetrics, setCityMetrics] = useState([]);
  const [firstInput, setFirstInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [loadingFirstSuggestionMenu, setLoadingFirstSuggestionMenu] = useState(false);
  const [loadingSecondSuggestionMenu, setLoadingSecondSuggestionMenu] = useState(false);
  const [showFirstSuggestionMenu, setShowFirstSuggestionMenu] = useState(false);
  const [showSecondSuggestionMenu, setShowSecondSuggestionMenu] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [firstData, setFirstData] = useState({});
  const [secondData, setSecondData] = useState({});
  const [filteredSuggestions, setFilteredSuggestions] = useState(null);
  const [errorForFirstRequest, setErrorForFirstRequest] = useState(null);
  const [errorForSecondRequest, setErrorForSecondRequest] = useState(null);
  const [loadingFirstRequest, setLoadingFirstRequest] = useState(false);
  const [loadingSecondRequest, setLoadingSecondRequest] = useState(false);

  const firstInputHandler = (e) => {
    e.preventDefault();
    setLoadingFirstSuggestionMenu(true);
    setLoadingSecondSuggestionMenu(false);
    setShowSecondSuggestionMenu(false);
    setShowFirstSuggestionMenu(true);
    setFirstInput(e.currentTarget.value);
    fetchSuggestions(firstInput);
  };
  const secondInputHandler = (e) => {
    e.preventDefault();
    setLoadingFirstSuggestionMenu(false);
    setLoadingSecondSuggestionMenu(true);
    setShowFirstSuggestionMenu(false);
    setShowSecondSuggestionMenu(true);
    setSecondInput(e.currentTarget.value);
    fetchSuggestions(secondInput);
  };

  const onItemSelectedFromFirstMenu = (value) => {
    setFirstInput(value);
    setShowFirstSuggestionMenu(false);
    setFilteredSuggestions([]);
  };
  const onItemSelectedFromSecondMenu = (value) => {
    setSecondInput(value);
    setShowSecondSuggestionMenu(false);
    setFilteredSuggestions([]);
  };

  const fetchSuggestions = async (searchPhrase) => {
    await axios
      .get(`${TOWN_SUGGESTION_URL}?search=${searchPhrase}&limit=10`)
      .then((res) => {
        const cityInfo = res.data?._embedded[
          'city:search-results'
        ][0]?.matching_alternate_names?.map((el) => el.name);
        const filtered = cityInfo?.filter(
          (suggestion) => suggestion?.toLowerCase().indexOf(searchPhrase?.toLowerCase()) > -1
        );
        setLoadingFirstSuggestionMenu(false);
        setLoadingSecondSuggestionMenu(false);
        setFilteredSuggestions(filtered);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onKeyDownForFirstMenu = (e) => {
    if (e.keyCode === 13 && filteredSuggestions) {
      e.preventDefault();
      setActiveItemIndex(0);
      setFirstInput(filteredSuggestions[activeItemIndex]);
      setShowFirstSuggestionMenu(false);
      return;
    } else if (e.keyCode === 38) {
      if (activeItemIndex === 0) {
        return;
      }
      setActiveItemIndex(activeItemIndex - 1);
    } else if (e.keyCode === 40) {
      if (activeItemIndex - 1 === filteredSuggestions?.length) {
        return;
      }
      setActiveItemIndex(activeItemIndex + 1);
    }
  };
  const onKeyDownForSecondMenu = (e) => {
    if (e.keyCode === 13 && filteredSuggestions) {
      e.preventDefault();
      setActiveItemIndex(0);
      setSecondInput(filteredSuggestions[activeItemIndex]);
      setShowSecondSuggestionMenu(false);
    } else if (e.keyCode === 38) {
      if (activeItemIndex === 0) {
        return;
      }
      setActiveItemIndex(activeItemIndex - 1);
    } else if (e.keyCode === 40) {
      if (activeItemIndex - 1 === filteredSuggestions?.length) {
        return;
      }
      setActiveItemIndex(activeItemIndex + 1);
    }
  };

  const getFirstCityMetrics = async (e) => {
    let firstTownColorCodes;
    let firstTownScores;
    setLoadingFirstRequest(true);
    try {
      e?.preventDefault();
      const firstRequest = await axios.get(
        `${TOWN_METRICS_URL}slug:${firstInput.toLowerCase().replace(/ /g, '-')}/scores/`
      );
      let firstDataFilteredArray = firstRequest?.data?.categories.filter((item) => {
        return metricNames.indexOf(item.name) > -1;
      });
      firstDataFilteredArray = { records: firstDataFilteredArray };
      firstTownScores = firstDataFilteredArray?.records?.map((item) => item.score_out_of_10);
      firstTownColorCodes = firstDataFilteredArray?.records?.map((item) => item.color);
      const firstDataObj = {
        ...plotObject,
        r: firstTownScores,
        name: firstInput,
        marker: {
          color: firstTownColorCodes,
        },
        line: { color: '#011FFD' },
      };
      setFirstData(firstDataObj);
      if (Object.keys(secondData).length > 0) {
        setCityMetrics([firstDataObj, secondData]);
      } else {
        setCityMetrics([firstDataObj]);
      }
      setLoadingFirstRequest(false);
      setErrorForFirstRequest(null);
      return;
    } catch (error) {
      setErrorForFirstRequest(error.message);
      setLoadingFirstRequest(false);
    }
  };

  const getSecondCityMetrics = async (e) => {
    let secondTownColorCodes;
    let secondTownScores;
    setLoadingSecondRequest(true);
    e?.preventDefault();
    try {
      const secondRequest = await axios.get(
        `${TOWN_METRICS_URL}slug:${secondInput.toLowerCase().replace(/ /g, '-')}/scores/`
      );
      let secondDataFilteredArray = secondRequest?.data?.categories.filter((item) => {
        return metricNames.indexOf(item.name) > -1;
      });
      secondDataFilteredArray = { records: secondDataFilteredArray };
      secondTownScores = secondDataFilteredArray?.records?.map((item) => item.score_out_of_10);
      secondTownColorCodes = secondDataFilteredArray?.records?.map((item) => item.color);
      const secondDataObj = {
        ...plotObject,
        r: secondTownScores,
        name: secondInput,
        marker: {
          color: secondTownColorCodes,
        },
        line: { color: '#00C2BA' },
      };
      setSecondData(secondDataObj);
      if (Object.keys(firstData).length > 0) {
        setCityMetrics([secondDataObj, firstData]);
      } else {
        setCityMetrics([secondDataObj]);
      }
      setLoadingSecondRequest(false);
      setErrorForSecondRequest(null);
      return;
    } catch (error) {
      setErrorForSecondRequest(error.message);
      setLoadingSecondRequest(false);
    }
  };
  return (
    <div
      className="wrapper"
      onClick={() => {
        setShowFirstSuggestionMenu(false);
        setShowSecondSuggestionMenu(false);
      }}
    >
      <h1 className="title-text">City Radar Chart App</h1>
      <form className="form-one" autocomplete="off" onSubmit={getFirstCityMetrics}>
        <AutocompleteComponent
          className="input1"
          label="Enter first city"
          name="firstInput"
          value={firstInput}
          fetchSuggestions={firstInputHandler}
          placeholder="e.g. berlin"
          suggestion={filteredSuggestions}
          showSuggestions={showFirstSuggestionMenu}
          activeItemIndex={activeItemIndex}
          onItemSelected={(value) => onItemSelectedFromFirstMenu(value)}
          onKeyDown={onKeyDownForFirstMenu}
          loading={loadingFirstSuggestionMenu}
        />
        <Button
          small
          type="submit"
          className="btn1"
          textColor="#fff"
          bgColor="#FF7F50"
          disabled={!firstInput}
        >
          {loadingFirstRequest ? `loading...` : `Submit`}
        </Button>
      </form>
      <div className="space2" />
      <form className="form-two" autocomplete="off" onSubmit={getSecondCityMetrics}>
        <AutocompleteComponent
          className="input2"
          label="Enter second city"
          name="secondInput"
          value={secondInput}
          fetchSuggestions={secondInputHandler}
          placeholder="e.g. dortmund"
          suggestion={filteredSuggestions}
          showSuggestions={showSecondSuggestionMenu}
          activeItemIndex={activeItemIndex}
          onItemSelected={(value) => onItemSelectedFromSecondMenu(value)}
          onKeyDown={onKeyDownForSecondMenu}
          loading={loadingSecondSuggestionMenu}
        />
        <Button
          type="submit"
          className="btn2"
          textColor="#fff"
          bgColor="#FF7F50"
          disabled={!secondInput}
        >
          {loadingSecondRequest ? `loading...` : `Submit`}
        </Button>
      </form>
      <div className="space4" />
      <div className="content">
        <div className="error-container">
          {(errorForFirstRequest || errorForSecondRequest) &&
            errorState(errorForFirstRequest, errorForSecondRequest)}
        </div>
        {Object.keys(firstData).length === 0 || !Object.keys(secondData).length === 0 ? (
          <div className="empty-state">
            <EmptyState />
            Your Radar chart will show up here.
          </div>
        ) : (
          <Plot
            style={{ display: 'flex', justifyContent: 'center' }}
            className="plot"
            data={cityMetrics}
            layout={layout}
            loading={loadingFirstRequest || loadingSecondRequest}
          />
        )}
      </div>
    </div>
  );
};

export default App;

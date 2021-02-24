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
  // const [firstInput, setFirstInput] = useState('');
  // const [secondInput, setSecondInput] = useState('');
  const [values, setValues] = useState({
    firstInput: '',
    secondInput: '',
  });
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
  const [loading, setLoading] = useState(false);

  const firstInputHandler = (e) => {
    e.preventDefault();
    setLoadingFirstSuggestionMenu(true);
    setLoadingSecondSuggestionMenu(false);
    setShowSecondSuggestionMenu(false);
    setShowFirstSuggestionMenu(true);
    setValues({
      [e.target.name]: e.currentTarget.value,
    });
    fetchSuggestions(values.firstInput);
  };
  const secondInputHandler = (e) => {
    e.preventDefault();
    setLoadingFirstSuggestionMenu(false);
    setLoadingSecondSuggestionMenu(true);
    setShowFirstSuggestionMenu(false);
    setShowSecondSuggestionMenu(true);
    setValues({
      [e.target.name]: e.currentTarget.value,
    });
    fetchSuggestions(values.secondInput);
  };

  const onItemSelectedFromFirstMenu = (value) => {
    setValues({
      ...values,
      firstInput: value,
    });
    setShowFirstSuggestionMenu(false);
    setFilteredSuggestions([]);
  };
  const onItemSelectedFromSecondMenu = (value) => {
    setValues({
      ...values,
      secondInput: value,
    });
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

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && filteredSuggestions) {
      e.preventDefault();
      setActiveItemIndex(0);
      setValues({
        [e.target.name]: filteredSuggestions[activeItemIndex],
      });
      setShowFirstSuggestionMenu(false);
      setShowSecondSuggestionMenu(false);
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

  const getCityMetrics = async (e) => {
    let firstDataObj = {};
    let secondDataObj = {};
    setLoading(true);
    e?.preventDefault();
    await axios
      .get(
        `${TOWN_METRICS_URL}slug:${values?.firstInput?.toLowerCase().replace(/ /g, '-')}/scores/`
      )
      .then((firstRequest) => {
        let firstDataFilteredArray = firstRequest?.data?.categories.filter((item) => {
          return metricNames.indexOf(item.name) > -1;
        });
        firstDataFilteredArray = { records: firstDataFilteredArray };
        const firstTownScores = firstDataFilteredArray?.records?.map(
          (item) => item.score_out_of_10
        );
        const firstTownColorCodes = firstDataFilteredArray?.records?.map((item) => item.color);
        firstDataObj = {
          ...plotObject,
          r: firstTownScores,
          name: values?.firstInput,
          marker: {
            color: firstTownColorCodes,
          },
          line: { color: '#011FFD' },
        };
        setFirstData(firstDataObj);
        setCityMetrics([firstDataObj]);
        setErrorForFirstRequest(null);
      })
      .catch((error) => {
        setLoading(false);
        setErrorForFirstRequest(error);
        setFirstData({});
      });

    await axios
      .get(
        `${TOWN_METRICS_URL}slug:${values?.secondInput?.toLowerCase().replace(/ /g, '-')}/scores/`
      )
      .then((secondRequest) => {
        let secondDataFilteredArray = secondRequest?.data?.categories.filter((item) => {
          return metricNames.indexOf(item.name) > -1;
        });
        secondDataFilteredArray = { records: secondDataFilteredArray };
        const secondTownScores = secondDataFilteredArray?.records?.map(
          (item) => item.score_out_of_10
        );
        const secondTownColorCodes = secondDataFilteredArray?.records?.map((item) => item.color);
        secondDataObj = {
          ...plotObject,
          r: secondTownScores,
          name: values?.secondInput,
          marker: {
            color: secondTownColorCodes,
          },
          line: { color: '#00C2BA' },
        };
        setSecondData(secondDataObj);
        firstDataObj && !secondDataObj && setCityMetrics([firstDataObj]);
        secondDataObj && !firstDataObj && setCityMetrics([firstDataObj]);
        firstDataObj && secondDataObj && setCityMetrics([firstDataObj, secondDataObj]);
        !secondDataObj && !firstDataObj && setCityMetrics([]);
        setLoading(false);
        setErrorForSecondRequest(null);
      })
      .catch((error) => {
        setLoading(false);
        setErrorForSecondRequest(error);
        setSecondData({});
      });
  };

  return (
    <div
      onClick={() => {
        setShowFirstSuggestionMenu(false);
        setShowSecondSuggestionMenu(false);
      }}
    >
      <form autocomplete="off" onSubmit={getCityMetrics} className="wrapper">
        <h1 className="title-text">City Radar Chart App</h1>
        <AutocompleteComponent
          className="input1"
          label="Enter first city"
          name="firstInput"
          value={values?.firstInput}
          fetchSuggestions={firstInputHandler}
          placeholder="e.g. berlin"
          suggestion={filteredSuggestions}
          showSuggestions={showFirstSuggestionMenu}
          activeItemIndex={activeItemIndex}
          onItemSelected={(value) => onItemSelectedFromFirstMenu(value)}
          onKeyDown={onKeyDown}
          loading={loadingFirstSuggestionMenu}
        />
        <div className="space1" />
        <AutocompleteComponent
          className="input2"
          label="Enter second city"
          name="secondInput"
          value={values?.secondInput}
          fetchSuggestions={secondInputHandler}
          placeholder="e.g. dortmund"
          suggestion={filteredSuggestions}
          showSuggestions={showSecondSuggestionMenu}
          activeItemIndex={activeItemIndex}
          onItemSelected={(value) => onItemSelectedFromSecondMenu(value)}
          onKeyDown={onKeyDown}
          loading={loadingSecondSuggestionMenu}
        />
        <div className="space2" />
        <Button
          fullWidth
          type="submit"
          className="btn"
          textColor="#fff"
          bgColor="#FF7F50"
          disabled={(!values.firstInput && !values.secondInput) || loading}
        >
          {loading ? `Loading...` : `Submit`}
        </Button>
        <div className="space3" />
        <div className="content">
          <div className="error-container">
            {(errorForFirstRequest || errorForSecondRequest) &&
              errorState(errorForFirstRequest, errorForSecondRequest)}
          </div>
          {Object.keys(firstData).length === 0 && Object.keys(secondData).length === 0 ? (
            <div className="empty-state">
              <EmptyState />
              Your Radar chart will show up here.
            </div>
          ) : errorForFirstRequest && errorForSecondRequest ? (
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
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default App;

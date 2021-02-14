import React from 'react';
import styled from 'styled-components';
import Loader from '../Loader';
import './style.scss';

// const AutocompleteWrapper = styled.div`
//   position: relative;
// `;
const AutocompleteInput = styled.input`
  position: relative;
  width: 100%;
  width: -webkit-fill-available;

  outline: none;
  color: black;
  border: none;
  border-bottom: 2px solid grey;
  height: 40px;
  font-size: 16px;
  /* padding: 0px 8px 0px 8px; */
  /* margin: 4px 0; */
  /* display: grid */
  /* width: 100%; */
  border: 1px solid whitesmoke;
  &:focus-within {
    /* border: 1px solid #0050c8; */
    border: 1px solid #0050c8;
  }
  &::placeholder {
    font-size: 14px;
  }
`;

const Autocomplete = (props) => {
  const {
    label,
    value,
    onChange,
    placeholder,
    loading,
    suggestion,
    onItemSelected,
    onKeyDown,
    className,
    showSuggestions,
    activeSuggestion,
    ...inputProps
  } = props;

  let renderSuggestions;

  if (showSuggestions && value) {
    suggestion?.length
      ? (renderSuggestions = (
          <ul className="suggestion list">
            {suggestion.map((item, index) => (
              <li
                key={index}
                role="presentation"
                onClick={onItemSelected}
                className={index === activeSuggestion ? 'suggestion-active' : ''}
              >
                {item}
              </li>
            ))}
          </ul>
        ))
      : (renderSuggestions = (
          <div className="suggestion no-suggestions">
            <p>"{value}" not found, please try another keyword.</p>
          </div>
        ));
  }

  return (
    <React.Fragment>
      <div className="suggest-wrapper">
        {label && <span className="text-label">{label}</span>}
        <AutocompleteInput
          autocomplete="off"
          value={value}
          type="text"
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          {...inputProps}
        />
        {loading ? (
          <div className="icon">
            <Loader small />
          </div>
        ) : (
          renderSuggestions
        )}
      </div>
    </React.Fragment>
  );
};

export default Autocomplete;

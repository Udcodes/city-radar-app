import React from 'react';
import styled from 'styled-components';
import Loader from '../Loader';
import './style.scss';

const AutocompleteWrapper = styled.div`
  position: relative;
`;
const AutocompleteInput = styled.input`
  width: 100%;
  outline: none;
  color: #5e6c84;
  border: none;
  border-bottom: 1px solid #5e6c84;
  padding: 12px 0px 12px 0px;
  /* margin: 4px 0; */
  background-color: transparent;
  /* display: grid */
  /* width: 100%; */
  &:focus-within {
    // border: 1px solid #0050c8;
    border-bottom: 2px solid #0050c8;
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
          <ul className="suggestion-box">
            {suggestion.map((item, index) => (
              <li
                key={index}
                role="button"
                onClick={onItemSelected}
                className={index === activeSuggestion ? 'suggestion-active' : ''}
              >
                {item}
              </li>
            ))}
          </ul>
        ))
      : (renderSuggestions = (
          <div className="no-suggestions">
            <p>No suggestions available.</p>
          </div>
        ));
  }

  return (
    <React.Fragment>
      <AutocompleteWrapper>
        <AutocompleteInput
          value={value}
          type="text"
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          {...inputProps}
        />
        {loading && (
          <div className="textIcon">
            <Loader />
          </div>
        )}
        {renderSuggestions}
      </AutocompleteWrapper>
    </React.Fragment>
  );
};

export default Autocomplete;

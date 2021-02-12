import React from 'react';
import styled from 'styled-components';
import Loader from '../Loader';
import './style.scss';

const AutocompleteContainer = styled.div`
  margin: 15px 0;
  height: fit-content;
  display: grid;
`;
const Input = styled.input`
  color: #5e6c84;
  border: 1px solid #5e6c84;
  padding: 12px 16px;
  /* margin: 4px 0; */
  background-color: transparent;
  display: grid
  /* width: 100%; */
  &:focus-within {
    border: 1px solid #0050c8;
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
    onClick,
    ...inputProps
  } = props;

  const renderSuggestions = (value, suggestion) => {
    <>
      {value && suggestion.length ? (
        <ul className="suggestion-box">
          {suggestion.map((item, index) => (
            <li key={index} onClick={onClick}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div class="no-suggestions">
          <p>No suggestions available.</p>
        </div>
      )}
    </>;
  };

  return (
    <>
      <AutocompleteContainer>
        {label && <span className="text-label">{label}</span>}
        <Input
          value={value}
          type="text"
          onChange={onChange}
          placeholder={placeholder}
          {...inputProps}
        />
        {loading && (
          <div className="textIcon">
            <Loader />
          </div>
        )}
        {renderSuggestions(value, suggestion)}
      </AutocompleteContainer>
    </>
  );
};

export default Autocomplete;

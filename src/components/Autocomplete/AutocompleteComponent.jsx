import React from 'react';
import Loader from '../Loader';
import './style.scss';

const AutocompleteComponent = (props) => {
  const {
    label,
    value,
    fetchSuggestions,
    placeholder,
    loading,
    suggestion,
    onItemSelected,
    onKeyDown,
    className,
    showSuggestions,
    activeItemIndex,
    menuRef,
    ...inputProps
  } = props;

  let renderSuggestions;
  if (showSuggestions && value) {
    suggestion?.length
      ? (renderSuggestions = (
          <ul className="suggestion list" ref={menuRef}>
            {suggestion.map((item, index) => (
              <li
                key={item}
                role="presentation"
                onClick={() => {
                  onItemSelected(item);
                }}
                className={index === activeItemIndex ? 'suggestion-active' : ''}
              >
                {item}
              </li>
            ))}
          </ul>
        ))
      : (renderSuggestions = (
          <div className="suggestion no-suggestions" ref={menuRef}>
            <p>"{value}" not found, please try another keyword.</p>
          </div>
        ));
  }

  return (
    <React.Fragment>
      <div className={`suggest-wrapper ${className}`}>
        {label && <span className="text-label">{label}</span>}
        <input
          autocomplete="off"
          className="input-field "
          value={value}
          type="search"
          onChange={fetchSuggestions}
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

export default AutocompleteComponent;

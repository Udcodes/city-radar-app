import { fireEvent, render } from '@testing-library/react';
import mockAxios from 'axios';
import React from 'react';
import AutocompleteComponent from './AutocompleteComponent';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest
      .fn()
      .mockResolvedValue({ data: { _embedded: { 'city:search-results': [{ name: 'Housing' }] } } }),
  },
}));

describe('fetchSuggestions prop', () => {
  afterEach(jest.clearAllMocks);
  it('updates input field as user types', () => {
    const { queryByPlaceholderText } = render(<AutocompleteComponent />);
    const searchInput = queryByPlaceholderText('search');
    fireEvent.change(searchInput, { target: { value: test } });
    expect(searchInput.value).toBe('test');
  });

  test('should call axios and fetch data', async () => {
    const { fetchSuggestions } = await AutocompleteComponent();
    expect(fetchSuggestions).toBe('Housing');
    expect(mockAxios.get).toHaveBeenCalled();
    const { queryByPlaceholderText } = render(<AutocompleteComponent />);
    const searchInput = queryByPlaceholderText('search');
    fireEvent.change(searchInput, { target: { value: test } });
    expect(searchInput.value).toBe('test');
  });
});

describe('onItemSelected prop', () => {
  describe('with no value', () => {
    it('does not trigger onItemSelected function', () => {
      const onItemSelected = jest.fn();
      const { queryByTestId } = render(<AutocompleteComponent onItemSelected={onItemSelected} />);
      fireEvent.click(queryByTestId('select-value'));
      expect(onItemSelected.value).not.toHaveBeenCalled();
    });
  });
  describe('with value', () => {
    it('triggers onItemSelected function', () => {
      const onItemSelected = jest.fn();
      const { queryByTestId, queryByPlaceholderText } = render(
        <AutocompleteComponent onItemSelected={onItemSelected} />
      );
      const searchInput = queryByPlaceholderText('search');
      fireEvent.change(searchInput, { target: { value: test } });

      fireEvent.click(queryByTestId('select-value'));
      expect(onItemSelected.value).toHaveBeenCalled();
    });
  });
});

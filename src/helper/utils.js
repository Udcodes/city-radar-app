import { useEffect, useRef } from 'react';
export const metricNames = [
  'Housing',
  'Healthcare',
  'Internet Access',
  'Safety',
  'Education',
  'Cost of Living',
];
export const TOWN_SUGGESTION_URL = 'https://api.teleport.org/api/cities/';
export const TOWN_METRICS_URL = 'https://api.teleport.org/api/urban_areas/';
export const plotObject = {
  type: 'scatterpolar',
  r: [],
  theta: metricNames,
  fill: 'toself',
  name: '',
  marker: {
    color: [],
  },
  showlegend: true,
  line: { color: '#011FFD' },
  mode: 'lines+markers',
};
export const layout = {
  polar: {
    radialaxis: {
      visible: true,
      range: [0, 10],
      showgrid: true,
      tickmode: 'auto',
      textcolor: '#000',
    },
  },
};

export const useClickOutside = (outsideClick) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        outsideClick();
      }
    };
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        outsideClick();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyPress, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyPress, true);
    };
  }, [menuRef, outsideClick]);
  return { menuRef };
};

export const errorState = (firstRequestError, secondRequestError) => {
  let errors = firstRequestError && secondRequestError;
  if (errors) {
    return <p className="error-message">No data-set was returned for both entries.</p>;
  }
  if (firstRequestError) {
    return <p className="error-message">No data-set was returned for your first entry.</p>;
  }
  if (secondRequestError) {
    return <p className="error-message">No data-set was returned for your second entry.</p>;
  }
};

import React from 'react';
import './style.scss';

const Loader = ({ fullPage, small }) => (
  <div className={`${fullPage ? 'full-page' : ''}`}>
    <div className={`loader ${small ? 'loader-small' : ''}`} />
  </div>
);

export default Loader;

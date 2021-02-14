import React from 'react';
import Plot from 'react-plotly.js';
import Loader from '../Loader';

const RadarChart = (props) => {
  const { data, layout, frames, config, getMetrics, loading } = props;
  let renderRadarChart;

  data && data.length
    ? (renderRadarChart = (
        <div>
          <Plot data={data} layout={layout} frames={frames} config={config} />
        </div>
      ))
    : (renderRadarChart = <div>hiiiiii</div>);

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        renderRadarChart
      )}
    </>
  );
};
export default RadarChart;

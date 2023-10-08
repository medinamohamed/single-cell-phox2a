import React, { useState, useEffect } from 'react';
import { scaleLinear, scaleOrdinal, schemeCategory10, extent, min, max } from 'd3';
import clusterData from './data.json'; // Import the JSON data
import '../css/ScatterPlot.css';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

function ScatterPlot() {
  const [data, setData] = useState([]);
  const [visibleClusters, setVisibleClusters] = useState([]);

  // Define width, height, and margin values
  const width = 800;
  const height = 400;
  const margin = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 50,
  };

  // Define X and Y scales
  const xScale = scaleLinear()
    .domain([min(data, (d) => +d.X), max(data, (d) => +d.X)])
    .range([0, width - 20]);
  const yScale = scaleLinear()
    .domain([min(data, (d) => +d.Y), max(data, (d) => +d.Y)])
    .range([height - 50, 0]);

  // Define color scale for clusters
  const colorScale = scaleOrdinal(schemeCategory10);

  const uniqueClusters = [...new Set(data.map((d) => d.Cluster))];

  useEffect(() => {
    // Calculate the domains based on the loaded data
    xScale.domain(extent(clusterData, (d) => +d.X));
    yScale.domain(extent(clusterData, (d) => +d.Y));

    // Set the data and visible clusters
    setData(clusterData);
    setVisibleClusters([...new Set(clusterData.map((d) => d.Cluster))]); // Initially, all clusters are visible
  }, []);

  const handleClusterToggle = (event, newClusters) => {
    setVisibleClusters(newClusters);
  };

  return (
    <div className="scatter-plot-container">
<svg width={width} height={height}>
  <g transform={`translate(${margin.left},${margin.top})`}>
    {data.map((d, i) => (
      <circle
        key={i}
        cx={xScale(+d.X)}
        cy={yScale(+d.Y)}
        r={5} // Adjust the radius of your circles
        fill={colorScale(d.Cluster)} // Set the fill color based on the cluster value
        style={{
          opacity: visibleClusters.includes(d.Cluster) ? 1 : 0, // Hide circles of non-visible clusters
        }}
      />
    ))}
  </g>
</svg>
      {/* Render cluster toggle buttons */}
      <div>
      <div className="toggle-button-group">
        <ToggleButtonGroup
          color="primary"
          variant="outlined"
          value={visibleClusters}
          onChange={handleClusterToggle}
          aria-label="Cluster Toggle"
        >
          {uniqueClusters.map((cluster) => (
            <ToggleButton key={cluster} value={cluster} aria-label={cluster}>
              {cluster}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default ScatterPlot;

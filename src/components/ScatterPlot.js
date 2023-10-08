import React, { useState, useEffect } from 'react';
import { scaleLinear, scaleOrdinal, schemeCategory10, extent,min,max } from 'd3';
import clusterData from './data.json'; // Import the JSON data

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
  const xScale = scaleLinear().domain([min(data, d => +d.X), max(data, d => +d.X)]).range([0, width]);
  const yScale = scaleLinear().domain([min(data, d => +d.Y), max(data, d => +d.Y)]).range([height, 0]);

  // Define color scale for clusters
  const colorScale = scaleOrdinal(schemeCategory10);

  const uniqueClusters = [...new Set(data.map(d => d.Cluster))];

  useEffect(() => {
    // Calculate the domains based on the loaded data
    xScale.domain(extent(clusterData, d => +d.X));
    yScale.domain(extent(clusterData, d => +d.Y));

    // Set the data and visible clusters
    setData(clusterData);
    setVisibleClusters([...new Set(clusterData.map((d) => d.Cluster))]); // Initially, all clusters are visible
  }, []);

  const handleClusterToggle = (cluster) => {
    if (visibleClusters.includes(cluster)) {
      setVisibleClusters(visibleClusters.filter(c => c !== cluster));
    } else {
      setVisibleClusters([...visibleClusters, cluster]);
    }
  };

  return (
    <div>
      {/* Render scatter plot */}
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d, i) => (
            // Check if the cluster is in the visibleClusters array before rendering
            visibleClusters.includes(d.Cluster) && (
              <circle
                key={i}
                cx={xScale(+d.X)}
                cy={yScale(+d.Y)}
                r={5}  // Adjust the radius of your circles
                fill={colorScale(d.Cluster)}
              />
            )
          ))}

        </g>
      </svg>
      {/* Render cluster toggle buttons */}
      <div>
        {uniqueClusters.map(cluster => (
          <label key={cluster}>
            <input 
              type="checkbox"
              checked={visibleClusters.includes(cluster)}
              onChange={() => handleClusterToggle(cluster)}
            />
            {cluster}
          </label>
        ))}
      </div>
    </div>
  );
}

export default ScatterPlot;

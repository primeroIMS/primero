import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

import { NAME, COLORS } from "./constants";

const PieChart = ({ data, labels, query }) => {
  const chartRef = React.createRef();

  useEffect(() => {
    const chartCtx = chartRef.current.getContext("2d");

    const chartInstance = new Chart(chartCtx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: Object.values(COLORS)
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        onClick: (e, item) => {
          if (query) {
            const selectedIndex = item[0]._index;

            console.log(
              item[0]._chart.data,
              selectedIndex,
              query[selectedIndex]
            );
          }
        }
      }
    });

    return () => {
      chartInstance.destroy();
    };
  });

  return <canvas className="doughnutChart" ref={chartRef} />;
};

PieChart.displayName = NAME;

PieChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  labels: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  query: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

export default PieChart;

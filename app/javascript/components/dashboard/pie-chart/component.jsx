import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Chart from "chart.js";
import { push } from "connected-react-router";

import { ROUTES } from "../../../config";
import { buildFilter } from "../helpers";

import { NAME, COLORS } from "./constants";

const PieChart = ({ data, labels, query }) => {
  const dispatch = useDispatch();
  const chartRef = React.createRef();

  const handleClick = item => {
    if (query) {
      const selectedIndex = item[0]._index;

      dispatch(
        push({
          pathname: ROUTES.cases,
          search: buildFilter(query[selectedIndex])
        })
      );
    }
  };

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
        onHover: (event, chartElement) => {
          // eslint-disable-next-line no-param-reassign
          event.target.style.cursor = chartElement[0] ? "pointer" : "default";
        },
        onClick: (e, item) => handleClick(item)
      }
    });

    return () => {
      chartInstance.destroy();
    };
  });

  return <canvas ref={chartRef} />;
};

PieChart.displayName = NAME;

PieChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  labels: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  query: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

export default PieChart;

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Chart from "chart.js";
import { push } from "connected-react-router";

import { FROM_DASHBOARD_PARAMS } from "../constants";
import { ROUTES, RECORD_PATH } from "../../../config";
import { setDashboardFilters } from "../../filters-builder/action-creators";
import { buildFilter } from "../helpers";

import { NAME, COLORS } from "./constants";

const PieChart = ({ data, labels, query }) => {
  const dispatch = useDispatch();
  const chartRef = React.createRef();

  const handleClick = item => {
    if (query) {
      const selectedIndex = item[0]._index;

      dispatch(
        setDashboardFilters(
          RECORD_PATH.cases,
          buildFilter(query[selectedIndex])
        )
      );

      dispatch(
        push({
          pathname: ROUTES.cases,
          search: FROM_DASHBOARD_PARAMS
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
        onClick: (e, item) => handleClick(item)
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

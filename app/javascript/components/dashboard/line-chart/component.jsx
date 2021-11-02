import Chart from "chart.js";
import PropTypes from "prop-types";
import { createRef, useEffect } from "react";

import css from "./styles.css";

const LineChart = ({ chartData, options, title }) => {
  const chartRef = createRef();

  useEffect(() => {
    const chatCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    const chartInstance = new Chart(chatCtx, {
      type: "line",
      data: chartData,
      animation: false,
      options: {
        responsive: true,
        animation: {
          duration: 0
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: "rgba(0, 0, 0, 0)",
                drawTicks: false
              },
              ticks: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
                color: "rgba(0, 0, 0, 0)",
                drawTicks: false
              },
              ticks: {
                display: false
              }
            }
          ]
        },
        ...options
      }
    });

    return () => {
      chartInstance.destroy();
    };
  });

  return (
    <div>
      <p className={css.Description}>{title}</p>
      <canvas className="lineChart" ref={chartRef} />
    </div>
  );
};

LineChart.displayName = "LineChart";

LineChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  options: PropTypes.object,
  title: PropTypes.string
};

export default LineChart;

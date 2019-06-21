import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Chart from "chart.js";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const LineChart = ({ chartData, options, title }) => {
  const css = makeStyles(styles)();
  const chartRef = React.createRef();

  useEffect(() => {
    const chatCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    new Chart(chatCtx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
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
  });

  return (
    <Box>
      <p className={css.Description}>{title}</p>
      <canvas className="lineChart" ref={chartRef} />
    </Box>
  );
};

LineChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  options: PropTypes.object,
  title: PropTypes.string
};

export default LineChart;

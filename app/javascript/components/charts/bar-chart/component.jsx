import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Chart from "chart.js";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const BarChart = ({ data, description, showDetails }) => {
  const css = makeStyles(styles)();
  const chartRef = React.createRef();

  useEffect(() => {
    const chatCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    const chartInstance = new Chart(chatCtx, {
      type: "bar",
      data,
      options: {
        responsive: true,
        animation: {
          duration: 0
        },
        legend: {
          display: showDetails
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const { label } = chartData.datasets[tooltipItem.datasetIndex];
              let { value } = tooltipItem;

              if (value === "0.1") {
                value = "0";
              }

              return `${label}: ${value}`;
            }
          }
        },
        scales: {
          yAxes: [
            {
              display: showDetails,
              ticks: {
                beginAtZero: true,
                min: 0,
                suggestedMin: 0
              }
            }
          ],
          xAxes: [
            {
              display: showDetails,
              min: 0,
              suggestedMin: 0,
              ticks: {
                callback: value => {
                  if (value.length > 25) {
                    return value.substr(0, 25).concat("...");
                  }
                  return value;
                }
              }
            }
          ]
        }
      }
    });

    return () => {
      chartInstance.destroy();
    };
  });

  return (
    <Box>
      {!showDetails ? <p className={css.description}>{description}</p> : null}
      <canvas className="bartChart" ref={chartRef} />
    </Box>
  );
};

BarChart.defaultProps = {
  showDetails: false
};

BarChart.propTypes = {
  data: PropTypes.object,
  description: PropTypes.string,
  showDetails: PropTypes.bool
};

export default BarChart;

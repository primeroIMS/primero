// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Chart from "chart.js";
import { createRef, useEffect } from "react";
import PropTypes from "prop-types";
import arrayReverse from "lodash/reverse";

import css from "./styles.css";

function BarChart({ data, description, showDetails = false, hideLegend = false, reverse = false, valueRender = null }) {
  const chartRef = createRef();

  useEffect(() => {
    const chatCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    const chartInstance = new Chart(chatCtx, {
      type: "bar",
      data: {
        ...(data || {}),
        datasets: reverse ? arrayReverse(data?.datasets || []) : data?.datasets
      },
      options: {
        responsive: true,
        animation: {
          duration: 0
        },
        maintainAspectRatio: false,
        legend: {
          display: hideLegend ? false : showDetails
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const { label } = chartData.datasets[tooltipItem.datasetIndex];
              let { value } = tooltipItem;

              if (value === "0.1") {
                value = "0";
              }

              const displayValue = valueRender ? valueRender(value, tooltipItem.datasetIndex) : value;

              return `${label}: ${displayValue}`;
            }
          }
        },
        scales: {
          yAxes: [
            {
              display: showDetails,
              ticks: {
                precision: 0,
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
                precision: 0,
                reverse,
                callback: value => {
                  if (value?.length > 25) {
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
    <div>
      {!showDetails ? (
        <p className={css.description} data-testid="paragraph">
          {description}
        </p>
      ) : null}
      <canvas id="reportGraph" data-testid="canvas" ref={chartRef} height={!showDetails ? null : 400} />
    </div>
  );
}

BarChart.displayName = "BarChart";

BarChart.propTypes = {
  data: PropTypes.object,
  description: PropTypes.string,
  hideLegend: PropTypes.bool,
  reverse: PropTypes.bool,
  showDetails: PropTypes.bool,
  valueRender: PropTypes.func
};

export default BarChart;

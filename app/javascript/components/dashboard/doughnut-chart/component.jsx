import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

Chart.pluginService.register({
  beforeDraw(chart) {
    const { width, height, ctx } = chart.chart;
    ctx.restore();
    const fontSize = (height / 160).toFixed(2);
    ctx.textBaseline = "top";
    const { innerText } = chart.data;
    if (innerText) {
      const initY = height / 2 - 10;
      let textY = initY;
      if (Array.isArray(innerText)) {
        innerText.forEach(currentText => {
          const { text, bold } = currentText;
          const initX = Math.round((width - ctx.measureText(text).width) / 2);
          ctx.font = `${bold ? "bold" : ""} ${fontSize}em sans-serif`;
          ctx.fillText(text, initX, textY);
          textY += 10;
        });
      } else {
        const { text, bold } = innerText;
        const initX = Math.round(
          (width - ctx.measureText(innerText).width) / 2
        );
        ctx.font = `${bold ? "bold" : ""} ${fontSize}em sans-serif`;
        ctx.fillText(text, initX, initY);
      }
    }
    ctx.save();
  }
});

const DoughnutChart = ({ chartData, options }) => {
  const chartRef = React.createRef();

  useEffect(() => {
    const chartCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    new Chart(chartCtx, {
      type: "doughnut",
      data: chartData,
      options: {
        cutoutPercentage: 60,
        legend: {
          display: false
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        ...options
      }
    });
  });

  return <canvas className="doughnutChart" ref={chartRef} />;
};

DoughnutChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  options: PropTypes.object
};

export default DoughnutChart;

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

const fillInnerText = (width, fontSize, textObj, ctx, textY) => {
  const { text, bold } = textObj;
  const initX = Math.round((width - ctx.measureText(text).width) / 2);
  ctx.font = `${bold ? "bold" : ""} ${fontSize}em sans-serif`;
  ctx.fillText(text, initX, textY);
};

Chart.pluginService.register({
  beforeDraw(chart) {
    const { width, height, ctx } = chart.chart;
    const { innerText } = chart.data;
    const fontSize = (height / 160).toFixed(2);
    ctx.restore();
    ctx.textBaseline = "top";
    if (innerText) {
      const initY = height / 2 - 10;
      if (Array.isArray(innerText)) {
        let textY = initY;
        innerText.forEach(text => {
          fillInnerText(width, fontSize, text, ctx, textY);
          textY += 10;
        });
      } else {
        fillInnerText(width, fontSize, innerText, ctx, initY);
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

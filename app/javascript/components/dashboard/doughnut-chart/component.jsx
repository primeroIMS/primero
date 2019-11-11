import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

const calculateFontSize = (ctx, textConfig, width, height) => {
  const { text, fontStyle } = textConfig;

  ctx.font = `30px ${fontStyle}`;
  const stringWidth = ctx.measureText(text).width;

  const widthRatio = width / stringWidth;
  const newFontSize = Math.floor(30 * widthRatio);

  return Math.min(newFontSize, height);
};

Chart.pluginService.register({
  beforeDraw(chart) {
    const { innerTextConfig } = chart.data;

    if (innerTextConfig) {
      const { ctx } = chart.chart;
      const { innerRadius, chartArea } = chart;
      const sidePadding = 20;
      const sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2);
      const elementWidth = innerRadius * 2 - sidePaddingCalculated;
      const elementHeight = innerRadius * 2;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.fillStyle = "#231E1F";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let textY = centerY;

      innerTextConfig.forEach(textConfig => {
        const { text, fontStyle } = textConfig;
        const fontSize = calculateFontSize(
          ctx,
          textConfig,
          elementWidth,
          elementHeight
        );

        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillText(text, centerX, textY);
        textY += fontSize;
      });
    }
  }
});

const DoughnutChart = ({ chartData, options }) => {
  const chartRef = React.createRef();

  useEffect(() => {
    const chartCtx = chartRef.current.getContext("2d");

    /* eslint-disable no-new */
    const chartInstance = new Chart(chartCtx, {
      type: "doughnut",
      data: chartData,
      options: {
        animation: {
          duration: 0
        },
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

    return () => {
      chartInstance.destroy();
    };
  });

  return <canvas className="doughnutChart" ref={chartRef} />;
};

DoughnutChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  options: PropTypes.object
};

export default DoughnutChart;

import { Line } from 'vue-chartjs';

export default {
  name: 'TestResultsChart',
  extends: Line,
  props: {
    chartData: Object,
    yAxisUnit: String,
  },
  mounted() {
    this.renderChart(this.chartData, {
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: 'linear',
            ticks: {
              suggestedMin: 0,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              suggestedMin: 0,
            },
            scaleLabel: {
              labelString: this.yAxisUnit,
              display: true,
            },
          },
        ],
      },
      tooltips: {
        mode: 'point',
        callbacks: {
          title: tooltipItem => `${tooltipItem[0].xLabel} elements`,
          label: tooltipItem => `${tooltipItem.yLabel} ${this.yAxisUnit.toLowerCase()}`,
        },
      },
    });
  },
};

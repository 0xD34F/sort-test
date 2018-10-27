<template lang="pug">
  v-expansion-panel(
    v-model="showTests"
    :expand="true"
  )
    v-expansion-panel-content(
      v-for="test in tests"
      :key="test.name"
      class="test-results-chart"
    )
      .headline(slot="header") {{ test.title }}
      test-results-chart(
        :chartData="test.chartData"
        :options="getChartOptions(test)"
        ref="charts"
      )
</template>

<script>
import { Line, mixins } from 'vue-chartjs';

const TestResultsChart = {
  name: 'TestResultsChart',
  extends: Line,
  mixins: [ mixins.reactiveProp ],
  props: {
    chartData: Object,
    options: Object,
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};

export default {
  name: 'TestResults',
  components: {
    TestResultsChart,
  },
  props: {
    tests: Array,
  },
  data() {
    return {
      showTests: [],
    };
  },
  methods: {
    getChartOptions(test) {
      return {
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
                labelString: test.unit,
                display: true,
              },
            },
          ],
        },
        tooltips: {
          mode: 'point',
          callbacks: {
            title: tooltipItem => `${tooltipItem[0].xLabel} elements`,
            label: tooltipItem => `${tooltipItem.yLabel} ${test.unit.toLowerCase()}`,
          },
        },
      };
    },
    updateCharts() {
      this.$refs.charts.forEach(n => n._data._chart.update());
    },
  },
  created() {
    this.showTests = Array(this.tests.length).fill(true);
  },
};
</script>

<style scoped>
.v-expansion-panel__body > div {
  height: 80vh;
}
</style>

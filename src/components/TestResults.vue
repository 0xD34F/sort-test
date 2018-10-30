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
        v-show="isResults"
        :chartData="test.chartData"
        :yAxisUnit="test.unit"
        ref="charts"
      )
      .no-data(v-show="!isResults") NO DATA
</template>

<script>
import TestResultsChart from './TestResultsChart';

export default {
  name: 'TestResults',
  components: {
    TestResultsChart,
  },
  props: {
    tests: Array,
    isResults: Boolean,
  },
  data() {
    return {
      showTests: [],
    };
  },
  methods: {
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

/deep/ .v-expansion-panel__header {
  background-color: #eee;
  border-bottom: 1px solid #ddd;
}

.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
  font-size: 64px;
}
</style>

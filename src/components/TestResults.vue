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
        :yAxisUnit="test.unit"
        ref="charts"
      )
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
</style>

<template lang="pug">
  v-app(id="app")
    v-toolbar
      v-btn(
        v-show="!testing"
        @click="start"
        icon
        color="primary"
      )
        v-icon play_arrow
      v-btn(
        v-show="testing"
        @click="stop({ type: 'warning', text: 'Test was aborted by user' })"
        icon
        color="primary"
      )
        v-icon stop
      v-menu(offset-y)
        v-btn(
          slot="activator"
          color="primary"
        )
          span Algorithms
          v-icon arrow_drop_down
        v-list
          v-list-tile(
            v-for="sort in sorts"
            :key="sort.name"
            @click.stop=""
          )
            v-checkbox(
              v-model="sort.isTested"
              :label="sort.name"
            )
      v-btn(
        v-for="option in testOptions"
        :key="option.name"
        @click="openDialog(option)"
        color="primary"
      ) {{ option.title }}...

    test-option-dialog(
      v-bind="activeOption"
      :show="!!activeOption"
      @close="closeDialog"
    )

    .info-panel
      v-alert(
        :value="!!message.type"
        :type="message.type"
      ) {{ message.text }}
      v-progress-linear(
        v-if="testing"
        :indeterminate="true"
      )

    test-results(
      :tests="tests"
      ref="results"
    )
</template>

<script>
import TestOptionDialog from './components/TestOptionDialog';
import TestResults from './components/TestResults';
import Worker from './worker/sort-test.worker.js';

export default {
  name: 'App',
  components: {
    TestOptionDialog,
    TestResults,
  },
  data() {
    return {
      worker: null,
      message: {
        type: null,
        text: '',
      },
      sorts: [
        {
          name: 'bubble',
          color: '#0f5ac6',
        },
        {
          name: 'oddEven',
          color: '#ff960b',
        },
        {
          name: 'gnome',
          color: '#029311',
        },
        {
          name: 'selection',
          color: '#e3d844',
        },
        {
          name: 'insertion',
          color: '#8c2ee0',
        },
        {
          name: 'comb',
          color: '#1fef2b',
        },
        {
          name: 'counting',
          color: '#ff67eb',
        },
        {
          name: 'heap',
          color: '#ff0000',
        },
        {
          name: 'quick',
          color: '#91bcd5',
        },
      ].map(n => ({ ...n, isTested: true })),
      tests: [
        {
          name: 'comparisons',
          title: 'Comparisons',
          unit: 'Comparisons',
        },
        {
          name: 'swaps',
          title: 'Swaps',
          unit: 'Swaps',
        },
        {
          name: 'time',
          title: 'Run time',
          unit: 'Milliseconds',
        },
      ].map(n => ({ ...n, chartData: {} })),
      activeOption: null,
      testOptions: [ 
        {
          name: 'elements',
          title: 'Test arrays sizes',
          value: '[ 1000, 2000, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000 ]',
        },
        {
          name: 'fill',
          title: 'Test arrays fill',
          value:
`function(array) {
  for (var i = 0; i < array.length; i++) {
    array[i] = Math.random() * array.length | 0;
  }
}`,
        },
      ],
    };
  },
  computed: {
    testSorts() {
      return this.sorts.filter(n => n.isTested);
    },
    testing() {
      return !!this.worker;
    },
  },
  methods: {
    openDialog(option) {
      this.activeOption = option;
    },
    closeDialog($event) {
      this.activeOption.value = $event;
      this.activeOption = null;
    },
    start() {
      if (!this.testing) {
        this.worker = new Worker();
        this.worker.addEventListener('message', this.onMessage.bind(this));
        this.message = {};
        this.resetResults();

        this.worker.postMessage({
          sorts: this.testSorts.map(n => n.name),
          ...this.testOptions.reduce((acc, n) => ({ ...acc, [n.name]: n.value }), {}),
        });
      }
    },
    stop(message) {
      if (this.testing) {
        this.worker.terminate();
        this.worker = null;
        this.message = message;
      }
    },
    onMessage(e) {
      if (e.data.results) {
        this.addResult(e.data.results);
      } else if (e.data.results === null) {
        this.stop({
          type: 'success',
          text: 'Test was successfully completed',
        });
      } else if (e.data.error) {
        this.stop({
          type: 'error',
          text: e.data.error,
        });
      }
    },
    resetResults() {
      this.updateTestResults(test => {
        test.chartData.datasets = this.testSorts.map(sort => ({
          data: [],
          label: sort.name,
          fill: false,
          lineTension: 0,
          borderColor: sort.color,
          backgroundColor: sort.color,
        }));
      });
    },
    addResult(data) {
      this.updateTestResults(test => {
        test.chartData.datasets.find(n => n.label === data.sort).data.push({
          x: data.elements,
          y: data[test.name],
        });
      });
    },
    updateTestResults(callback) {
      this.tests.forEach(callback);
      this.$refs.results.updateCharts();
    },
  },
};
</script>

<style>
.v-toolbar__content > *:first-child.v-btn--icon,
.v-toolbar__content > *:first-child,
.v-toolbar__extension > *:first-child.v-btn--icon,
.v-toolbar__extension > *:first-child {
  margin-left: 6px;
}

.info-panel {
  display: flex;
  height: 60px;
  align-items: center;
}

.info-panel .v-alert {
  width: 100%;
}
</style>

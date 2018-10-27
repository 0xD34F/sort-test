const context = require.context('./algorithms', false, /\.js$/);
const algorithms = context.keys().reduce((algorithms, key) => ({
  ...algorithms,
  [key.match(/\w+/).pop()]: context(key).default,
}), {});


const sortTest = {
  algorithms,
  stats: {},
  resetStats() {
    Object.assign(this.stats, {
      comparisons: 0,
      swaps: 0,
      startTime: new Date(),
    });
  },
  compare(a, b) {
    this.stats.comparisons++;

    return a - b;
  },
  swap(array, i, j) {
    this.stats.swaps++;

    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  },
  run(sort, array) {
    const arrayCopy = [...array];
    this.resetStats();
    this.algorithms[sort].call(this, arrayCopy);

    return {
      sort,
      elements: array.length,
      comparisons: this.stats.comparisons,
      swaps: this.stats.swaps,
      time: new Date() - this.stats.startTime,
    };
  },
};


const post = {
  result(data) {
    self.postMessage({
      results: data,
    });
  },
  error(data) {
    self.postMessage({
      error: data,
    });
  },
};


self.addEventListener('message', function(e) {
  const testParams = e.data;

  let elements = null;
  try {
    elements = eval(`(${testParams.elements})`);
    if (elements instanceof Function) {
      elements = elements();
    }
    if (!(elements instanceof Array)) {
      throw 'not an array';
    }
  } catch (e) {
    post.error(`Arrays sizes: ${e.message || e}`);
  }

  let fill = null;
  try {
    fill = eval(`(${testParams.fill})`);
    if (!(fill instanceof Function)) {
      throw 'not a function';
    }
  } catch (e) {
    post.error(`Arrays fill: ${e.message || e}`);
  }

  if (elements instanceof Array && fill instanceof Function) {
    try {
      elements.forEach(quantity => {
        const array = new Array(quantity);
        fill(array);

        testParams.sorts.forEach(sort => post.result(sortTest.run(sort, array)));
      });
    } catch (e) {
      post.error(`Test execution: ${e.message}`);
    }
  }

  post.result(null);
});

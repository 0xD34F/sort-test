function sort_test_function() {

var sortTest = (function() {
    var stats = {};

    function random(max, min) {
        min = min || 0;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function resetStats() {
        stats.compares = 0;
        stats.swaps = 0;
        stats.startTime = new Date();
    }

    function compare(a, b) {
        stats.compares++;

        return a - b;
    }

    function swap(array, i, j) {
        stats.swaps++;

        var t = array[i];
        array[i] = array[j];
        array[j] = t;
    }

    var sorts = {
        bubble: function(array) {
            for (var i = 1; i < array.length; i++) {
                for (var j = i; j > 0; j--) {
                    if (compare(array[j], array[j - 1]) < 0) {
                        swap(array, j, j - 1);
                    }
                }
            }

            return array;
        },
        comb: function(array) {
            var gap = array.length,
                shrink = 1.3,
                sorted = false;

            while (!sorted) {
                gap = Math.floor(gap / shrink);
                if (gap > 1) {
                    sorted = false;
                } else {
                    gap = 1;
                    sorted = true;
                }

                var i = 0;
                while (i + gap < array.length) {
                    if (compare(array[i], array[i + gap]) > 0) {
                        swap(array, i, i + gap);
                        sorted = false;
                    }

                    i++;
                }
            }
        },
        insertion: function(array) {
            for (var i = 1; i < array.length; i++) {
                var x = array[i];

                for (var j = i; j > 0 && compare(array[j - 1], x) > 0; j--) {
                    array[j] = array[j - 1];
                }

                array[j] = x;
            }

            return array;
        },
        selection: function(array) {
            for (var i = 0; i < array.length - 1; i++) {
                var minIndex = i,
                    minValue = array[i];

                for (var j = i + 1; j < array.length; j++) {
                    if (compare(minValue, array[j]) > 0) {
                        minValue = array[j];
                        minIndex = j;
                    }
                }

                if (i !== minIndex) {
                    swap(array, i, minIndex);
                }
            }

            return array;
        },
        quick: (function() {
            function partition(array, left, right) {
                var x = array[right],
                    i = left - 1;

                for (var j = left; j < right; j++) {
                    if (compare(array[j], x) <= 0) {
                        i++;
                        swap(array, i, j);
                    }
                }

                swap(array, i + 1, right);

                return i + 1;
            }

            return function(array) {
                var left = 0,
                    right = array.length - 1,
                    top = -1;

                var stack = new Array(array.length);

                stack[++top] = left;
                stack[++top] = right;

                while (top >= 0) {
                    right = stack[top--];
                    left = stack[top--];

                    var p = partition(array, left, right);
 
                    if (p - 1 > left) {
                        stack[++top] = left;
                        stack[++top] = p - 1;
                    }
 
                    if (p + 1 < right) {
                        stack[++top] = p + 1;
                        stack[++top] = right;
                    }
                }
            }
        })()
    };

    return {
        generateArray: {
            random: function(size) {
                size = size || 100000;
                var array = new Array(size);

                for (var i = 0; i < size; i++) {
                    array[i] = random(size);
                }

                return array;
            },
            sorted: function(size) {
                size = size || 100000;
                var array = new Array(size);

                for (var i = 0; i < size; i++) {
                    array[i] = i;
                }

                return array;
            },
            sortedReverse: function(size) {
                size = size || 100000;
                var array = new Array(size);

                for (var i = 0; i < size; i++) {
                    array[i] = size - i;
                }

                return array;
            }
        },
        run: function(sort, array) {
            var arrayCopy = array.slice(0);
            resetStats();
            sorts[sort](arrayCopy);

            return {
                sort: sort,
                elements: arrayCopy.length,
                compares: stats.compares,
                swaps: stats.swaps,
                time: new Date() - stats.startTime
            };
        }
    };
})();


self.addEventListener('message', function(e) {
    var testParams = e.data;

    for (var i = 0; i < testParams.elements.length; i++) {
        var array = sortTest.generateArray[testParams.fill](testParams.elements[i]);

        for (var j = 0; j < testParams.sort.length; j++) {
            var testResult = sortTest.run(testParams.sort[j], array);
            testResult.fill = testParams.fill;
            self.postMessage(testResult);
        }
    }
});

} // sort_test_function

if (window !== self) {
    sort_test_function();
}
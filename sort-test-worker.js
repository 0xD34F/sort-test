function random(max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min)) + min;
}

var sortTest = (function() {
    var stats = {};

    function resetStats() {
        stats.comparisons = 0;
        stats.swaps = 0;
        stats.startTime = new Date();
    }

    function compare(a, b) {
        stats.comparisons++;

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

                for (var i = 0; i < array.length - gap; i++) {
                    if (compare(array[i], array[i + gap]) > 0) {
                        swap(array, i, i + gap);
                        sorted = false;
                    }
                }
            }

            return array;
        },
        counting: function(array) {
            var count = [];
            for (var i = 0; i < array.length; i++) {
                count[array[i]] = (count[array[i]] || 0) + 1;
            }

            var index = 0;
            for (i = 0; i < count.length; i++) {
                while (count[i]--) {
                    array[index++] = i;
                }
            }

            return array;
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
        heap: (function() {
            function heapify(array, index, size) {
                var left = 2 * index + 1,
                    right = 2 * index + 2,
                    largest = index;

                if (left < size && compare(array[left], array[index]) > 0) {
                    largest = left;
                }

                if (right < size && compare(array[right], array[largest]) > 0) {
                    largest = right;
                }

                if (largest !== index) {
                    swap(array, index, largest);
                    heapify(array, largest, size);
                }
            }

            function buildMaxHeap(array) {
                for (var i = Math.floor(array.length / 2); i >= 0; i--) {
                    heapify(array, i, array.length);
                }
            }

            return function(array) {
                var size = array.length;
                buildMaxHeap(array);

                for (var i = array.length - 1; i > 0; i--) {
                    swap(array, 0, i);
                    size--;
                    heapify(array, 0, size);
                }

                return array;
            }
        })(),
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

                return array;
            }
        })()
    };

    return function(sort, array) {
        var arrayCopy = array.slice(0);
        resetStats();
        sorts[sort](arrayCopy);

        return {
            sort: sort,
            elements: array.length,
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            time: new Date() - stats.startTime
        };
    };
})();


var post = {
    testID: null,
    result: function(data) {
        self.postMessage({
            id: post.testID,
            results: data
        });
    },
    error: function(data) {
        self.postMessage({
            id: post.testID,
            error: data
        });
    }
}


self.addEventListener('message', function(e) {
    post.testID = e.data.id;

    var testParams = e.data.params;

    var elements = null;
    try {
        elements = eval('(' + testParams.elements + ')');
        if (elements instanceof Function) {
            elements = elements();
        }
        if (!(elements instanceof Array)) {
            throw 'not an array';
        }
    } catch (exception) {
        post.error('Arrays sizes: ' + (exception.message || exception));
    }

    var fill = null;
    try {
        fill = eval('(' + testParams.fill + ')');
        if (!(fill instanceof Function)) {
            throw 'not a function';
        }
    } catch (exception) {
        post.error('Arrays fill: ' + (exception.message || exception));
    }

    if (elements instanceof Array && fill instanceof Function) {
        try {
            for (var i = 0; i < elements.length; i++) {
                var array = new Array(elements[i]);
                fill(array);

                for (var j = 0; j < testParams.sort.length; j++) {
                    var testResult = sortTest(testParams.sort[j], array);
                    testResult.fill = testParams.fill;
                    post.result(testResult);
                }
            }
        } catch (exception) {
            post.error('Test execution: ' + exception.message);
        }
    }

    post.result(null);
});

var sortTest = (function() {
    var currentTest = null;

    //var worker = new Worker('sort-test-worker.js');
    var worker = new Worker(URL.createObjectURL(new Blob(["("+sort_test_function.toString()+")()"], {type: 'text/javascript'})));

    worker.addEventListener('message', function(e) {
        // игнорируются результаты всех тестов, кроме текущего
        if (currentTest !== e.data.id) {
            return;
        }

        if (e.data.results) {
            addResult(e.data.results);
        } else {
            currentTest = null;
            document.dispatchEvent(new CustomEvent('sort-test-ended', {}));
        }
    });

    function resetResultArrays() {
        sortTest.rawResults = [];

        for (t in sortTest.tests) {
            for (var i = 0; i < sortTest.tests[t].chartData.length; i++) {
                sortTest.tests[t].chartData[i].values = [];
            }
        }

        updateCharts();
    }

    function addResult(data) {
        sortTest.rawResults.push(data);

        for (var t in sortTest.tests) {
            var values = sortTest.tests[t].chartData[sortTest.sorts[data.sort].seriesNum].values;
            values.push({
                x: data.elements,
                y: data[t]
            });
            // на тот случай, если данные придут не в том порядке
            values.sort(function(a, b) {
                return a.x - b.x;
            });
        }

        updateCharts();
    }

    function updateCharts() {
        for (var t in sortTest.tests) {
            sortTest.tests[t].chart.update();
        }
    }

    return {
        sorts: {
            bubble: {
                color: '#0f5ac6'
            },
            selection: {
                color: '#e3d844'
            },
            insertion: {
                color: '#8c2ee0'
            },
            comb: {
                color: '#1fef2b'
            },
            heap: {
                color: '#f33c2e'
            },
            quick: {
                color: '#91bcd5'
            }
        },
        tests: {
            comparisons: {
                title: 'Comparisons',
                chartID: 'sortTestResultsCompares',
                yAxisLabel: 'Number of comparisons'
            },
            swaps: {
                title: 'Swaps',
                chartID: 'sortTestResultsSwaps',
                yAxisLabel: 'Number of swaps'
            },
            time: {
                title: 'Run time',
                chartID: 'sortTestResultsTime',
                yAxisLabel: 'Milliseconds'
            }
        },
        testArraysSizes: '[ 1000, 2000, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000 ]',
        testArraysFill:
'function(array) {\n\
    for (var i = 0; i < array.length; i++) {\n\
        array[i] = random(array.length);\n\
    }\n\
}',
        rawResults: [],
        initCharts: function(chartsContainerID) {
            var charts = document.getElementById(chartsContainerID);

            for (var t in sortTest.tests) {
                var test = sortTest.tests[t];

                charts.innerHTML += '<div class="chart-wrapper"><span class="chart-title">' + test.title + '</span><div class="chart" id="' + test.chartID + '"><svg></svg></div></div>';

                var c = test.chart = nv.models.lineChart().margin({ left: 150 });

                c.xAxis
                    .axisLabel('Number of elements')
                    .tickFormat(d3.format(',r'));

                c.yAxis
                    .axisLabel(test.yAxisLabel)
                    .axisLabelDistance(50)
                    .tickFormat(d3.format(',r'));
            }

            nv.utils.windowResize(updateCharts);

            for (var i in sortTest.sorts) {
                for (t in sortTest.tests) {
                    var d = sortTest.tests[t].chartData = sortTest.tests[t].chartData || [];
                    d.push({
                        key: i,
                        values: [],
                        color: sortTest.sorts[i].color
                    });
                    sortTest.sorts[i].seriesNum = d.length - 1;
                }
            }

            for (var t in sortTest.tests) {
                d3.select('#' + sortTest.tests[t].chartID + ' svg')
                    .datum(sortTest.tests[t].chartData)
                    .call(sortTest.tests[t].chart);
            }
        },
        run: function(testParams) {
            if (!currentTest) {
                currentTest = +new Date();
                resetResultArrays();

                var test = {
                    id: currentTest,
                    params: testParams
                };

                worker.postMessage(test);
                document.dispatchEvent(new CustomEvent('sort-test-started', test));
            }
        }
    }
})();

window.onload = function() {
    sortTest.initCharts('charts');

    document.getElementById('runTest').onclick = function() {
        sortTest.run({
            sort: Object.keys(sortTest.sorts),
            elements: sortTest.testArraysSizes,
            fill: sortTest.testArraysFill
        });
    };

    var openEditor = function(e) {
        var propName = sortTest.editing = e.target.getAttribute('propName');

        document.getElementById('testArraysEditor').value = sortTest[propName];
        document.getElementsByClassName('source')[0].classList.remove('hidden');
        document.getElementsByClassName('overlay')[0].classList.remove('hidden');
    };
    document.getElementById('testArraysSizes').onclick = openEditor;
    document.getElementById('testArraysFill').onclick = openEditor;

    var closeEditor = function() {
        document.getElementsByClassName('source')[0].classList.add('hidden');
        document.getElementsByClassName('overlay')[0].classList.add('hidden');
    };
    document.getElementById('BCancel').onclick = closeEditor;
    document.getElementById('BOK').onclick = function() {
        sortTest[sortTest.editing] = document.getElementById('testArraysEditor').value;
        closeEditor();
    };

    document.addEventListener('sort-test-started', function() {
        document.getElementById('runTest').setAttribute('disabled', 'disabled');
    });

    document.addEventListener('sort-test-ended', function() {
        document.getElementById('runTest').removeAttribute('disabled');
    });
};

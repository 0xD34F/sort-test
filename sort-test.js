﻿var sortTest = (function() {
    var lock = false;

    //var worker = new Worker('sort-test-worker.js');
    var worker = new Worker(URL.createObjectURL(new Blob(["("+sort_test_function.toString()+")()"], {type: 'text/javascript'})));

    worker.addEventListener('message', function(e) {
        console.log(e);
        if (e.data.results) {
            addResult(e.data.results);
        } else {
            lock = false;
            document.dispatchEvent(new CustomEvent('sort-test-ended', {}));
        }
    });

    function resetResultArrays() {
        for (t in sortTest.tests) {
            for (var i = 0; i < sortTest.tests[t].chartData.length; i++) {
                sortTest.tests[t].chartData[i].values = [];
            }
        }

        updateCharts();
    }

    function addResult(data) {
        for (var t in sortTest.tests) {
            sortTest.tests[t].chartData[sortTest.sorts[data.sort].seriesNum].values.push({
                x: data.elements,
                y: data[t]
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
            compares: {
                chartID: 'sortTestResultsCompares',
                yAxisLabel: 'Number of compares'
            },
            swaps: {
                chartID: 'sortTestResultsSwaps',
                yAxisLabel: 'Number of swaps'
            },
            time: {
                chartID: 'sortTestResultsTime',
                yAxisLabel: 'Milliseconds'
            }
        },
        initCharts: function(chartsContainerID) {
            var charts = document.getElementById(chartsContainerID);

            for (var t in sortTest.tests) {
                charts.innerHTML += '<div class="graph" id="' + sortTest.tests[t].chartID + '"><svg></svg></div>';

                var c = sortTest.tests[t].chart = nv.models.lineChart().margin({ left: 150 });

                c.xAxis
                    .axisLabel('Number of elements')
                    .tickFormat(d3.format(',r'));

                c.yAxis
                    .axisLabel(sortTest.tests[t].yAxisLabel)
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
            if (!lock) {
                lock = true;
                resetResultArrays();

                var test = {
                    id: +new Date(),
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
            elements: [ 100, 500, 1000, 2000, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000 ],
            fill: document.getElementById('testData').value
        });
    };

    document.addEventListener('sort-test-started', function() {
        document.getElementById('runTest').setAttribute('disabled', 'disabled');
    });

    document.addEventListener('sort-test-ended', function() {
        document.getElementById('runTest').removeAttribute('disabled');
    });
};
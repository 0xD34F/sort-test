// CustomEvent polyfill for IE
(function () {
    if (typeof window.CustomEvent === 'function') {
        return false;
    }

    function CustomEvent (event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();


var sortTest = (function() {
    var currentTest = null,
        worker = null;

    function onMessage(e) {
        // игнорируются результаты всех тестов, кроме текущего
        if (currentTest !== e.data.id) {
            return;
        }

        if (e.data.results) {
            addResult(e.data.results);
        } else if (e.data.results === null) {
            sortTest.stop();
        } else if (e.data.error) {
            var errors = document.getElementById('errors');
            errors.classList.remove('hidden');
            errors.innerHTML += (errors.innerHTML ? '<br>' : '') + e.data.error;
        }
    }

    function resetResultArrays(sorts) {
        sortTest.rawResults = [];

        for (var t in sortTest.tests) {
            sortTest.tests[t].chartData = [];
        }

        for (var i = 0; i < sorts.length; i++) {
            var sort = sorts[i];

            for (t in sortTest.tests) {
                var d = sortTest.tests[t].chartData;
                d.push({
                    key: sort,
                    values: [],
                    color: sortTest.sorts[sort].color
                });
                sortTest.sorts[sort].seriesNum = d.length - 1;
            }
        }

        for (var t in sortTest.tests) {
            d3.select('#' + sortTest.tests[t].chartID + ' svg')
                .datum(sortTest.tests[t].chartData)
                .call(sortTest.tests[t].chart);
        }
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
            var c = sortTest.tests[t].chart;
            if (c && c.update) {
                c.update();
            }
        }
    }

    return {
        sorts: {
            bubble: {
                color: '#0f5ac6'
            },
            oddEven: {
                color: '#ff960b'
            },
            gnome: {
                color: '#029311'
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
            counting: {
                color: '#ff67eb'
            },
            heap: {
                color: '#ff0000'
            },
            quick: {
                color: '#91bcd5'
            }
        },
        tests: {
            comparisons: {
                title: 'Comparisons',
                chartID: 'sortTestResultsComparisons',
                unit: 'Comparisons'
            },
            swaps: {
                title: 'Swaps',
                chartID: 'sortTestResultsSwaps',
                unit: 'Swaps'
            },
            time: {
                title: 'Run time',
                chartID: 'sortTestResultsTime',
                unit: 'Milliseconds'
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
        init: function() {
            var charts = document.getElementById('charts'),
                sorts = document.getElementById('sorts');

            for (var t in sortTest.tests) {
                var test = sortTest.tests[t];

                charts.innerHTML += '<div class="chart-wrapper"><span class="chart-title">' + test.title + '</span><div class="chart" id="' + test.chartID + '"><svg></svg></div></div>';

                var c = test.chart = nv.models.lineChart().margin({ left: 150, right: 50 });

                c.tooltip.headerFormatter(function(d) {
                    return d + ' elements';
                });

                c.tooltip.valueFormatter((function(k) {
                    return function(d) {
                        return d + ' ' + k;
                    };
                })(test.unit.toLowerCase()));

                c.xAxis
                    .axisLabel('Number of elements')
                    .tickFormat(d3.format(',r'));

                c.yAxis
                    .axisLabel(test.unit)
                    .axisLabelDistance(50)
                    .tickFormat(d3.format(',r'));
            }

            nv.utils.windowResize(updateCharts);

            for (var i in sortTest.sorts) {
                sorts.innerHTML += '<label class="sort-checkbox"><input sort-name="' + i + '" type="checkbox" checked>' + i + '</label>';
            }
        },
        isTesting: function() {
            return !!currentTest;
        },
        start: function(testParams) {
            if (!currentTest) {
                worker = new Worker('sort-test-worker.js');
                worker.addEventListener('message', onMessage);
                currentTest = +new Date();
                resetResultArrays(testParams.sort);

                var test = {
                    id: currentTest,
                    params: testParams
                };

                worker.postMessage(test);
                document.dispatchEvent(new CustomEvent('sort-test-started', {
                    detail: test
                }));
            }
        },
        stop: function() {
            if (currentTest) {
                worker.terminate();
                worker = null;
                document.dispatchEvent(new CustomEvent('sort-test-ended', {
                    detail: {
                        id: currentTest
                    }
                }));
                currentTest = null;
            }
        }
    }
})();

function getCursorPos(input) {
    if ('selectionStart' in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    } else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var range = input.createTextRange();
            range.moveToBookmark(sel.getBookmark());
            for (var len = 0; range.compareEndPoints('EndToStart', range) > 0; range.moveEnd('character', -1)) {
                len++;
            }
            range.setEndPoint('StartToStart', input.createTextRange());
            for (var pos = { start: 0, end: len }; range.compareEndPoints('EndToStart', range) > 0; range.moveEnd('character', -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }

    return -1;
}

function setCursorPos(input, start, end) {
    if (arguments.length < 3) {
        end = start;
    }

    if ('selectionStart' in input) {
        setTimeout(function() {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.moveStart('character', start);
        range.collapse();
        range.moveEnd('character', end - start);
        range.select();
    }
}

window.onload = function() {
    sortTest.init();

    document.getElementById('runTest').onclick = function() {
        if (sortTest.isTesting()) {
            sortTest.stop();
        } else {
            var sorts = [];
            [].push.apply(sorts, document.querySelectorAll('#sorts input'));

            sortTest.start({
                sort: sorts.map(function(n) {
                    return n.checked ? n.getAttribute('sort-name') : null;
                }).filter(function(n) {
                    return !!n;
                }),
                elements: sortTest.testArraysSizes,
                fill: sortTest.testArraysFill
            });
        }
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
    document.getElementsByClassName('overlay')[0].onclick = closeEditor;

    document.getElementById('testArraysEditor').onkeydown = function(e) {
        if (e.keyCode == 9) {
            e.preventDefault();

            var tab = '    ';
            var cursorPos = getCursorPos(e.target);
            e.target.value = e.target.value.slice(0, cursorPos.start) + tab + e.target.value.slice(cursorPos.end);
            setCursorPos(e.target, cursorPos.start + tab.length);
        }
    };

    document.addEventListener('sort-test-started', function() {
        var errors = document.getElementById('errors');
        errors.classList.add('hidden');
        errors.innerHTML = '';

        document.getElementById('runTest').innerHTML = 'Stop test';
    });

    document.addEventListener('sort-test-ended', function() {
        document.getElementById('runTest').innerHTML = 'Run test';
    });
};

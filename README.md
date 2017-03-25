## Comparison of sorting algorithms

Algorithms available for testing:

| Algorithm        | Complexity (best)    | Complexity (worst)    |
|------------------|----------------------|-----------------------|
| bubble           | O(N)                 | O(N^2)                |
| selection        | O(N^2)               | O(N^2)                |
| insertion        | O(N)                 | O(N^2)                |
| comb             | O(N log N)           | O(N^2)                |
| quick            | O(N log N)           | O(N^2)                |
| heap             | O(N log N)           | O(N log N)            |

Characteristics of algorithms available to comparison:
* Number of comparisons
* Number of swaps
* Run time

### Test arrays sizes definition

You can determine the sizes of the test arrays directly:
```
[ 10000, 20000, 30000, 40000, 50000 ]
```
Or it could be a function returning array of sizes:
```
function() {
    var s = [];
    for (var i = 1; i <= 5; i++) {
        a.push(i * 10000);
    }
    return s;
}
```

### Test arrays fill

It is necessary to define a function that takes as an argument an array to fill. For example:
```
function(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = random(1000);
    }
}
```

### [Demo](https://0xd34f.github.io/sort-test/)

[![Sort test](https://raw.githubusercontent.com/0xD34F/sort-test/master/sort-test-screenshot.png)](https://0xd34f.github.io/sort-test/)

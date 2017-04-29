# Comparison of sorting algorithms

[https://0xd34f.github.io/sort-test/](https://0xd34f.github.io/sort-test/)

Algorithms available for testing:

| Algorithm        | Complexity         |
|------------------|--------------------|
| bubble           | O(N^2)             |
| selection        | O(N^2)             |
| insertion        | O(N^2)             |
| comb             | O(N log N)         |
| counting         | O(N)               |
| quick            | O(N log N)         |
| heap             | O(N log N)         |

Characteristics of algorithms available to comparison:
* Number of comparisons
* Number of swaps
* Run time

## Test arrays sizes definition

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

## Test arrays fill

It is necessary to define a function that takes as an argument an array to fill. For example:
```
function(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = random(1000);
    }
}
```
Since the comparison of the elements of test arrays is performed through the subtraction, it is assumed that the test arrays will be filled with numbers.

function partition(array, left, right) {
  let
    x = array[right],
    i = left - 1;

  for (let j = left; j < right; j++) {
    if (this.compare(array[j], x) <= 0) {
      i++;
      this.swap(array, i, j);
    }
  }

  this.swap(array, i + 1, right);

  return i + 1;
}

export default function quick(array) {
  let
    left = 0,
    right = array.length - 1,
    top = -1;

  let stack = new Array(array.length);

  stack[++top] = left;
  stack[++top] = right;

  while (top >= 0) {
    right = stack[top--];
    left = stack[top--];

    let p = partition.call(this, array, left, right);

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
};
